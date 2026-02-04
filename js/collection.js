/**
 * Collection Page Controller
 * Display and manage user's Pokemon collection
 */

// Utility functions for blockchain mode
function getLevelUpCost(level) {
    // Same cost structure as local mode
    return Math.floor(level * 10);
}

function calculateSellPrice(level) {
    // Same pricing as local mode
    return Math.floor(level * 5);
}

/**
 * Sell a blockchain Pokemon (remove from game collection, NFT stays on chain)
 */
function sellBlockchainPokemon(pokemonId, pokemonData) {
    // Get current level from local storage
    const blockchainLevels = JSON.parse(localStorage.getItem('blockchainPokemonLevels') || '{}');
    const currentLevel = blockchainLevels[pokemonId] || 5;

    const sellPrice = calculateSellPrice(currentLevel);

    const confirmed = confirm(
        `Remove ${pokemonData.name} from your game collection?\n\n` +
        `Level: ${currentLevel}\n` +
        `Sell Value: ${sellPrice} PBTC\n\n` +
        `⚠️ Important Notes:\n` +
        `• Your NFT stays on the blockchain (you still own it)\n` +
        `• You can trade/sell the NFT on other marketplaces\n` +
        `• This Pokemon will be removed from your game collection\n` +
        `• You won't be able to battle with it anymore\n\n` +
        `Continue?`
    );

    if (!confirmed) return;

    try {
        // Add PBTC to balance
        const gameData = localStore.getGameData();
        gameData.balance += sellPrice;
        localStore.saveGameData(gameData);

        // Remove from blockchain levels (game collection)
        delete blockchainLevels[pokemonId];
        localStorage.setItem('blockchainPokemonLevels', JSON.stringify(blockchainLevels));

        showMessage(
            `${pokemonData.name} removed from game collection! +${sellPrice} PBTC\n\n` +
            `💡 Tip: Your NFT is still on the blockchain. You can trade it on other marketplaces!`,
            'success'
        );

        // Refresh the display
        loadCollectionStats();
        loadCollection();
    } catch (error) {
        showMessage('Failed to remove Pokemon: ' + error.message, 'error');
    }
}

/**
 * Level up a blockchain Pokemon (store level locally)
 */
function levelUpBlockchainPokemon(pokemonId, pokemonData) {
    console.log('levelUpBlockchainPokemon called with:', pokemonId, pokemonData.name);
    // Get current level from local storage (fallback to 5 for blockchain)
    let currentLevel = 5;
    const blockchainLevels = JSON.parse(localStorage.getItem('blockchainPokemonLevels') || '{}');
    if (blockchainLevels[pokemonId]) {
        currentLevel = blockchainLevels[pokemonId];
    }
    console.log('Current level:', currentLevel);

    const cost = getLevelUpCost(currentLevel);
    console.log('Level up cost:', cost);

    // Check balance from local storage
    const gameData = localStore.getGameData();
    const balance = gameData.balance;
    console.log('Current balance:', balance);

    if (currentLevel >= 100) {
        showMessage(`${pokemonData.name} is already at max level!`, 'error');
        return;
    }

    if (balance < cost) {
        showMessage(`Not enough PBTC! Need ${cost} but you only have ${balance}.`, 'error');
        return;
    }

    const confirmed = confirm(
        `Level up ${pokemonData.name}?\n\n` +
        `Current Level: ${currentLevel}\n` +
        `New Level: ${currentLevel + 1}\n` +
        `Cost: ${cost} PBTC\n\n` +
        `Note: This levels up your game stats (NFT level remains unchanged on blockchain)`
    );

    if (!confirmed) return;

    try {
        // Deduct cost
        gameData.balance -= cost;
        localStore.saveGameData(gameData);

        // Update level
        const newLevel = currentLevel + 1;
        blockchainLevels[pokemonId] = newLevel;
        localStorage.setItem('blockchainPokemonLevels', JSON.stringify(blockchainLevels));

        showMessage(
            `${pokemonData.name} leveled up to Level ${newLevel}! Game stats increased!`,
            'success'
        );

        // Refresh the display
        loadCollectionStats();
        loadCollection();
    } catch (error) {
        console.error('Error in levelUpBlockchainPokemon:', error);
        showMessage('Failed to level up Pokemon: ' + error.message, 'error');
    }
}
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
async function initCollection() {
    // Check if wallet is already connected (from MetaMask)
    if (window.web3Utils && window.web3Utils.isMetaMaskInstalled && window.ethereum && window.ethereum.selectedAddress) {
        console.log('Wallet already connected, initializing collection...');
        try {
            await window.web3Utils.connectWallet();
            console.log('Auto-connect successful');
        } catch (err) {
            console.log('Auto-connect failed, will show connect prompt:', err.message);
        }
    }
    
    loadCollectionStats();
    loadCollection();
}

/**
 * Load collection statistics
 */
