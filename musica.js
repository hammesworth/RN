document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('bg-music');
    const toggleBtn   = document.getElementById('audio-toggle');

    if (!audioPlayer || !toggleBtn) return;

    /* ================= CONFIG ================= */
    const fadeDuration = 800;
    const maxVolume    = 0.3;

    /* ================= PLAYLIST ================= */
    const playlist = {
        'index.html': 'OST/Samba.mp3',
        'curiosidades.html': 'OST/Ficar.mp3',
        'referencias.html': 'OST/Feiticeira.m4a'
    };

    /* ================= PAGE NAME ================= */
    const page = location.pathname.split('/').pop() || 'index.html';
    const source = playlist[page];

    /* Em páginas sem música, bem, não faz merda nenhuna */
    if (!source) return;

    /* ================= ESTADO ================= */
    let isMuted       = localStorage.getItem('site_muted') === 'true';
    let hasInteracted = localStorage.getItem('site_interacted') === 'true';

    audioPlayer.src    = source;
    audioPlayer.volume = 0;
    audioPlayer.muted  = isMuted;

    updateMuteUI();

    /* ================= AUTOPLAY CONTROLADO ================= */
    audioPlayer.addEventListener('loadedmetadata', () => {
        audioPlayer.currentTime = 0;

        if (!isMuted && hasInteracted) {
            audioPlayer.play().then(fadeIn).catch(() => {});
        }
    });

    /* ================= BOTÃO MUTE ================= */
    toggleBtn.addEventListener('click', () => {
        hasInteracted = true;
        localStorage.setItem('site_interacted', 'true');

        isMuted = !isMuted;
        localStorage.setItem('site_muted', isMuted);

        if (isMuted) {
            fadeOut(() => audioPlayer.muted = true);
        } else {
            audioPlayer.muted = false;
            audioPlayer.play().then(fadeIn).catch(() => {});
        }

        updateMuteUI();
    });

    /* ================= LINKS COM FADE ================= */
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');

            if (
                !href ||
                href.startsWith('#') ||
                href.startsWith('mailto:') ||
                link.target === '_blank'
            ) return;

            e.preventDefault();

            fadeOut(() => {
                location.href = href;
            });
        });
    });

    /* ================= FUNÇÕES ================= */

    function updateMuteUI() {
        toggleBtn.classList.toggle('muted', isMuted);
    }

    function fadeIn() {
        let vol = 0;
        audioPlayer.volume = 0;

        const step = maxVolume / (fadeDuration / 50);

        const fade = setInterval(() => {
            if (vol < maxVolume && !isMuted) {
                vol += step;
                audioPlayer.volume = Math.min(vol, maxVolume);
            } else {
                clearInterval(fade);
            }
        }, 50);
    }

    function fadeOut(callback) {
        if (audioPlayer.paused || isMuted) {
            callback?.();
            return;
        }

        let vol = audioPlayer.volume;
        const step = vol / (fadeDuration / 50);

        const fade = setInterval(() => {
            if (vol > 0) {
                vol -= step;
                audioPlayer.volume = Math.max(vol, 0);
            } else {
                clearInterval(fade);
                audioPlayer.pause();
                callback?.();
            }
        }, 50);
    }
});
