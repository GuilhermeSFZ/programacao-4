// 1. Inicializa o objeto de áudio (certifique-se de que o caminho do arquivo esteja correto)
if (!window.bgAudio) {
    window.bgAudio = new Audio('audio/tema-grishaverse.mp3');
    window.bgAudio.loop = true;
}
const audio = window.bgAudio;

// 2. Elementos da interface
const btnToggle = document.getElementById('btn-audio-toggle');
const icon = document.getElementById('audio-icon');
const text = document.getElementById('audio-text');

// 3. Função para atualizar a interface (ícones e texto)
function updateAudioUI(isPlaying) {
    if (isPlaying) {
        icon.src = "https://www.svgrepo.com/show/378708/sound-on.svg";
        text.textContent = "Pausar Música";
    } else {
        icon.src = "https://www.svgrepo.com/show/463178/sound-mute-alt.svg";
        text.textContent = "Tocar Música";
    }
}

// 4. Lógica de inicialização baseada no localStorage
function initAudio() {
    const isPlaying = localStorage.getItem('musicPlaying') === 'true';
    const savedTime = parseFloat(localStorage.getItem('musicTime') || '0');

    audio.currentTime = savedTime;

    if (isPlaying) {
        audio.play().catch(err => console.log("Aguardando interação do usuário"));
        updateAudioUI(true);
    } else {
        updateAudioUI(false);
    }
}

// 5. Salva o tempo atual para persistência entre páginas
setInterval(() => {
    if (!audio.paused) {
        localStorage.setItem('musicTime', audio.currentTime);
    }
}, 1000);

// 6. Listener do botão de controle
if (btnToggle) {
    btnToggle.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            localStorage.setItem('musicPlaying', 'true');
            updateAudioUI(true);
        } else {
            audio.pause();
            localStorage.setItem('musicPlaying', 'false');
            updateAudioUI(false);
        }
    });
}

// Executa ao carregar
initAudio();