async function loadCollectionStats() {
    // Check if in blockchain mode
    if (window.APP_CONFIG && window.APP_CONFIG.MODE === 'blockchain') {
        await loadCollectionStatsFromBlockchain();
    } else {
        loadCollectionStatsFromLocal();
    }
}

/**
 * Load collection stats from local storage
 */
function loadCollectionStatsFromLocal() {
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
 * Load collection stats from blockchain
 */
async function loadCollectionStatsFromBlockchain() {
    try {
        let ownedCount = 0;
        let balance = '0';

        if (window.web3Utils && window.web3Utils.isConnected) {
            // Get NFT count
            const tokenIds = await window.web3Utils.getUserNFTs();
            ownedCount = tokenIds.length;

            // Get token balance
            balance = await window.web3Utils.getTokenBalance();
        }

        const totalCount = 151; // Gen 1 Pokemon limit

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
                <div class="stat-value">${balance}</div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading collection stats from blockchain:', error);
        // Show error message instead of falling back to local storage
        document.getElementById('collection-stats').innerHTML = `
            <div class="stat-box">
                <div class="stat-label">Error</div>
                <div class="stat-value">Unable to load stats</div>
            </div>
        `;
    }
}

/**
 * Load and display collection
 */
function loadCollection() {
    console.log('loadCollection called');
    console.log('APP_CONFIG:', window.APP_CONFIG);
    console.log('MODE:', window.APP_CONFIG?.MODE);

    // Check if in blockchain mode
    if (window.APP_CONFIG && window.APP_CONFIG.MODE === 'blockchain') {
        console.log('Loading blockchain mode for collection');
        loadCollectionFromBlockchain();
    } else {
        console.log('Loading local mode for collection');
        loadCollectionFromLocal();
    }
}

/**
 * Load collection from local storage (local mode)
 */
function loadCollectionFromLocal() {
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
 * Load collection from blockchain
 */
async function loadCollectionFromBlockchain() {
    try {
        console.log('Loading collection from blockchain...');
        console.log('web3Utils available:', !!window.web3Utils);
        console.log('Connected:', window.web3Utils?.isConnected);

        if (!window.web3Utils || !window.web3Utils.isConnected) {
            console.log('Not connected to wallet - showing connect prompt');
            console.log('web3Utils object:', window.web3Utils);
            console.log('isConnected value:', window.web3Utils ? window.web3Utils.isConnected : 'web3Utils undefined');
            showConnectWalletMessage();
            return;
        }

        // Get user's NFT token IDs
        console.log('Getting user NFTs...');
        const tokenIds = await window.web3Utils.getUserNFTs();
        console.log('Token IDs found:', tokenIds);
        
        if (tokenIds.length === 0) {
            console.log('No NFTs found');
            showEmptyCollection();
            return;
        }

        // Get Pokemon data for each token
        const ownedPokemon = [];
        const blockchainLevels = JSON.parse(localStorage.getItem('blockchainPokemonLevels') || '{}');
        
        for (const tokenId of tokenIds) {
            try {
                console.log('Getting Pokemon ID for token:', tokenId);
                const pokemonId = await window.web3Utils.getPokemonIdFromToken(tokenId);
                console.log('Pokemon ID:', pokemonId);
                
                // Get level from local storage, default to 5
                const level = blockchainLevels[pokemonId] || 5;
                
                ownedPokemon.push({
                    pokemonId: pokemonId,
                    level: level,
                    tokenId: tokenId
                });
            } catch (error) {
                console.error('Error getting Pokemon data for token', tokenId, error);
            }
        }

        console.log('Owned Pokemon:', ownedPokemon);

        if (ownedPokemon.length === 0) {
            showEmptyCollection();
            return;
        }

        renderCollection(ownedPokemon);

    } catch (error) {
        console.error('Error loading collection from blockchain:', error);
        showEmptyCollection();
    }
}

/**
 * Render collection grid
 */
function renderCollection(ownedPokemon) {
    const container = document.getElementById('collection-grid');
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
 * Show empty collection message
 */
function showEmptyCollection() {
    const container = document.getElementById('collection-grid');
    container.innerHTML = `
        <div class="empty-collection">
            <h2>No Pokemon Yet!</h2>
            <p>Start building your collection by minting Pokemon.</p>
            <a href="mint.html" class="btn-primary" style="display: inline-block; text-decoration: none;">
                Go to Mint Page
            </a>
        </div>
    `;
}

/**
 * Show connect wallet message
 */
function showConnectWalletMessage() {
    const container = document.getElementById('collection-grid');
    container.innerHTML = `
        <div class="empty-collection">
            <h2>Connect Your Wallet</h2>
            <p>Connect your MetaMask wallet to view your minted Pokemon NFT collection!</p>
            <button class="btn-primary" onclick="connectWalletForCollection()" style="font-size: 1.2rem; padding: 1rem 2rem; margin-bottom: 1rem;">
                Connect MetaMask
            </button>
            <p style="color: #666;">
                Don't have Pokemon yet? <a href="mint.html">Mint some first</a>
            </p>
        </div>
    `;
}

/**
 * Connect wallet for collection page
 */
async function connectWalletForCollection() {
    try {
        if (!window.web3Utils) {
            alert('Web3 not loaded. Please refresh the page.');
            return;
        }

        await window.web3Utils.connectWallet();
        console.log('Wallet connected, reloading collection...');
        loadCollection(); // Reload collection after connecting
    } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert('Failed to connect wallet: ' + error.message);
    }
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
            ${pokemon.level < 100 ? `
                <button class="action-btn level-up" onclick="levelUpPokemon(${pokemon.id})">
                    Level Up (${getLevelUpCost(pokemon.level)} PBTC)
                </button>
            ` : `
                <button class="action-btn disabled" disabled>
                    Max Level
                </button>
            `}
            ${window.APP_CONFIG && window.APP_CONFIG.MODE === 'blockchain' ? `
                <button class="action-btn sell" onclick="sellPokemon(${pokemon.id})">
                    Remove from Game (+${calculateSellPrice(pokemon.level)} PBTC)
                </button>
            ` : `
                <button class="action-btn sell" onclick="sellPokemon(${pokemon.id})">
                    Sell (${calculateSellPrice(pokemon.level)} PBTC)
                </button>
            `}
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
 * Level up a Pokemon
 */
function levelUpPokemon(pokemonId) {
    console.log('levelUpPokemon called with pokemonId:', pokemonId);
    const pokemonData = getPokemonById(pokemonId);
    console.log('pokemonData:', pokemonData);

    if (!pokemonData) {
        console.error('Pokemon data not found for ID:', pokemonId);
        return;
    }

    // Check if in blockchain mode
    if (window.APP_CONFIG && window.APP_CONFIG.MODE === 'blockchain') {
        console.log('Calling levelUpBlockchainPokemon for blockchain mode');
        // For blockchain mode: NFT ownership stays on chain, levels stored locally
        levelUpBlockchainPokemon(pokemonId, pokemonData);
        return;
    }

    console.log('Local storage mode level up');
    // Local storage mode
    const owned = localStore.getOwnedPokemon().find(p => p.pokemonId === pokemonId);
    if (!owned) return;

    const cost = localStore.getLevelUpCost(owned.level);
    const balance = localStore.getGameData().balance;

    if (owned.level >= 100) {
        showMessage(`${pokemonData.name} is already at max level!`, 'error');
        return;
    }

    if (balance < cost) {
        showMessage(`Not enough PBTC! Need ${cost} but you only have ${balance}.`, 'error');
        return;
    }

    const confirmed = confirm(
        `Level up ${pokemonData.name}?\n\n` +
        `Current Level: ${owned.level}\n` +
        `New Level: ${owned.level + 1}\n` +
        `Cost: ${cost} PBTC\n\n` +
        `This will increase all stats!`
    );

    if (!confirmed) return;

    try {
        const result = localStore.levelUpPokemon(pokemonId);
        showMessage(
            `${pokemonData.name} leveled up to Level ${result.newLevel}! Stats increased!`,
            'success'
        );

        // Refresh the display
        loadCollectionStats();
        loadCollection();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

/**
 * Sell a Pokemon
 */
function sellPokemon(pokemonId) {
    const pokemonData = getPokemonById(pokemonId);

    if (!pokemonData) return;

    // Check if in blockchain mode
    if (window.APP_CONFIG && window.APP_CONFIG.MODE === 'blockchain') {
        // For blockchain NFTs: Remove from game collection but NFT stays on chain
        sellBlockchainPokemon(pokemonId, pokemonData);
        return;
    }

    // Local storage mode
    const owned = localStore.getOwnedPokemon().find(p => p.pokemonId === pokemonId);
    if (!owned) return;

    const sellPrice = localStore.calculateSellPrice(owned.level);

    const confirmed = confirm(
        `Sell ${pokemonData.name}?\n\n` +
        `Level: ${owned.level}\n` +
        `Sell Price: ${sellPrice} PBTC\n\n` +
        `This action cannot be undone!`
    );

    if (!confirmed) return;

    try {
        const result = localStore.sellPokemon(pokemonId);
        showMessage(
            `Sold ${pokemonData.name} for ${result.soldPrice} PBTC! New balance: ${result.newBalance}`,
            'success'
        );

        // Refresh the display
        loadCollectionStats();
        loadCollection();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

/**
 * Show message to user
 */
function showMessage(message, type = 'info') {
    const existing = document.querySelector('.collection-message');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.className = `collection-message ${type}`;
    div.textContent = message;

    const container = document.querySelector('.collection-container');
    container.insertBefore(div, container.firstChild);

    setTimeout(() => div.remove(), 4000);
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

// Initialize on page load (handles async loading)
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
        initCollection();
    });
} else {
    // DOM already loaded, initialize immediately
    initCollection();
}
