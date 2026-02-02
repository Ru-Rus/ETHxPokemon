/**
 * Daily Pokemon Refresh System
 * Refreshes available Pokemon list at 8AM PH time daily
 * Keeps owned Pokemon
 */

const REFRESH_CONFIG = {
    REFRESH_HOUR: 8, // 8AM
    TIMEZONE: 'Asia/Manila',
    STORAGE_KEY: 'last_refresh_date',
    AVAILABLE_POKEMON_KEY: 'available_pokemon_today'
};

/**
 * Get current date in PH timezone
 */
function getPHDate() {
    return new Date().toLocaleString('en-US', { timeZone: REFRESH_CONFIG.TIMEZONE });
}

/**
 * Get today's date string (YYYY-MM-DD) in PH timezone
 */
function getTodayDateString() {
    const phDate = new Date(getPHDate());
    return phDate.toISOString().split('T')[0];
}

/**
 * Get next refresh time (8AM PH time)
 */
function getNextRefreshTime() {
    const now = new Date(getPHDate());
    const nextRefresh = new Date(now);
    nextRefresh.setHours(REFRESH_CONFIG.REFRESH_HOUR, 0, 0, 0);

    // If already past 8AM today, set to 8AM tomorrow
    if (now >= nextRefresh) {
        nextRefresh.setDate(nextRefresh.getDate() + 1);
    }

    return nextRefresh;
}

/**
 * Get time until next refresh in milliseconds
 */
function getTimeUntilRefresh() {
    const now = new Date(getPHDate());
    const nextRefresh = getNextRefreshTime();
    return nextRefresh - now;
}

/**
 * Format time remaining
 */
function formatTimeRemaining(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
}

/**
 * Check if refresh is needed
 */
function needsRefresh() {
    const lastRefresh = localStorage.getItem(REFRESH_CONFIG.STORAGE_KEY);
    const today = getTodayDateString();

    // First time or new day
    if (!lastRefresh || lastRefresh !== today) {
        const now = new Date(getPHDate());
        // Only refresh if it's past 8AM
        if (now.getHours() >= REFRESH_CONFIG.REFRESH_HOUR) {
            return true;
        }
    }

    return false;
}

/**
 * Shuffle array (Fisher-Yates)
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Refresh available Pokemon list
 */
function refreshPokemonList() {
    const allPokemon = getAllPokemon();

    // Filter out reward-only Pokemon (they can only be obtained through battles)
    const mintablePokemon = allPokemon.filter(p => !p.rewardOnly);

    // Shuffle and select 15 random Pokemon for today
    const shuffled = shuffleArray(mintablePokemon);
    const todaysPokemon = shuffled.slice(0, 15).map(p => p.id);

    // Save to localStorage
    localStorage.setItem(REFRESH_CONFIG.AVAILABLE_POKEMON_KEY, JSON.stringify(todaysPokemon));
    localStorage.setItem(REFRESH_CONFIG.STORAGE_KEY, getTodayDateString());

    console.log('Pokemon list refreshed!', todaysPokemon);

    return todaysPokemon;
}

/**
 * Get today's available Pokemon IDs
 */
function getTodaysAvailablePokemon() {
    // Check if refresh needed
    if (needsRefresh()) {
        return refreshPokemonList();
    }

    // Get cached list
    const cached = localStorage.getItem(REFRESH_CONFIG.AVAILABLE_POKEMON_KEY);
    if (cached) {
        return JSON.parse(cached);
    }

    // Initialize if not exists
    return refreshPokemonList();
}

/**
 * Get filtered Pokemon list (available + owned)
 */
function getDisplayPokemonList() {
    const todaysIds = getTodaysAvailablePokemon();
    const ownedPokemon = localStore.getOwnedPokemon();
    const ownedIds = new Set(ownedPokemon.map(p => p.pokemonId));

    // Combine today's available + owned Pokemon
    const displayIds = new Set([...todaysIds, ...ownedIds]);

    // Get full Pokemon data
    const allPokemon = getAllPokemon();
    return allPokemon.filter(p => displayIds.has(p.id));
}

/**
 * Check if Pokemon is available today
 */
function isPokemonAvailableToday(pokemonId) {
    const todaysIds = getTodaysAvailablePokemon();
    return todaysIds.includes(pokemonId);
}

/**
 * Force refresh Pokemon list (manual trigger)
 * Used for keyboard shortcut or admin commands
 */
function forceRefresh() {
    console.log('Force refreshing Pokemon list...');
    return refreshPokemonList();
}

// Export functions
window.dailyRefresh = {
    needsRefresh,
    refreshPokemonList,
    getTodaysAvailablePokemon,
    getDisplayPokemonList,
    isPokemonAvailableToday,
    getTimeUntilRefresh,
    formatTimeRemaining,
    getNextRefreshTime,
    forceRefresh
};
