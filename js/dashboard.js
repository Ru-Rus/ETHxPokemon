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

    // Use proper battle stats structure (same as MongoDB schema)
    let battleStats = gameData.battleStats || {
        easy: { wins: 0, losses: 0 },
        medium: { wins: 0, losses: 0 },
        hard: { wins: 0, losses: 0 }
    };

    // Fallback: if old battleHistory exists but battleStats doesn't, compute from history
    if (!gameData.battleStats && gameData.battleHistory) {
        battleStats = {
            easy: { wins: 0, losses: 0 },
            medium: { wins: 0, losses: 0 },
            hard: { wins: 0, losses: 0 }
        };

        gameData.battleHistory.forEach(battle => {
            const difficulty = battle.difficulty || 'easy';
            if (battle.result === 'win') {
                battleStats[difficulty].wins++;
            } else if (battle.result === 'loss') {
                battleStats[difficulty].losses++;
            }
        });
    }

    // Calculate totals
    const totalWins = battleStats.easy.wins + battleStats.medium.wins + battleStats.hard.wins;
    const totalLosses = battleStats.easy.losses + battleStats.medium.losses + battleStats.hard.losses;
    const totalBattles = totalWins + totalLosses;
    const winRate = totalBattles > 0 ? Math.round((totalWins / totalBattles) * 100) : 0;

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
    //loadCollection();
}

async function loadCollectionStats() {
    // Check if in blockchain mode
    if (window.APP_CONFIG && window.APP_CONFIG.MODE === 'blockchain') {
        await loadCollectionStatsFromBlockchain();
    } 
}

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
        const response = await apiService.getCurrentUser();
        if (response.success) {
            const user = response.user;

            // Update username
            document.getElementById('username').textContent = user.username;

            // Update stats
            var balanceVar = balance;
            var owneedCountVar = ownedCount
            document.getElementById('balance').textContent = balanceVar;
            document.getElementById('total-pokemon').textContent = owneedCountVar;
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
    } catch (error) {
        console.error('Error loading collection stats from blockchain:', error);
    }
}


// Initialize on page load (handles async loading)
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
        loadDashboard();
    });
} else {
    // DOM already loaded, initialize immediately
    loadDashboard();
}


