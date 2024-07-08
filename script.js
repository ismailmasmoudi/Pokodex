const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=40&offset=0';

let pokemonData = [];

function showLoadingSpinner() {
    document.getElementById("pokemon-container").innerHTML = '';
    document.getElementById('footer').style.display = 'none';
    setTimeout(() => {
        document.getElementById('loading-container').style.display = 'none';
    }, 1000);
    fetchAndDisplayPokemonList();
}

// gets and displays the list of PokémonData
async function fetchAndDisplayPokemonList() {
    try {
        let response = await fetch(apiUrl);
        let data = await response.json();
        let pokemonUrls = data.results.map(pokemon => pokemon.url);
        for (let i = 0; i < pokemonUrls.length; i++) {
            const url = pokemonUrls[i];
            let pokemonResponse = await fetch(url);
            let pokemon = await pokemonResponse.json();
            pokemonData.push(pokemon);
        }
        displayPokemonData();
        document.getElementById('footer').style.display = 'block';
        document.getElementById('load-more-button').style.display = 'block'; // Show the button after loading the first 20 Pokémon
    } catch (error) {
        console.error('Fehler beim Abrufen der Pokémon-Daten:', error);
    }
}

// displays the list of PokémonData
function displayPokemonData() {
    let pokemonContainer = document.getElementById('pokemon-container');
    pokemonContainer.innerHTML = '';
    for (let i = 0; i < pokemonData.length; i++) {
        const pokemon = pokemonData[i];
        let pokemonId = pokemon.id;
        let pokemonName = pokemon.forms[0].name;
        let pokemonImage = pokemon.sprites.other['official-artwork'].front_default;
        let pokemonType = pokemon.types.map(typeInfo => typeInfo.type.name);
        let pokemonTypes = pokemonType.join(', ');

        pokemonContainer.innerHTML += HtmlToDisplayPokeomData(pokemonType, pokemonName, pokemonId, pokemonImage, pokemonTypes, i);
    }
}

function HtmlToDisplayPokeomData(pokemonType, pokemonName, pokemonId, pokemonImage, pokemonTypes, i) {
    return `
            <div class="pokemon-card bg_${pokemonType[0]}" onclick="showPokemonDetails(${i})">
            <h3>#${pokemonId}: ${pokemonName}</h3>
            <img src="${pokemonImage}" alt="${pokemonName}" class="pokemon-image">
                 <p class="type">${pokemonTypes}</p>
            </div>
        `;
}

let currentPokemonIndex = 0; // Variable to track current pokemon index

function showPreviousPokemon() {
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--;
        updatePopupContent(currentPokemonIndex);
    }
}

function showNextPokemon() {
    if (currentPokemonIndex < pokemonData.length - 1) {
        currentPokemonIndex++;
        updatePopupContent(currentPokemonIndex);
    }
}

function updatePopupContent(currentPokemonIndex) {
    const pokemon = pokemonData[currentPokemonIndex];
    let pokemonId = pokemon.id;
    let pokemonName = pokemon.forms[0].name;
    let pokemonImage = pokemon.sprites.other['official-artwork'].front_default;
    let pokemonType = pokemon.types.map(typeInfo => typeInfo.type.name);
    let pokemonTypes = pokemonType.join(', ');

    const popupContent = document.getElementById('pokemon-popup');
    popupContent.innerHTML = /*html*/`
        <div class="popup-top">
            <h2>${pokemonName} (ID: ${pokemonId})</h2>
            <div class="bg_${pokemonType[0]} image-cadre">  <img src="${pokemonImage}" alt="${pokemonName}" class="pokemon-image"> </div>
    
            <p>Type: ${pokemonTypes}</p>
        </div>
            <div class="buttons">
                <button onclick="showMainInfo(${currentPokemonIndex})">Main</button>
                <button onclick="showStats(${currentPokemonIndex})">Stats</button>
                <button onclick="showEvoChain(${currentPokemonIndex})">Evo Chain</button>
            </div>
            <button class="close-popup" onclick="closePopup()">X</button>
            <button class="prev-button" onclick="showPreviousPokemon()">Previous</button>
            <button class="next-button" onclick="showNextPokemon()">Next</button>
            <div id="popup-content" class="popup-content">
            </div>
        `;
    showMainInfo(currentPokemonIndex);
}

