/**
 * Local Mint Page Logic (No Blockchain)
 * With daily refresh, CAPTCHA, and countdown timers
 */

let userBalance = 0;
let ownedPokemonIds = new Set();

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

/**
 * Initialize the page
 */
function initializePage() {
    updateUI();
    loadPokemonGrid();
}

/**
 * Update UI with current balance and info
 */
function updateUI() {
    const gameData = localStore.getGameData();
    userBalance = gameData.balance;
    ownedPokemonIds = new Set(gameData.ownedPokemon.map(p => p.pokemonId));

    const walletControls = document.getElementById('wallet-controls');
    const walletInfo = document.getElementById('wallet-info');

    walletControls.innerHTML = `
        <p style="color: var(--btc-orange); font-size: 1.1rem; margin-bottom: 1rem;">
            Player ID: <strong>${gameData.userId}</strong>
        </p>
        <div style="color: var(--btc-light-gray); font-size: 0.9rem; margin-top: 0.5rem;">
            Next refresh: <strong id="next-refresh-timer" style="color: var(--btc-orange);"></strong>
        </div>
    `;

    walletInfo.style.display = 'flex';

    // Faucet button or countdown
    let faucetHTML;
    if (gameData.faucetStatus.canClaim) {
        faucetHTML = '<button class="btn-primary faucet-btn btc-pulse" onclick="handleFaucet()" style="color: #000000 !important; font-weight: bold;">Claim 1,000 Coin</button>';
    } else {
        faucetHTML = `<div id="faucet-countdown" style="color: var(--crypto-yellow); font-weight: bold;"></div>`;
    }

    walletInfo.innerHTML = `
        <div class="info-card btc-glow">
            <div class="info-label">PBTC Balance</div>
            <div class="info-value">${userBalance}</div>
        </div>
        <div class="info-card">
            <div class="info-label">Owned Pokemon</div>
            <div class="info-value">${ownedPokemonIds.size}</div>
        </div>
        <div class="info-card">
            <div class="info-label">Faucet</div>
            <div class="info-value" style="font-size: 1rem;">
                ${faucetHTML}
            </div>
        </div>
    `;

    // Start countdown timers
    startFaucetCountdown();
    startRefreshTimer();
}

/**
 * Start faucet countdown timer
 */
function startFaucetCountdown() {
    const countdownEl = document.getElementById('faucet-countdown');
    if (!countdownEl) return;

    const updateCountdown = () => {
        const { canClaim, timeRemaining } = localStore.canClaimFaucet();

        if (canClaim) {
            // Refresh UI to show claim button
            updateUI();
            return;
        }

        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        countdownEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/**
 * Start refresh timer
 */
function startRefreshTimer() {
    const timerEl = document.getElementById('next-refresh-timer');
    if (!timerEl) return;

    const updateTimer = () => {
        const ms = dailyRefresh.getTimeUntilRefresh();
        timerEl.textContent = dailyRefresh.formatTimeRemaining(ms);
    };

    updateTimer();
    setInterval(updateTimer, 1000);
}

/**
 * Handle faucet claim with CAPTCHA
 */
function handleFaucet() {
    // Show CAPTCHA modal
    simpleCaptcha.showCaptchaModal(() => {
        try {
            const result = localStore.claimFaucet();
            showSuccess(`Claimed ${result.amount} PBTC! New balance: ${result.newBalance}`);
            updateUI();
        } catch (error) {
            showError(error.message);
        }
    });
}

/**
 * Load Pokemon grid (with daily refresh)
 */
function loadPokemonGrid() {
    const content = document.getElementById('mint-content');
    const allPokemon = dailyRefresh.getDisplayPokemonList(); // Use filtered list

    let html = '<div class="pokemon-mint-grid">';

    for (const poke of allPokemon) {
        const isOwned = ownedPokemonIds.has(poke.id);
        const canAfford = userBalance >= localStore.GAME_CONFIG.MINT_PRICE;
        const isAvailableToday = dailyRefresh.isPokemonAvailableToday(poke.id);

        html += `
            <div class="mint-card ${isOwned ? 'minted' : ''} float-animation">
                <img src="${poke.sprite}" alt="${poke.name}" class="pokemon-image" style="animation: float 3s ease-in-out infinite;">
                <div class="pokemon-name">${poke.name}</div>
                ${!isAvailableToday && !isOwned ? '<div style="color: #FFB900; font-size: 0.8rem; margin: 0.5rem 0;">⏰ Previously Available</div>' : ''}
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
                <div class="mint-price">Cost: ${localStore.GAME_CONFIG.MINT_PRICE} PBTC</div>
                <button
                    class="mint-btn"
                    onclick="handleMint(${poke.id})"
                    ${isOwned || !canAfford ? 'disabled' : ''}
                >
                    ${isOwned ? 'Already Owned' : (canAfford ? 'Mint Pokemon' : 'Insufficient Balance')}
                </button>
            </div>
        `;
    }

    html += '</div>';
    content.innerHTML = html;
}

/**
 * Handle minting a Pokemon
 */
function handleMint(pokemonId) {
    const pokemon = getPokemonById(pokemonId);
    if (!pokemon) return;

    const confirmed = confirm(
        `Mint ${pokemon.name} for ${localStore.GAME_CONFIG.MINT_PRICE} PBTC?\n\n` +
        `This will add it to your collection.`
    );

    if (!confirmed) return;

    try {
        const result = localStore.mintPokemon(pokemonId);
        showSuccess(`Successfully minted ${pokemon.name}! New balance: ${result.newBalance} PBTC`);

        // Update UI
        updateUI();
        loadPokemonGrid();
    } catch (error) {
        showError(error.message);
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

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    initializePage();
});
