/**
 * Mint Page Logic
 * Handles UI for wallet connection and Pokemon minting
 */

let userBalance = '0';
let mintedPokemon = new Set();

// Type colors for badges
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



const DAILY_KEY = 'daily_mint_pokemon';
const DAILY_DATE_KEY = 'daily_mint_date';
const REFRESH_HOUR = 8;

function getTodayKey() {
    const now = new Date();
    if (now.getHours() < REFRESH_HOUR) {
        now.setDate(now.getDate() - 1);
    }
    return now.toISOString().split('T')[0];
}

function getDailyPokemon(allPokemon, count = 12) {
    const todayKey = getTodayKey();
    const savedDate = localStorage.getItem(DAILY_DATE_KEY);
    const savedIds = JSON.parse(localStorage.getItem(DAILY_KEY) || '[]');

    if (savedDate === todayKey && savedIds.length) {
        return savedIds.map(id => allPokemon.find(p => p.id === id)).filter(Boolean);
    }

    const shuffled = [...allPokemon].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    localStorage.setItem(DAILY_DATE_KEY, todayKey);
    localStorage.setItem(DAILY_KEY, JSON.stringify(selected.map(p => p.id)));

    return selected;
}


/**
 * Handle wallet connection
 */
async function handleConnect() {
    const btn = document.querySelector('.connect-btn');
    btn.disabled = true;
    btn.textContent = 'Connecting...';

    try {
        // Check if web3Utils is available
        if (typeof web3Utils === 'undefined') {
            throw new Error('web3Utils is not defined - web3.js may not have loaded properly');
        }

        const address = await web3Utils.connectWallet();
        console.log('Wallet connected:', address);

        await updateWalletUI();
        await loadMintablePokemons();
    } catch (error) {
        showError('Failed to connect wallet: ' + error.message);
        btn.disabled = false;
        btn.textContent = 'Connect MetaMask';
    }
}

/**
 * Update wallet UI with balance and info
 */
async function updateWalletUI() {
    try {
        const balance = await web3Utils.getTokenBalance();
        userBalance = balance;

        const faucetStatus = await web3Utils.checkFaucetStatus();

        const walletControls = document.getElementById('wallet-controls');
        const walletInfo = document.getElementById('wallet-info');

        walletControls.innerHTML = `
            <p style="color: var(--pokemon-blue); font-size: 1.1rem; margin-bottom: 1rem;">
            Connected: <strong>${web3Utils.formatAddress(web3Utils.userAddress)}</strong>
            </p>
        `;
        // 

        walletInfo.style.display = 'flex';
        walletInfo.innerHTML = `
            <div class="info-card">
                <div class="info-label">PBTC Balance</div>
                <div class="info-value">${parseFloat(balance).toFixed(2)}</div>
            </div>
           
        `;
    } catch (error) {
        console.error('Error updating wallet UI:', error);
    }
}
//  <div class="info-card">
//                 <div class="info-label">Faucet Status</div>
//                 <div class="info-value" style="font-size: 1rem;">
//                     ${faucetStatus.canClaim ?
//                         '<button class="btn-primary faucet-btn" onclick="handleFaucet()">Claim 1,000 PBTC</button>' :
//                         `Cooldown: ${web3Utils.formatTimeRemaining(faucetStatus.cooldownSeconds)}`
//                     }
//                 </div>
//             </div>




/**
 * Handle faucet claim
 */
async function handleFaucet() {
    const btn = document.querySelector('.faucet-btn');
    btn.disabled = true;
    btn.textContent = 'Claiming...';

    try {
        showMessage('Claiming tokens from faucet...', 'info');
        await web3Utils.claimFaucet();
        showSuccess('Successfully claimed 1,000 PBTC tokens!');
        await updateWalletUI();
    } catch (error) {
        showError('Failed to claim faucet: ' + error.message);
        btn.disabled = false;
        btn.textContent = 'Claim 1,000 PBTC';
    }
}

/**
 * Load all mintable Pokemon
 */
