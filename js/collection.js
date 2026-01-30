/**
 * Collection Page Controller
 * Display and manage user's Pokemon collection
 */

// Type colors
const TYPE_COLORS = {
    'Normal': '#A8A878',
    'Fire': '#F08030',
    'Water': '#6890F0',
    'Electric': '#F8D030',
    'Grass': '#78C850',
    'Ice': '#98D8D8',
    'Fighting': '#C03028',
    'Poison': '#A040A0',
    'Ground': '#E0C068',
    'Flying': '#A890F0',
    'Psychic': '#F85888',
    'Bug': '#A8B820',
    'Rock': '#B8A038',
    'Ghost': '#705898',
    'Dragon': '#7038F8',
    'Dark': '#705848',
    'Steel': '#B8B8D0',
    'Fairy': '#EE99AC'
};

/**
 * Initialize collection page
 */
function initCollection() {
    loadCollectionStats();
    loadCollection();
}

/**
 * Load collection statistics
 */
function loadCollectionStats() {
    const gameData = localStore.getGameData();
    const ownedCount = gameData.ownedPokemon.length;
    const totalCount = 20; // We have 20 Pokemon available

    document.getElementById('collection-stats').innerHTML = `
        <div class="stat-box">
            <div class="stat-label">Total Pokemon</div>
            <div class="stat-value">${ownedCount}</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">Collection</div>
            <div class="stat-value">${Math.round((ownedCount / totalCount) * 100)}%</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">PBTC Balance</div>
            <div class="stat-value">${gameData.balance}</div>
        </div>
    `;
}

/**
 * Load and display collection
 */
function loadCollection() {
    const ownedPokemon = localStore.getOwnedPokemon();
    const container = document.getElementById('collection-grid');

    if (ownedPokemon.length === 0) {
        container.innerHTML = `
            <div class="empty-collection">
                <h2>No Pokemon Yet!</h2>
                <p>Start building your collection by minting Pokemon.</p>
                <a href="mint.html" class="btn-primary" style="display: inline-block; text-decoration: none;">
                    Go to Mint Page
                </a>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    ownedPokemon.forEach(owned => {
        const pokemonData = getPokemonById(owned.pokemonId);
        if (!pokemonData) return;

        const pokemon = new Pokemon(pokemonData, owned.level);

        const card = createPokemonCard(pokemon, owned);
        container.appendChild(card);
    });
}

/**
 * Create Pokemon card element
 */
function createPokemonCard(pokemon, ownedData) {
    const card = document.createElement('div');
    card.className = 'collection-card';

    // Calculate max stats for progress bars
    const maxStat = 200; // Approximate max for display

    card.innerHTML = `
        <img src="${pokemon.sprite}" alt="${pokemon.name}" class="pokemon-sprite-large">

        <div class="pokemon-name-large">${pokemon.name}</div>
        <div class="pokemon-level-display">Level ${pokemon.level}</div>

        <div class="pokemon-types-display">
            ${pokemon.types.map(type =>
                `<span class="type-badge-large" style="background: ${TYPE_COLORS[type]}">${type}</span>`
            ).join('')}
        </div>

        <div class="stats-detail">
            <div class="stat-row-detail">
                <span class="stat-name">HP</span>
                <div class="stat-bar-container">
                    <div class="stat-bar-fill" style="width: ${(pokemon.stats.hp / maxStat) * 100}%"></div>
                </div>
                <span class="stat-number">${pokemon.stats.hp}</span>
            </div>

            <div class="stat-row-detail">
                <span class="stat-name">Attack</span>
                <div class="stat-bar-container">
                    <div class="stat-bar-fill" style="width: ${(pokemon.stats.attack / maxStat) * 100}%"></div>
                </div>
                <span class="stat-number">${pokemon.stats.attack}</span>
            </div>

            <div class="stat-row-detail">
                <span class="stat-name">Defense</span>
                <div class="stat-bar-container">
                    <div class="stat-bar-fill" style="width: ${(pokemon.stats.defense / maxStat) * 100}%"></div>
                </div>
                <span class="stat-number">${pokemon.stats.defense}</span>
            </div>

            <div class="stat-row-detail">
                <span class="stat-name">Speed</span>
                <div class="stat-bar-container">
                    <div class="stat-bar-fill" style="width: ${(pokemon.stats.speed / maxStat) * 100}%"></div>
                </div>
                <span class="stat-number">${pokemon.stats.speed}</span>
            </div>
        </div>

        <div class="moves-section">
            <h4>Moves</h4>
            <div class="moves-list">
                ${pokemon.moves.map(move => `
                    <div class="move-item">
                        <span class="move-item-name">${move.name}</span>
                        <span class="move-item-power">${move.type} | ${move.power} PWR</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="card-actions">
            <button class="action-btn primary" onclick="battleWithPokemon(${pokemon.id})">
                Battle
            </button>
            <button class="action-btn secondary" onclick="viewPokemonDetails(${pokemon.id})">
                Details
            </button>
        </div>
    `;

    return card;
}

/**
 * Battle with selected Pokemon
 */
function battleWithPokemon(pokemonId) {
    // Store selected Pokemon in sessionStorage
    sessionStorage.setItem('selectedPokemonForBattle', pokemonId);
    window.location.href = 'battle.html';
}

/**
 * View Pokemon details (modal or alert)
 */
function viewPokemonDetails(pokemonId) {
    const pokemonData = getPokemonById(pokemonId);
    const owned = localStore.getOwnedPokemon().find(p => p.pokemonId === pokemonId);

    if (!pokemonData || !owned) return;

    const pokemon = new Pokemon(pokemonData, owned.level);

    const details = `
=== ${pokemon.name} ===

Level: ${pokemon.level}
Types: ${pokemon.types.join(', ')}

Stats:
- HP: ${pokemon.stats.hp}
- Attack: ${pokemon.stats.attack}
- Defense: ${pokemon.stats.defense}
- Speed: ${pokemon.stats.speed}
- Total: ${pokemon.getTotalBaseStats()}

IVs:
- HP: ${pokemon.iv.hp}
- Attack: ${pokemon.iv.attack}
- Defense: ${pokemon.iv.defense}
- Speed: ${pokemon.iv.speed}

Moves:
${pokemon.moves.map(m => `- ${m.name} (${m.type}, ${m.power} power, ${m.accuracy}% acc)`).join('\n')}

Minted: ${new Date(owned.mintedAt).toLocaleDateString()}
    `;

    alert(details);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    initCollection();
});
