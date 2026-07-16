// --- ANIMAÇÃO DOS AMPLIFICADORES COM SUPORTE À API ---
async function invocarAmplificador(caminhoOuUrl, corLuz, tipo, corExplosao) {
    const container = document.getElementById('espaco-magico');
    if (!container) return;
    
    container.innerHTML = '';

    let urlFinalDaImagem = caminhoOuUrl;

    // Se o parâmetro enviado começar com "http", buscamos o registro correspondente na API de imagens
    if (caminhoOuUrl.startsWith('http')) {
        try {
            const response = await fetch(caminhoOuUrl);
            if (response.ok) {
                const dadosImagem = await response.json();
                
                if (dadosImagem.gallery && dadosImagem.gallery.length > 0) {
                    urlFinalDaImagem = dadosImagem.gallery[0].url;
                } else {
                    urlFinalDaImagem = caminhoOuUrl;
                }
            }
        } catch (error) {
            console.error("Erro ao buscar imagem do amplificador na API:", error);
        }
    }

    // 1. Criar Luz de Fundo
    const luz = document.createElement('div');
    luz.className = 'luz-fundo';
    luz.style.background = `radial-gradient(circle, white 0%, ${corExplosao} 30%, rgba(255,255,255,0) 70%)`;
    luz.style.animation = "explosaoLuz 6s ease-out forwards";
    
    // 2. Criar o Animal
    const bicho = document.createElement('div');
    bicho.className = 'bicho-espiritual';
    
    if (tipo === 'detalhe') {
        bicho.style.backgroundImage = `url('${urlFinalDaImagem}')`;
        bicho.style.filter = `sepia(1) saturate(20) hue-rotate(10deg) brightness(1.2) drop-shadow(0 0 20px ${corLuz})`;
    } 
    else if (tipo === 'solido') {
        bicho.style.webkitMaskImage = `url('${urlFinalDaImagem}')`;
        bicho.style.maskImage = `url('${urlFinalDaImagem}')`;
        bicho.style.backgroundColor = corLuz;
        bicho.style.filter = `drop-shadow(0 0 25px ${corLuz})`;
    }
    else {
        bicho.style.backgroundImage = `url('${urlFinalDaImagem}')`;
        bicho.style.filter = `invert(1) brightness(1.5) drop-shadow(0 0 20px ${corLuz})`;
    }

    bicho.style.animation = "animacaoPatrono 6s ease-in-out forwards";

    container.appendChild(luz);
    container.appendChild(bicho);

    setTimeout(() => { container.innerHTML = ''; }, 6500);
}

// --- CONFIGURAÇÃO DE ROTAS DA API ---
const API_BASE_URL = 'http://localhost:3000';

// ID para controle do autor no banco (Leigh Bardugo)
const AUTHOR_ID = 1; 

