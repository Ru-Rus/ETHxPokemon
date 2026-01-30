/**
 * Local Storage System (No Blockchain)
 * Replaces web3.js with simple localStorage
 */

const STORAGE_KEYS = {
    TOKENS: 'pbtc_balance',
    OWNED_POKEMON: 'owned_pokemon',
    LAST_FAUCET: 'last_faucet_claim',
    USER_ID: 'user_id'
};

const GAME_CONFIG = {
    INITIAL_TOKENS: 1000,
    FAUCET_AMOUNT: 1000,
    MINT_PRICE: 100,
    FAUCET_COOLDOWN: 60000, // 1 minute for testing (instead of 24 hours)
    LEVEL_UP_BASE_COST: 50, // Base cost to level up (increases with level)
    LEVEL_UP_MULTIPLIER: 1.5 // Cost multiplier per level
};

/**
 * Initialize user account
 */
function initializeUser() {
    // Create user ID if doesn't exist
    if (!localStorage.getItem(STORAGE_KEYS.USER_ID)) {
        const userId = 'user_' + Date.now();
        localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
    }

    // Give initial tokens if new user
    if (!localStorage.getItem(STORAGE_KEYS.TOKENS)) {
        localStorage.setItem(STORAGE_KEYS.TOKENS, GAME_CONFIG.INITIAL_TOKENS.toString());
    }

    // Initialize owned Pokemon array if doesn't exist
    if (!localStorage.getItem(STORAGE_KEYS.OWNED_POKEMON)) {
        localStorage.setItem(STORAGE_KEYS.OWNED_POKEMON, JSON.stringify([]));
    }
}

/**
 * Get user ID
 */
function getUserId() {
    return localStorage.getItem(STORAGE_KEYS.USER_ID) || 'guest';
}

/**
 * Get token balance
 */
function getTokenBalance() {
    const balance = localStorage.getItem(STORAGE_KEYS.TOKENS);
    return parseInt(balance) || 0;
}

/**
 * Set token balance
 */
function setTokenBalance(amount) {
    localStorage.setItem(STORAGE_KEYS.TOKENS, amount.toString());
}

/**
 * Add tokens to balance
 */
function addTokens(amount) {
    const current = getTokenBalance();
    setTokenBalance(current + amount);
}

/**
 * Subtract tokens from balance
 */
function subtractTokens(amount) {
    const current = getTokenBalance();
    if (current < amount) {
        throw new Error('Insufficient tokens');
    }
    setTokenBalance(current - amount);
}

/**
 * Check if can claim faucet
 */
function canClaimFaucet() {
    const lastClaim = localStorage.getItem(STORAGE_KEYS.LAST_FAUCET);
    if (!lastClaim) return { canClaim: true, timeRemaining: 0 };

    const timeSinceLastClaim = Date.now() - parseInt(lastClaim);
    const canClaim = timeSinceLastClaim >= GAME_CONFIG.FAUCET_COOLDOWN;
    const timeRemaining = canClaim ? 0 : Math.ceil((GAME_CONFIG.FAUCET_COOLDOWN - timeSinceLastClaim) / 1000);

    return { canClaim, timeRemaining };
}

/**
 * Claim faucet tokens
 */
function claimFaucet() {
    const { canClaim } = canClaimFaucet();
    if (!canClaim) {
        throw new Error('Faucet cooldown active. Please wait.');
    }

    addTokens(GAME_CONFIG.FAUCET_AMOUNT);
    localStorage.setItem(STORAGE_KEYS.LAST_FAUCET, Date.now().toString());

    return {
        success: true,
        amount: GAME_CONFIG.FAUCET_AMOUNT,
        newBalance: getTokenBalance()
    };
}

/**
 * Get owned Pokemon
 */
function getOwnedPokemon() {
    const owned = localStorage.getItem(STORAGE_KEYS.OWNED_POKEMON);
    return JSON.parse(owned) || [];
}

/**
 * Check if user owns a Pokemon
 */
function ownsPokemon(pokemonId) {
    const owned = getOwnedPokemon();
    return owned.some(p => p.pokemonId === pokemonId);
}

/**
 * Mint a Pokemon
 */
