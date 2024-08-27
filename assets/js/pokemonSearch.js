// Función asíncrona para obtener los datos del Pokémon
async function getPokemonData(query) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
                if (!response.ok) {
                    throw new Error('Pokémon no encontrado');
                }
                const data = await response.json();
                resolve(data);
                console.log("Información Enviada");
            } catch (error) {
                reject(error);
            }
        }, 2000);
    });
}

// Función para mostrar el Pokémon en un card
function displayPokemon(pokemon) {
    const cardContainer = document.getElementById('pokemonCard');
    cardContainer.innerHTML = `
        <div class="col-md-4 mb-4">
            <div class="card" style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#pokemonModal">
                <img src="${pokemon.sprites.front_default}" class="card-img-top" alt="${pokemon.name}">
                <div class="card-body">
                    <h5 class="card-title">${pokemon.name}</h5>
                    <p class="card-text">ID: ${pokemon.id}</p>
                    <p class="card-text">Altura: ${pokemon.height}</p>
                    <p class="card-text">Peso: ${pokemon.weight}</p>
                </div>
            </div>
        </div>
    `;

    // Agregar evento para mostrar el modal con el gráfico
    cardContainer.querySelector('.card').addEventListener('click', () => showPokemonModal(pokemon));
}

// Función para mostrar el modal con el gráfico de poderes
function showPokemonModal(pokemon) {
    const modalTitle = document.getElementById('modalTitle');
    modalTitle.textContent = `${pokemon.name} - Poderes`;

    const ctx = document.getElementById('powerChart').getContext('2d');
    
    // Destruir el gráfico existente si hay uno
    if (window.powerChart instanceof Chart) {
        window.powerChart.destroy();
    }

    // Crear nuevo gráfico
    window.powerChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: pokemon.stats.map(stat => stat.stat.name),
            datasets: [{
                data: pokemon.stats.map(stat => stat.base_stat),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

// Event listener para el botón de búsqueda
document.getElementById('searchButton').addEventListener('click', async () => {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();

    if (query) {
        try {
            const pokemonData = await getPokemonData(query);
            displayPokemon(pokemonData);
        } catch (error) {
            alert(error.message);
        }
    }
});