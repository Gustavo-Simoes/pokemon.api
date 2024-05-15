document.addEventListener("DOMContentLoaded", function() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pokemonContainer = document.getElementById('pokemon-container');
    const pokemonDetails = document.getElementById('pokemon-details');

    let offset = 0;

    async function fetchPokemons() {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
        const data = await response.json();
        const pokemons = data.results;

        pokemonContainer.innerHTML = '';

        pokemons.forEach(async function(pokemon) {
            const pokemonData = await fetchPokemonData(pokemon.url);
            const pokemonCard = createPokemonCard(pokemonData);
            pokemonContainer.appendChild(pokemonCard);
        });
    }

    async function fetchPokemonData(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    function createPokemonCard(pokemon) {
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');

        const img = document.createElement('img');
        img.classList.add('pokemon-img');
        img.src = pokemon.sprites.front_default;
        img.alt = pokemon.name;

        img.onclick = function() {
            showPokemonDetails(pokemon);
        };

        const name = document.createElement('h3');
        name.textContent = pokemon.name;

        pokemonCard.appendChild(img);
        pokemonCard.appendChild(name);

        return pokemonCard;
    }

    function showPokemonDetails(pokemon) {
        pokemonDetails.innerHTML = `
            <h2>${pokemon.name}</h2>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p><strong>Altura:</strong> ${pokemon.height}</p>
            <p><strong>Peso:</strong> ${pokemon.weight}</p>
            <p><strong>Tipo:</strong> ${pokemon.types.map(type => type.type.name).join(', ')}</p>
            <p><strong>Habilidades:</strong> ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
        `;
        pokemonDetails.style.display = 'block';

        // Adiciona evento de clique fora da div para fechar os detalhes do Pokémon
        document.addEventListener('click', function(event) {
            if (!pokemonDetails.contains(event.target) && !event.target.classList.contains('pokemon-img')) {
                pokemonDetails.style.display = 'none';
            }
        });
    }

    prevBtn.addEventListener('click', function() {
        if (offset >= 20) {
            offset -= 20;
            fetchPokemons();
        }
    });

    nextBtn.addEventListener('click', function() {
        offset += 20;
        fetchPokemons();
    });

    fetchPokemons();
});