function mintPokemon(pokemonId) {
    // Check if already owned
    if (ownsPokemon(pokemonId)) {
        throw new Error('You already own this Pokemon!');
    }

    // Check balance
    const balance = getTokenBalance();
    if (balance < GAME_CONFIG.MINT_PRICE) {
        throw new Error(`Insufficient tokens. Need ${GAME_CONFIG.MINT_PRICE} PBTC.`);
    }

    // Subtract tokens
    subtractTokens(GAME_CONFIG.MINT_PRICE);

    // Add Pokemon to owned list
    const owned = getOwnedPokemon();
    const newPokemon = {
        pokemonId: pokemonId,
        mintedAt: Date.now(),
        level: 5,
        experience: 0
    };
    owned.push(newPokemon);
    localStorage.setItem(STORAGE_KEYS.OWNED_POKEMON, JSON.stringify(owned));

    return {
        success: true,
        pokemon: newPokemon,
        newBalance: getTokenBalance()
    };
}

/**
 * Get Pokemon instance with stats
 */
function getPokemonInstance(pokemonId) {
    const pokemonData = getPokemonById(pokemonId);
    if (!pokemonData) return null;

    const owned = getOwnedPokemon();
    const ownedData = owned.find(p => p.pokemonId === pokemonId);

    if (!ownedData) return null;

    return new Pokemon(pokemonData, ownedData.level);
}

/**
 * Save Pokemon data (after battle, level up, etc.)
 */
function savePokemonData(pokemonId, data) {
    const owned = getOwnedPokemon();
    const index = owned.findIndex(p => p.pokemonId === pokemonId);

    if (index !== -1) {
        owned[index] = { ...owned[index], ...data };
        localStorage.setItem(STORAGE_KEYS.OWNED_POKEMON, JSON.stringify(owned));
    }
}

/**
 * Level up a Pokemon using PBTC
 */
function levelUpPokemon(pokemonId) {
    const owned = getOwnedPokemon();
    const pokemon = owned.find(p => p.pokemonId === pokemonId);

    if (!pokemon) {
        throw new Error('Pokemon not found!');
    }

    // Check max level
    const MAX_LEVEL = 105;
    if (pokemon.level >= MAX_LEVEL) {
        throw new Error(`${getPokemonById(pokemonId)?.name || 'Pokemon'} is already at max level (${MAX_LEVEL})!`);
    }

    // Calculate cost (increases with level)
    const cost = Math.floor(GAME_CONFIG.LEVEL_UP_BASE_COST * Math.pow(GAME_CONFIG.LEVEL_UP_MULTIPLIER, pokemon.level - 5));

    // Check balance
    const balance = getTokenBalance();
    if (balance < cost) {
        throw new Error(`Insufficient tokens. Need ${cost} PBTC.`);
    }

    // Subtract tokens
    subtractTokens(cost);

    // Level up
    pokemon.level++;
    pokemon.experience = pokemon.experience || 0;

    // Save
    savePokemonData(pokemonId, pokemon);

    return {
        success: true,
        newLevel: pokemon.level,
        cost: cost,
        newBalance: getTokenBalance()
    };
}

/**
 * Get level up cost for a Pokemon
 */
function getLevelUpCost(level) {
    return Math.floor(GAME_CONFIG.LEVEL_UP_BASE_COST * Math.pow(GAME_CONFIG.LEVEL_UP_MULTIPLIER, level - 5));
}

/**
 * Reset all data (for testing)
 */
function resetAllData() {
    localStorage.clear();
    initializeUser();
}

/**
 * Get all game data for display
 */
function getGameData() {
    return {
        userId: getUserId(),
        balance: getTokenBalance(),
        ownedPokemon: getOwnedPokemon(),
        faucetStatus: canClaimFaucet()
    };
}

// Initialize on load
initializeUser();

// Export to window for global access
window.localStore = {
    getUserId,
    getTokenBalance,
    addTokens,
    subtractTokens,
    canClaimFaucet,
    claimFaucet,
    getOwnedPokemon,
    ownsPokemon,
    mintPokemon,
    getPokemonInstance,
    savePokemonData,
    levelUpPokemon,
    getLevelUpCost,
    resetAllData,
    getGameData,
    GAME_CONFIG
};
