/**
 * Dashboard Logic
 * Supports both local storage and blockchain modes
 */

async function loadDashboard() {
    const mode = window.APP_CONFIG?.MODE || 'local';

    try {
        if (mode === 'local') {
            await loadLocalDashboard();
        } else {
            await loadBlockchainDashboard();
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        alert('Failed to load dashboard. Please try again.');
    }
}

/**
 * Load dashboard data from local storage
 */
async function loadLocalDashboard() {
    const gameData = localStore.getGameData();

    // Ensure battleHistory exists
    const battleHistory = gameData.battleHistory || [];

    // Calculate statistics
    const totalWins = battleHistory.filter(b => b.result === 'win').length;
    const totalLosses = battleHistory.filter(b => b.result === 'loss').length;
    const totalBattles = totalWins + totalLosses;
    const winRate = totalBattles > 0 ? Math.round((totalWins / totalBattles) * 100) : 0;

    // Calculate battle stats by difficulty
    const battleStats = {
        easy: { wins: 0, losses: 0 },
        medium: { wins: 0, losses: 0 },
        hard: { wins: 0, losses: 0 }
    };

    battleHistory.forEach(battle => {
        const difficulty = battle.difficulty || 'easy';
        if (battle.result === 'win') {
            battleStats[difficulty].wins++;
        } else if (battle.result === 'loss') {
            battleStats[difficulty].losses++;
        }
    });

    // Get username from API
    let username = 'Player';
    try {
        const userResponse = await apiService.getCurrentUser();
        if (userResponse.success && userResponse.user) {
            username = userResponse.user.username;
        }
    } catch (error) {
        console.log('Could not fetch username from API, using default');
        username = gameData.userId || 'Player';
    }

    // Update UI
    document.getElementById('username').textContent = username;
    document.getElementById('balance').textContent = gameData.balance.toLocaleString();
    document.getElementById('total-pokemon').textContent = gameData.ownedPokemon.length;
    document.getElementById('total-wins').textContent = totalWins;
    document.getElementById('win-rate').textContent = winRate + '%';

    // Update battle stats by difficulty
    document.getElementById('easy-wins').textContent = battleStats.easy.wins;
    document.getElementById('easy-losses').textContent = battleStats.easy.losses;
    document.getElementById('medium-wins').textContent = battleStats.medium.wins;
    document.getElementById('medium-losses').textContent = battleStats.medium.losses;
    document.getElementById('hard-wins').textContent = battleStats.hard.wins;
    document.getElementById('hard-losses').textContent = battleStats.hard.losses;

    // Show dashboard content
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('dashboard-content').style.display = 'block';
}

/**
 * Load dashboard data from blockchain/API
 */
async function loadBlockchainDashboard() {
    const response = await apiService.getCurrentUser();

    if (response.success) {
        const user = response.user;

        // Update username
        document.getElementById('username').textContent = user.username;

        // Update stats
        document.getElementById('balance').textContent = user.balance.toLocaleString();
        document.getElementById('total-pokemon').textContent = user.ownedPokemon.length;
        document.getElementById('total-wins').textContent = user.totalWins;
        document.getElementById('win-rate').textContent = user.winRate + '%';

        // Update battle stats
        document.getElementById('easy-wins').textContent = user.battleStats.easy.wins;
        document.getElementById('easy-losses').textContent = user.battleStats.easy.losses;
        document.getElementById('medium-wins').textContent = user.battleStats.medium.wins;
        document.getElementById('medium-losses').textContent = user.battleStats.medium.losses;
        document.getElementById('hard-wins').textContent = user.battleStats.hard.wins;
        document.getElementById('hard-losses').textContent = user.battleStats.hard.losses;

        // Show dashboard content
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('dashboard-content').style.display = 'block';
    }
}

// Load on page load
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', loadDashboard);
} else {
    loadDashboard();
}
