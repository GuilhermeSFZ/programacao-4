const pokemonGrid = document.getElementById("pokemonGrid");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("TypeFilter");
let loadedPokemons = [];

// Carrega os dados da API
async function loadPokemons() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=60");
        const data = await response.json();

        // Busca detalhes de cada pokemon da lista
        const promises = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
        loadedPokemons = await Promise.all(promises);

        renderCards(loadedPokemons);
    } catch (error) {
        console.error("Erro ao carregar Pokémons:", error);
    }
}

// Renderiza os cards na tela
function renderCards(pokemons) {
    pokemonGrid.innerHTML = "";
    
    pokemons.forEach(pokemon => {
        const card = document.createElement("div");
        card.classList.add("card");
        
        const pokeId = pokemon.id.toString().padStart(3, '0');
        
        // Gera o HTML dos tipos
        const typesHtml = pokemon.types.map(t => 
            `<span class="type-badge ${t.type.name}">${t.type.name.toUpperCase()}</span>`
        ).join("");

        card.innerHTML = `
            <div class="card-bg-id">#${pokeId}</div>
            <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
            <div class="details-container">
                <p class="id-label">#${pokeId}</p>
                <h3>${pokemon.name.toUpperCase()}</h3>
                <div class="types-container">
                    ${typesHtml}
                </div>
                <div class="stats">
                    <span>${pokemon.height / 10}M</span>
                    <span>${pokemon.weight / 10}KG</span>
                </div>
            </div>
        `;
        pokemonGrid.appendChild(card);
    });
}

// Função de Busca (Nome ou ID)
async function searchPokemon() {
    const query = searchInput.value.toLowerCase().trim();
    if (query === "") {
        renderCards(loadedPokemons);
        return;
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        if (!response.ok) throw new Error();
        const pokemon = await response.json();
        renderCards([pokemon]);
    } catch {
        pokemonGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">Pokémon não encontrado!</p>`;
    }
}

// Função de Filtro por Tipo
function filterByType() {
    const selectedType = typeFilter.value;
    if (selectedType === "") {
        renderCards(loadedPokemons);
        return;
    }

    const filtered = loadedPokemons.filter(pokemon => 
        pokemon.types.some(t => t.type.name === selectedType)
    );
    renderCards(filtered);
}

// Inicializar
loadPokemons();