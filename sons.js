document.addEventListener('DOMContentLoaded', () => {
    if (typeof Tone === 'undefined') {
        console.error("Tone.js não foi encontrado. Adicione o script da biblioteca ao seu HTML.");
        return;
    }

    const hoverSound = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0.2, release: 0.1 },
    }).toDestination();
    hoverSound.volume.value = -24;

    const clickSound = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.005, decay: 0.2, sustain: 0, release: 0.1 },
    }).toDestination();
    clickSound.volume.value = -15;

    const startAudioContext = () => {
        if (Tone.context.state !== 'running') {
            Tone.start();
        }
    };

    const hoverSelectors = 'a, img, .control-btn, .module-card, #search-bar, input[type="range"], .page-content header nav a, .settings-btn';
    const clickSelectors = 'a, img, .control-btn, .module-card, .page-content header nav a, .settings-btn';

    document.body.addEventListener('mouseenter', (event) => {
       
        if (event.target.closest(hoverSelectors)) {
            startAudioContext();
            hoverSound.triggerAttackRelease('C5', '16n');
        }
    }, true);

    document.body.addEventListener('click', (event) => {
        if (event.target.closest(clickSelectors)) {
            startAudioContext();
            clickSound.triggerAttackRelease('G5', '16n');
        }
    });

    console.log("Sistema de efeitos sonoros inicializado com delegação de eventos.");
});