function showPokemonDetails(i) {
    currentPokemonIndex = i;
    updatePopupContent(i);
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('pokemon-popup').style.display = 'block';
}

function showMainInfo(i) {
    const pokemon = pokemonData[i];
    document.getElementById('popup-content').innerHTML = `
    <p class="main-width">Height: ${pokemon.height}</p>
    <p class="main-width">Weight: ${pokemon.weight}</p>
    <p class="main-width">Base Experience: ${pokemon.base_experience}</p>
    <p class="main-width">Abilities: ${pokemon.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ')}</p>
`;
    document.getElementById('popup-content').classList.remove("popup-content-row");
}

function showStats(i) {
    const pokemon = pokemonData[i];
    let statsInfo = pokemon.stats.map(stat => `
        <div class="stats-bar">
            <span>${stat.stat.name}</span>
            <div style="width: ${stat.base_stat}px;"></div>
        </div>
    `).join('');
    document.getElementById('popup-content').innerHTML = statsInfo;
    document.getElementById('popup-content').classList.remove("popup-content-row");
}

async function showEvoChain(i) {
    const pokemon = pokemonData[i];
    const speciesResponse = await fetch(pokemon.species.url);
    const speciesData = await speciesResponse.json();
    const evoChainResponse = await fetch(speciesData.evolution_chain.url);
    const evoChainData = await evoChainResponse.json();
    // Creating the evolutionary chain
    const evoChain = [
        {
            name: evoChainData.chain.species.name,
            url: evoChainData.chain.species.url.replace('pokemon-species', 'pokemon')
        }
    ];
    let evoData = evoChainData.chain.evolves_to[0];
    if (evoData) {
        evoChain.push({
            name: evoData.species.name,
            url: evoData.species.url.replace('pokemon-species', 'pokemon')
        });

        evoData = evoData.evolves_to[0];

        if (evoData) {
            evoChain.push({
                name: evoData.species.name,
                url: evoData.species.url.replace('pokemon-species', 'pokemon')
            });
        }
    }
    EvoChainHtml(evoChain);
}

// Create HTML code for each Pokémon in the evolution chain.  
async function EvoChainHtml (evoChain){
    const evoChainHtml = await Promise.all(evoChain.map(async evo => {
        const evoResponse = await fetch(evo.url);
        const evoPokemon = await evoResponse.json();
        return `
            <div class="evo-chain-item">
                <img  src="${evoPokemon.sprites.other['official-artwork'].front_default}" alt="${evo.name}">
                <p>${evo.name}</p>
            </div>
        `;
    }));
    document.getElementById('popup-content').innerHTML = evoChainHtml.join('<span class="arrow"> => </span>');
    document.getElementById('popup-content').classList.add("popup-content-row");
}

// Searchs a pokemon
function filterNames() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase();
    let pokemonContainer = document.getElementById('pokemon-container');
    pokemonContainer.innerHTML = '';
    for (let i = 0; i < pokemonData.length; i++) {
        const pokemon = pokemonData[i];
        let pokemonId = pokemon.id;
        let pokemonName = pokemon.forms[0].name;
        let pokemonImage = pokemon.sprites.other['official-artwork'].front_default;
        let pokemonType = pokemon.types.map(typeInfo => typeInfo.type.name);
        let pokemonTypes = pokemonType.join(', ');
        if (pokemonName.toLowerCase().includes(search)) {
            pokemonContainer.innerHTML += HtmlToDisplayPokeomData(pokemonType, pokemonName, pokemonId, pokemonImage, pokemonTypes, i);
        }
    }
}

function closePopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('pokemon-popup').style.display = 'none';
}

async function loadMorePokemon() {
    try {
        let nextApiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=111&offset=40';
        let response = await fetch(nextApiUrl);
        let data = await response.json();
        let pokemonUrls = data.results.map(pokemon => pokemon.url);
        for (let i = 0; i < pokemonUrls.length; i++) {
            const url = pokemonUrls[i];
            let pokemonResponse = await fetch(url);
            let pokemon = await pokemonResponse.json();
            pokemonData.push(pokemon);
        }
        displayPokemonData();
        document.getElementById('load-more-button').style.display = 'none'; // Hide the button after loading
        document.getElementById('footer').style.display = 'block';
    } catch (error) {
        console.error('Fehler beim Abrufen der Pokémon-Daten:', error);
    }
}
