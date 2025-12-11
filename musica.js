document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('bg-music');
    const toggleBtn = document.getElementById('audio-toggle');
    const fadeDuration = 800; 
    const maxVolume = 0.3; 
    
    const playlist = {
        '/': 'OST/Samba.mp3',
        '/index.html': 'OST/Samba.mp3',
        '/galeria': 'OST/Samba.mp3',
        'default': 'OST/Samba.mp3' 
    };

    const path = window.location.pathname;
    const cleanPath = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
    
    const source = playlist[cleanPath] || playlist['default'];
    audioPlayer.src = source;
    audioPlayer.volume = 0; 

    let isMuted = localStorage.getItem('site_muted') === 'true';
    updateMuteUI();

    if (!isMuted) {
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                fadeIn();
            }).catch(error => {
                console.log("Autoplay bloqueado. Aguardando interação.");
            });
        }
    }

    function updateMuteUI() {
        if (isMuted) {
            toggleBtn.classList.add('muted');
            audioPlayer.muted = true;
        } else {
            toggleBtn.classList.remove('muted');
            audioPlayer.muted = false;
        }
    }

    toggleBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        localStorage.setItem('site_muted', isMuted);
        
        if (!isMuted) {
            if (audioPlayer.paused) {
                audioPlayer.play().then(fadeIn);
            } else {
                audioPlayer.muted = false;
            }
        } else {
            audioPlayer.muted = true;
        }
        updateMuteUI();
    });

    function fadeIn() {
        if (isMuted) return;
        let vol = 0;
        const interval = 50;
        const step = maxVolume / (fadeDuration / interval);

        const fade = setInterval(() => {
            if (vol < maxVolume) {
                vol += step;
                audioPlayer.volume = Math.min(vol, maxVolume);
            } else {
                clearInterval(fade);
            }
        }, interval);
    }

    function fadeOut(callback) {
        if (audioPlayer.paused || isMuted) {
            callback();
            return;
        }

        let vol = audioPlayer.volume;
        const interval = 50;
        const step = vol / (fadeDuration / interval);

        const fade = setInterval(() => {
            if (vol > 0) {
                vol -= step;
                audioPlayer.volume = Math.max(vol, 0);
            } else {
                clearInterval(fade);
                audioPlayer.pause();
                callback();
            }
        }, interval);
    }
    
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#') || href.startsWith('mailto:') || this.target === '_blank') return;
            
            e.preventDefault();

            fadeOut(() => {
                window.location.href = href;
            });
        });
    });
});