
const API_BASE_URL = 'http://localhost:3000'; // Ajuste se a porta for diferente
let bgMusic = null;

// Função assíncrona para obter a música da API e configurar o áudio
async function inicializarMusica() {
    try {
        // Exemplo de rota: ajuste para o endpoint correto da sua API (ex: /music, /settings/music, etc.)
        const response = await fetch(`${API_BASE_URL}/music`); 
        if (!response.ok) throw new Error('Erro ao buscar trilha sonora da API');
        
        const dadosMusica = await response.json();
        
        // Supondo que a API retorne algo como { url: "http://localhost:3000/audio/sombra-e-ossos.mp3" }
        // ou { url: "audio/sombra-e-ossos.mp3" }
        let urlFinal = dadosMusica.url;
        if (!urlFinal.startsWith('http')) {
            urlFinal = `${API_BASE_URL}/${urlFinal}`;
        }

        // Instancia o objeto de áudio com a URL da API
        bgMusic = new Audio(urlFinal);
        bgMusic.loop = true;

        // Recupera o progresso salvo no localStorage para não reiniciar do zero ao mudar de página
        const savedTime = localStorage.getItem('musicTime');
        if (savedTime) {
            bgMusic.currentTime = parseFloat(savedTime);
        }

        // Monitora e salva o tempo atual do áudio a cada segundo
        bgMusic.addEventListener('timeupdate', () => {
            localStorage.setItem('musicTime', bgMusic.currentTime.toString());
        });

        // Verifica se a música deve começar tocando
        const isMusicPlaying = localStorage.getItem('musicPlaying');
        if (isMusicPlaying === 'true') {
            tentarTocar();
        }

    } catch (error) {
        console.error('Não foi possível carregar a música da API:', error);
    }
}

// Lida com a restrição de autoplay do navegador
function tentarTocar() {
    if (!bgMusic) return;

    bgMusic.play().catch(() => {
        // Se o navegador bloquear, aguarda qualquer clique na tela para iniciar
        const interacaoUsuario = () => {
            if (bgMusic) {
                bgMusic.play();
                localStorage.setItem('musicPlaying', 'true');
            }
            document.removeEventListener('click', interacaoUsuario);
            document.removeEventListener('keydown', interacaoUsuario);
        };
        document.addEventListener('click', interacaoUsuario);
        document.addEventListener('keydown', interacaoUsuario);
    });
}

// Inicializa o processo assim que o arquivo é carregado
inicializarMusica();