async function loadMintablePokemons() {
    const content = document.getElementById('mint-content');
    content.innerHTML = '<div class="loading">Loading Pokemon...</div>';

    try {
        // Get user's owned Pokemon
        const owned = await web3Utils.getOwnedPokemon();
        mintedPokemon = new Set(owned.map(p => p.pokemonId));

        // Get all Pokemon from database
        const allPokemon = getAllPokemon();

        // Function to get 12 random Pokemon
        function getRandomPokemon(pokemonList, count) {
            const shuffled = pokemonList.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        }

        // Get 20 random Pokemon
        const randomPokemon = getDailyPokemon(allPokemon, 12);

       // const randomPokemon = getRandomPokemon(allPokemon, 12);


        // Create grid
        let html = '<div class="pokemon-mint-grid">';

        for (const poke of randomPokemon) {
            const isMinted = mintedPokemon.has(poke.id);
            const canAfford = parseFloat(userBalance) >= 100;

            html += `
                <div class="mint-card ${isMinted ? 'minted' : ''}">
                    <img src="${poke.sprite}" alt="${poke.name}" class="pokemon-image">
                    <div class="pokemon-name">${poke.name}</div>
                    <div class="pokemon-types">
                        ${poke.types.map(type =>
                            `<span class="type-badge" style="background: ${TYPE_COLORS[type]}">${type}</span>`
                        ).join('')}
                    </div>
                    <div class="stats-mini">
                        <div class="stat-mini">HP: ${poke.baseStats.hp}</div>
                        <div class="stat-mini">ATK: ${poke.baseStats.attack}</div>
                        <div class="stat-mini">DEF: ${poke.baseStats.defense}</div>
                        <div class="stat-mini">SPD: ${poke.baseStats.speed}</div>
                    </div>
                    <div class="mint-price">Cost: 100 PBTC</div>
                    <button
                        class="mint-btn"
                        onclick="handleMint(${poke.id})"
                        ${isMinted || !canAfford ? 'disabled' : ''}
                    >
                        ${isMinted ? 'Already Owned' : (canAfford ? 'Mint NFT' : 'Insufficient Balance')}
                    </button>
                </div>
            `;
        }

        html += '</div>';
        content.innerHTML = html;
    } catch (error) {
        console.error('Error loading Pokemon:', error);
        content.innerHTML = '<div class="error-message">Failed to load Pokemon. Please refresh the page.</div>';
    }
}

/**
 * Handle minting a Pokemon
 */
async function handleMint(pokemonId) {
    const pokemon = getPokemonById(pokemonId);
    if (!pokemon) return;

    const confirmed = confirm(
        `Mint ${pokemon.name} for 100 PBTC tokens?\n\n` +
        `This will create an NFT in your wallet.`
    );

    if (!confirmed) return;

    // Disable all mint buttons
    document.querySelectorAll('.mint-btn').forEach(btn => btn.disabled = true);

    try {
        showMessage(`Minting ${pokemon.name}... Please confirm the transactions in MetaMask.`, 'info');

        await web3Utils.mintPokemon(pokemonId);

        showSuccess(`Successfully minted ${pokemon.name}! Check your collection.`);

        // Reload the page to update UI
        await updateWalletUI();
        await loadMintablePokemons();
    } catch (error) {
        showError('Failed to mint: ' + error.message);
        document.querySelectorAll('.mint-btn').forEach(btn => btn.disabled = false);
    }
}

/**
 * Show error message
 */
function showError(message) {
    const existing = document.querySelector('.error-message');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.className = 'error-message';
    div.textContent = message;

    document.querySelector('.mint-container').insertBefore(
        div,
        document.querySelector('.instructions')
    );

    setTimeout(() => div.remove(), 5000);
}

/**
 * Show success message
 */
function showSuccess(message) {
    const existing = document.querySelector('.success-message');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.className = 'success-message';
    div.textContent = message;

    document.querySelector('.mint-container').insertBefore(
        div,
        document.querySelector('.instructions')
    );

    setTimeout(() => div.remove(), 5000);
}

/**
 * Show info message
 */
function showMessage(message, type = 'info') {
    if (type === 'error') {
        showError(message);
    } else if (type === 'success') {
        showSuccess(message);
    } else {
        // Info message
        const existing = document.querySelector('.success-message');
        if (existing) existing.remove();

        const div = document.createElement('div');
        div.className = 'success-message';
        div.style.background = '#e3f2fd';
        div.style.color = '#1976d2';
        div.textContent = message;

        document.querySelector('.mint-container').insertBefore(
            div,
            document.querySelector('.instructions')
        );

        setTimeout(() => div.remove(), 5000);
    }
}

// Check if wallet is already connected on page load
window.addEventListener('DOMContentLoaded', async () => {
    if (web3Utils.isMetaMaskInstalled() && window.ethereum.selectedAddress) {
        await handleConnect();
    }
});


//hard reset 
setInterval(() => {
    const todayKey = getTodayKey();
    if (localStorage.getItem(DAILY_DATE_KEY) !== todayKey) {
        loadMintablePokemons();
    }
}, 60000);