// --- FUNÇÃO CENTRAL PARA CARREGAR LIVROS E TODAS AS DEMAIS IMAGENS DA API ---
async function carregarLivrosEDetalhes() {
    try {
        // Busca todos os dados em lote do servidor
        const [booksResponse, imagesResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/books`),
            fetch(`${API_BASE_URL}/images`)
        ]);

        if (!booksResponse.ok) throw new Error('Erro ao buscar livros do servidor.');
        const livrosDoBanco = await booksResponse.json();

        const mapaDeCapas = {}; 

        if (imagesResponse.ok) {
            const imagensDoBanco = await imagesResponse.json();
            
            imagensDoBanco.forEach(registro => {
                if (registro.gallery && Array.isArray(registro.gallery) && registro.gallery.length > 0) {
                    const item = registro.gallery[0];
                    
                    // 1. Trata se a URL for local (como "img/...")
                    let urlTratada = item.url;
                    if (item.isLocal && !item.url.startsWith('http')) {
                        urlTratada = `${API_BASE_URL}/${item.url}`;
                    } else {
                        urlTratada = item.url;
                    }

                    // 2. DISTRIBUIÇÃO INTELIGENTE POR CATEGORIA (Evita erro de ordem de ID!)
                    
                    // Se for CAPA de livro:
                    if (item.category === 'capa') {
                        const nomeLivro = item.title.replace('Capa - ', '').trim().toLowerCase();
                        mapaDeCapas[nomeLivro] = urlTratada;
                    }
                    
                    // Se for PERSONAGEM:
                    // Procuramos um elemento HTML que tenha o ID igual ao nome do personagem simplificado (ex: id="alina-pic")
                    else if (item.category === 'personagem') {
                        // Extrai o primeiro nome (ex: "Alina Starkov por Kevin Wada" vira "alina")
                        const primeiroNome = item.title.split(' ')[0].toLowerCase(); 
                        const imgElement = document.getElementById(`${primeiroNome}-pic`);
                        if (imgElement) {
                            imgElement.src = urlTratada;
                            imgElement.alt = item.title;
                        }
                    }
                    
                    // Se for ORDEM (Brasões):
                    else if (item.category === 'ordem') {
                        // Tenta mapear pelo título do brasão de forma inteligente
                        let idClasse = "";
                        const tituloLower = item.title.toLowerCase();
                        
                        if (tituloLower.includes('darkling')) idClasse = 'darkling-crest';
                        else if (tituloLower.includes('heartrenders') || tituloLower.includes('sangradores')) idClasse = 'heartrender-crest';
                        else if (tituloLower.includes('healers') || tituloLower.includes('curandeiros')) idClasse = 'healer-crest';
                        else if (tituloLower.includes('squallers')) idClasse = 'squaller-crest';
                        else if (tituloLower.includes('inferni')) idClasse = 'inferni-crest';
                        else if (tituloLower.includes('tidemakers')) idClasse = 'tidemaker-crest';
                        else if (tituloLower.includes('durasts')) idClasse = 'durast-crest';
                        else if (tituloLower.includes('alkemi')) idClasse = 'alkemi-crest';

                        const imgElement = document.getElementById(idClasse);
                        if (imgElement) {
                            imgElement.src = urlTratada;
                            imgElement.alt = item.title;
                        }
                    }
                    
                    // Se for a AUTORA:
                    else if (item.category === 'autora') {
                        const imgElement = document.getElementById('author-pic');
                        if (imgElement) {
                            imgElement.src = urlTratada;
                            imgElement.alt = item.title;
                        }
                    }
                }
            });
        }

        // --- RENDERIZAÇÃO DOS LIVROS E SUAS CAPAS ---
        const ordemLivrosHTML = {
            1: "Sombra e Ossos",
            2: "Sol e Tormenta",
            3: "Ruína e Ascensão",
            4: "Six of Crows: Sangue e Mentiras",
            5: "Crooked Kingdom: Vingança e Redenção",
            6: "King of Scars: Trono de Ouro e Cinzas", 
            7: "Rule of Wolves: Trono de Prata e Noite"
        };

        Object.keys(ordemLivrosHTML).forEach(idHTML => {
            const tituloEsperado = ordemLivrosHTML[idHTML];
            const livroData = livrosDoBanco.find(l => l.title.trim().toLowerCase() === tituloEsperado.trim().toLowerCase());

            if (livroData) {
                const containerLivro = document.getElementById(`livro-${idHTML}`);
                if (containerLivro) {
                    const sinopseFormatada = livroData.content
                        .split('\n\n')
                        .map(p => `<p>${p}</p>`)
                        .join('<br>');

                    containerLivro.innerHTML = `
                        <h3>Sinopse</h3>
                        ${sinopseFormatada}
                        <br>
                        <table class="tabela-livro">
                            <thead>
                                <tr>
                                    <th colspan="2">Ficha Técnica</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Título original</strong></td>
                                    <td>${livroData.title}</td>
                                </tr>
                                <tr>
                                    <td><strong>Lançamento</strong></td>
                                    <td>${livroData.publicationYear}</td>
                                </tr>
                                <tr>
                                    <td><strong>Tradutor(es)</strong></td>
                                    <td>${livroData.translator || 'Não informado'}</td>
                                </tr>
                                <tr>
                                    <td><strong>Saga</strong></td>
                                    <td>${livroData.saga}</td>
                                </tr>
                            </tbody>
                        </table>
                    `;
                }

                // Atualiza a imagem da capa usando o mapa
                const chaveBusca = livroData.title.trim().toLowerCase();
                const urlCapa = mapaDeCapas[chaveBusca];
                if (urlCapa) {
                    const itemLivroElement = document.getElementById(`livro-${idHTML}`).parentElement;
                    const imgElement = itemLivroElement.querySelector('img.livro');
                    if (imgElement) {
                        imgElement.src = urlCapa;
                    }
                }
            }
        });

    } catch (error) {
        console.error('Erro ao conectar com a API de livros/imagens:', error);
    }
}

// --- CONTROLE DE EXIBIÇÃO DE LIVROS ---
function toggleLivro(id) {
    const todos = document.querySelectorAll('.livros .tabela-conteudo');

    todos.forEach(el => {
        if (el.id !== 'livro-' + id) {
            el.classList.remove('ativo');
        }
    });

    const atual = document.getElementById('livro-' + id);

    if (atual) {
        atual.classList.toggle('ativo');
    }
}

function togglePersonagem(id) {
    const atual = document.getElementById('personagem-' + id);

    const todos = document.querySelectorAll('.personagem-item .tabela-conteudo');

    todos.forEach(p => {
        if (p.id !== 'personagem-' + id) {
            p.classList.remove('ativo');
        }
    });

    if (atual) atual.classList.toggle('ativo');
}

// --- CONEXÃO COM A API DE AUTORES ---
async function carregarDadosDoBanco() {
    try {
        const response = await fetch(`${API_BASE_URL}/author/${AUTHOR_ID}`);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do servidor.');
        }

        const autor = await response.json();

        const authorNameEl = document.getElementById('author-name');
        if (authorNameEl) authorNameEl.textContent = autor.name;

        const containerBiografia = document.getElementById('author-biography');
        if (containerBiografia) {
            containerBiografia.innerHTML = autor.biography
                .split('\n')
                .map(paragrafo => `<p>${paragrafo}</p>`)
                .join('');
        }

        const linkWebsite = document.getElementById('author-website');
        if (linkWebsite && autor.website) {
            linkWebsite.href = autor.website;
            linkWebsite.textContent = `site oficial de ${autor.name}`;
        }

    } catch (error) {
        console.error('Erro na conexão com a API de autor:', error);
        
        const authorNameEl = document.getElementById('author-name');
        if (authorNameEl) authorNameEl.textContent = "Leigh Bardugo (Offline)";
        
        const containerBiografia = document.getElementById('author-biography');
        if (containerBiografia) {
            containerBiografia.innerHTML = `
                <p>Não foi possível carregar os dados dinâmicos da autora neste momento.</p>
                <p>Certifique-se de que o servidor do NestJS está rodando e o banco de dados está ativo.</p>
            `;
        }
    }
}

// --- DISPARADOR AO CARREGAR A PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    // Carrega a autora (se os elementos de id 'author-*' existirem na página)
    if (document.getElementById('author-name')) {
        carregarDadosDoBanco();
    }
    // Carrega os livros e as capas cadastradas
    carregarLivrosEDetalhes();
});

document.addEventListener('DOMContentLoaded', () => {
    const loginIcon = document.querySelector('.login-icon a');
    const token = localStorage.getItem('grisha_token');

    if (token) {
        // Se houver token, altera o link para a página de configurações
        loginIcon.setAttribute('href', 'config.html');
        loginIcon.setAttribute('title', 'Configurações da Conta');
    } else {
        // Se não houver token, mantém o link para a página de login
        loginIcon.setAttribute('href', 'login.html');
        loginIcon.setAttribute('title', 'Login');
    }
});