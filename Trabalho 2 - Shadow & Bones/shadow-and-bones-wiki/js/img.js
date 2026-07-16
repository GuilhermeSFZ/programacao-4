// 1. Função genérica que faz o fetch na API e injeta a imagem no elemento correto
async function loadImageFromAPI(apiId, htmlElementId) {
  try {
    const response = await fetch(`http://localhost:3000/images/${apiId}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar a imagem do ID ${apiId}`);
    }

    const imageData = await response.json();

    // Acessa o primeiro item dentro do array 'gallery' da sua entidade Image
    if (imageData && imageData.gallery && imageData.gallery.length > 0) {
      const imageInfo = imageData.gallery[0];
      const imgElement = document.getElementById(htmlElementId);
      
      if (imgElement) {
        imgElement.src = imageInfo.url;
        // Opcional: define também o alt dinamicamente para melhorar a acessibilidade
        imgElement.alt = imageInfo.title; 
      }
    }
  } catch (error) {
    console.error(`Falha ao carregar a imagem (ID: ${apiId}):`, error);
  }
}

// 2. Quando a página carregar, mapeamos e chamamos todas de uma vez só!
document.addEventListener('DOMContentLoaded', () => {
  
  // --- Personagens (IDs 1 ao 10) ---
  loadImageFromAPI(1, 'alina-pic');
  loadImageFromAPI(2, 'darkling-pic');
  loadImageFromAPI(3, 'mal-pic');
  loadImageFromAPI(4, 'nikolai-pic');
  loadImageFromAPI(5, 'baghra-pic');
  loadImageFromAPI(6, 'david-pic');
  loadImageFromAPI(7, 'genya-pic');
  loadImageFromAPI(8, 'tamar-pic');
  loadImageFromAPI(9, 'tolya-pic');
  loadImageFromAPI(10, 'zoya-pic');

  // --- Autora (ID 11) ---
  loadImageFromAPI(11, 'author-pic');

  // --- Brasões das ordems (IDs 12 ao 19) ---
  loadImageFromAPI(12, 'darkling-crest');
  loadImageFromAPI(13, 'heartrender-crest');
  loadImageFromAPI(14, 'healer-crest');
  loadImageFromAPI(15, 'squaller-crest');
  loadImageFromAPI(16, 'inferni-crest');
  loadImageFromAPI(17, 'tidemaker-crest');
  loadImageFromAPI(18, 'durast-crest');
  loadImageFromAPI(19, 'alkemi-crest');

  
});