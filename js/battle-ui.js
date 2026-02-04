/**
 * Battle UI Controller
 * Handles the battle interface and user interactions
 */

let currentBattle = null;
let currentTournament = null;
let selectedPokemon = null;
let selectedDifficulty = 'medium';
let isTournamentMode = true; // Always use tournament mode

/**
 * Initialize battle page
 */
async function initBattlePage() {
    // Check if wallet is already connected (from MetaMask)
    let walletConnected = false;
    if (window.web3Utils && window.web3Utils.isMetaMaskInstalled && window.ethereum && window.ethereum.selectedAddress) {
        console.log('Wallet already connected, initializing...');
        try {
            await window.web3Utils.connectWallet();
            walletConnected = window.web3Utils.isConnected;
            console.log('Auto-connect successful, connected:', walletConnected);
        } catch (err) {
            console.log('Auto-connect failed, will show connect prompt:', err.message);
            walletConnected = false;
        }
    }
    
    // Check mode and show appropriate initial screen
    if (window.APP_CONFIG && window.APP_CONFIG.MODE === 'blockchain' && !walletConnected) {
        console.log('Blockchain mode but wallet not connected - showing connect message');
        showConnectWalletMessage();
    } else {
        console.log('Showing difficulty selection');
        showDifficultySelection();
    }
}

/**
 * Load user's owned Pokemon for selection
 */
function loadOwnedPokemon() {
    console.log('=== loadOwnedPokemon called ===');
    console.log('APP_CONFIG:', window.APP_CONFIG);
    console.log('MODE:', window.APP_CONFIG?.MODE);
    console.log('window.web3Utils:', !!window.web3Utils);
    console.log('isConnected:', window.web3Utils?.isConnected);

    // Check if Pokemon was pre-selected from collection page
    const preSelected = sessionStorage.getItem('selectedPokemonForBattle');
    if (preSelected) {
        console.log('Pre-selected Pokemon found:', preSelected);
        selectedPokemon = parseInt(preSelected);
        sessionStorage.removeItem('selectedPokemonForBattle');
    }

    // Check if in blockchain mode
    if (window.APP_CONFIG && window.APP_CONFIG.MODE === 'blockchain') {
        console.log('=== Calling loadOwnedPokemonFromBlockchain ===');
        loadOwnedPokemonFromBlockchain();
    } else {
        console.log('=== Calling loadOwnedPokemonFromLocal ===');
        loadOwnedPokemonFromLocal();
    }
}

/**
 * Load owned Pokemon from local storage (local mode)
 */
function loadOwnedPokemonFromLocal() {
    const ownedPokemon = localStore.getOwnedPokemon();

    if (ownedPokemon.length === 0) {
        showNoPokemonMessage();
        return;
    }

    renderPokemonSelection(ownedPokemon.map(p => ({
        pokemonId: p.pokemonId,
        level: p.level,
        tokenId: null // No token ID in local mode
    })));
}

/**
 * Load owned Pokemon from blockchain
 */
async function loadOwnedPokemonFromBlockchain() {
    try {
        console.log('Loading Pokemon from blockchain...');
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
            console.log('No NFTs found - showing no Pokemon message');
            showNoPokemonMessage();
            return;
        }

        // Get Pokemon data for each token
        const ownedPokemon = [];
        for (const tokenId of tokenIds) {
            try {
                console.log('Getting Pokemon ID for token:', tokenId);
                const pokemonId = await window.web3Utils.getPokemonIdFromToken(tokenId);
                console.log('Pokemon ID for token', tokenId, ':', pokemonId);
                if (pokemonId) {
                    ownedPokemon.push({
                        pokemonId: pokemonId,
                        level: 5, // Default level for blockchain mode
                        tokenId: tokenId
                    });
                } else {
                    console.warn('No Pokemon ID found for token', tokenId);
                }
            } catch (error) {
                console.error('Error getting Pokemon data for token', tokenId, error);
            }
        }

        console.log('Final owned Pokemon array:', ownedPokemon);

        if (ownedPokemon.length === 0) {
            showNoPokemonMessage();
            return;
        }

        renderPokemonSelection(ownedPokemon);

    } catch (error) {
        console.error('Error loading owned Pokemon from blockchain:', error);
        showNoPokemonMessage();
    }
}

/**
 * Render Pokemon selection grid
 */
function renderPokemonSelection(ownedPokemon) {
    console.log('renderPokemonSelection called with:', ownedPokemon.length, 'Pokemon');
    const grid = document.getElementById('pokemon-select-grid');
    console.log('Grid element found:', !!grid);
    if (!grid) {
        console.error('pokemon-select-grid not found!');
        return;
    }
    
    grid.innerHTML = '';

    // Get blockchain levels if in blockchain mode
    const blockchainLevels = (window.APP_CONFIG && window.APP_CONFIG.MODE === 'blockchain') 
        ? JSON.parse(localStorage.getItem('blockchainPokemonLevels') || '{}')
        : {};

    ownedPokemon.forEach((owned, index) => {
        const pokemonData = getPokemonById(owned.pokemonId);
        console.log('Pokemon data for ID', owned.pokemonId, ':', !!pokemonData);
        if (!pokemonData) return;

        // Use stored level for blockchain mode, otherwise use owned.level
        const displayLevel = (window.APP_CONFIG && window.APP_CONFIG.MODE === 'blockchain')
            ? (blockchainLevels[owned.pokemonId] || owned.level)
            : owned.level;

        const card = document.createElement('div');
        card.className = 'pokemon-select-card';
        card.setAttribute('data-pokemon-id', owned.pokemonId);
        card.onclick = () => selectPokemon(owned.pokemonId);
        card.innerHTML = `
            <img src="${pokemonData.sprite}" alt="${pokemonData.name}">
            <div style="font-weight: bold; margin-top: 0.5rem;">${pokemonData.name}</div>
            <div style="font-size: 0.8rem; color: #666;">Lv. ${displayLevel}</div>
            ${owned.tokenId ? `<div style="font-size: 0.7rem; color: #999;">Token #${owned.tokenId}</div>` : ''}
        `;
        grid.appendChild(card);
        console.log('Added card for', pokemonData.name);
    });

    console.log('Total cards added:', grid.children.length);

    // Auto-select first Pokemon
    if (!selectedPokemon && ownedPokemon.length > 0) {
        selectPokemon(ownedPokemon[0].pokemonId);
    }
}

/**
 * Show message when no Pokemon are found
 */
function showNoPokemonMessage() {
    document.getElementById('battle-content').innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <h2 style="color: var(--pokemon-red);">No Pokemon Found!</h2>
            <p style="font-size: 1.2rem; margin: 2rem 0;">
                You need to mint Pokemon first before you can battle.
            </p>
            <a href="mint.html" class="btn-primary">Go to Mint Page</a>
        </div>
    `;
}

/**
 * Show connect wallet message
 */
function showConnectWalletMessage() {
    document.getElementById('battle-content').innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <h2 style="color: var(--pokemon-blue);">Connect Your Wallet</h2>
            <p style="font-size: 1.2rem; margin: 2rem 0;">
                Connect your MetaMask wallet to view your minted Pokemon NFTs and battle!
            </p>
            <button class="btn-primary" onclick="connectWalletForBattle()" style="font-size: 1.2rem; padding: 1rem 2rem;">
                Connect MetaMask
            </button>
            <p style="margin-top: 1rem; color: #666;">
                Don't have Pokemon yet? <a href="mint.html">Mint some first</a>
            </p>
        </div>
    `;
}

/**
 * Show difficulty selection interface
 */
function showDifficultySelection() {
    document.getElementById('battle-content').innerHTML = `
        <!-- Difficulty Selection -->
        <div id="difficulty-select" class="difficulty-select">
            <h2>Select Difficulty</h2>
            <p style="color: #666; margin-bottom: 1rem;">
                Choose your opponent's strength level
            </p>
            <div class="difficulty-buttons">
                <button class="difficulty-btn easy" onclick="selectDifficulty('easy')">
                    EASY<br>
                    <small>70% Stats | Random Moves</small>
                </button>
                <button class="difficulty-btn medium" onclick="selectDifficulty('medium')">
                    MEDIUM<br>
                    <small>100% Stats | 50% Smart</small>
                </button>
                <button class="difficulty-btn hard" onclick="selectDifficulty('hard')">
                    HARD<br>
                    <small>120% Stats | 80% Optimal</small>
                </button>
            </div>
        </div>

        <!-- Pokemon Selection -->
        <div id="pokemon-select" class="pokemon-select" style="display: none;">
            <h2>Choose Your Pokemon</h2>
            <div id="pokemon-select-grid" class="pokemon-select-grid">
                <!-- Pokemon cards will be inserted here -->
            </div>
            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn-primary" onclick="startBattle()" style="font-size: 1.3rem; padding: 1.2rem 3rem;">
                    START BATTLE!
                </button>
            </div>
        </div>

        <!-- Battle Arena -->
        <div id="battle-arena" class="battle-arena" style="display: none;">
            <!-- Battle Field -->
            <div class="battle-field">
                <!-- Player Pokemon -->
                <div class="pokemon-display player">
                    <img id="player-sprite" class="pokemon-sprite" src="" alt="Player Pokemon">
                    <div class="pokemon-info">
                        <div id="player-name" class="pokemon-name-display"></div>
                        <div id="player-level" class="pokemon-level"></div>
                        <div class="hp-bar-container">
                            <div id="player-hp-bar" class="hp-bar"></div>
                        </div>
                    </div>
                </div>

                <!-- Opponent Pokemon -->
                <div class="pokemon-display opponent">
                    <img id="opponent-sprite" class="pokemon-sprite" src="" alt="Opponent Pokemon">
                    <div class="pokemon-info">
                        <div id="opponent-name" class="pokemon-name-display"></div>
                        <div id="opponent-level" class="pokemon-level"></div>
                        <div class="hp-bar-container">
                            <div id="opponent-hp-bar" class="hp-bar"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Battle Controls -->
            <div class="battle-controls">
                <h3 style="text-align: center; margin-bottom: 1rem; color: var(--pokemon-dark-blue);">
                    Select Your Move
                </h3>
                <div class="moves-grid">
                    <!-- Moves will be inserted dynamically -->
                </div>
                <div id="waiting-message" class="waiting-message" style="display: none;">
                    Waiting for opponent...
                </div>
            </div>

            <!-- Battle Log -->
            <div class="battle-log">
                <div class="battle-log-title">Battle Log</div>
                <pre id="battle-log-text" style="white-space: pre-wrap; margin: 0;"></pre>
            </div>

            <!-- Battle Result -->
            <div id="battle-result" class="battle-result" style="display: none;">
                <!-- Result will be inserted here -->
            </div>
        </div>
    `;
}

/**
 * Connect wallet for battle page
 */
async function connectWalletForBattle() {
    try {
        if (!window.web3Utils) {
            alert('Web3 not loaded. Please refresh the page.');
            return;
        }

        await window.web3Utils.connectWallet();
        console.log('Wallet connected, showing difficulty selection...');
        showDifficultySelection(); // Show difficulty selection after connecting
    } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert('Failed to connect wallet: ' + error.message);
    }
}
    
/**
 * Show tournament information
 */
function showTournamentInfo() {
    if (!currentTournament) return;

    // Update tournament status display
    const status = currentTournament.getStatus();
    console.log('Tournament status:', status);

    // You could add tournament info display here
    // For now, just log the information
}

/**
 * Start the next match in the tournament
 */
function startNextMatch() {
    if (!currentTournament) return;

    const nextMatch = currentTournament.getNextMatch();
    if (!nextMatch) {
        console.log('Tournament complete!');
        showTournamentResults();
        return;
    }

    console.log('Starting match:', nextMatch);

    // Create battle instance
    currentBattle = new Battle(nextMatch.player1, nextMatch.player2, selectedDifficulty);

    // Initialize battle UI
    updateBattleDisplay();

    // If opponent goes first, execute their move
    if (!currentBattle.isPlayerTurn) {
        setTimeout(() => {
            executeOpponentMove();
        }, 1000);
    }
}

/**
 * Update battle display with current Pokemon
 */
function updateBattleDisplay() {
    if (!currentBattle) return;

    const player = currentBattle.player;
    const opponent = currentBattle.opponent;

    // Update player Pokemon
    document.getElementById('player-sprite').src = player.sprite;
    document.getElementById('player-name').textContent = player.name;
    document.getElementById('player-level').textContent = `Lv. ${player.level}`;
    updateHpBar('player-hp-bar', player.currentHp, player.stats.hp);

    // Update opponent Pokemon
    document.getElementById('opponent-sprite').src = opponent.sprite;
    document.getElementById('opponent-name').textContent = opponent.name;
    document.getElementById('opponent-level').textContent = `Lv. ${opponent.level}`;
    updateHpBar('opponent-hp-bar', opponent.currentHp, opponent.stats.hp);

    // Update moves
    updateMovesGrid();
}

/**
 * Update HP bar
 */
function updateHpBar(barId, currentHp, maxHp) {
    const bar = document.getElementById(barId);
    const percentage = (currentHp / maxHp) * 100;
    bar.style.width = `${percentage}%`;

    if (percentage > 50) {
        bar.style.background = 'var(--pokemon-green)';
    } else if (percentage > 25) {
        bar.style.background = 'var(--pokemon-yellow)';
    } else {
        bar.style.background = 'var(--pokemon-red)';
    }
}

/**
 * Update moves grid
 */
function updateMovesGrid() {
    const movesGrid = document.querySelector('.moves-grid');
    if (!movesGrid || !currentBattle) return;

    movesGrid.innerHTML = '';

    currentBattle.player.moves.forEach((move, index) => {
        const btn = document.createElement('button');
        btn.className = 'move-btn';
        btn.onclick = () => useMove(index);
        btn.innerHTML = `
            <span class="move-name">${move.name}</span>
            <span class="move-details">
                ${move.type} | Power: ${move.power} | Acc: ${move.accuracy}%
            </span>
        `;
        movesGrid.appendChild(btn);
    });
}

/**
 * Use a move
 */
function useMove(moveIndex) {
    if (!currentBattle || !currentBattle.isPlayerTurn) return;

    const move = currentBattle.player.moves[moveIndex];
    currentBattle.executeMove(move);

    updateBattleDisplay();

    // Check for battle end
    if (currentBattle.winner) {
        handleBattleEnd();
        return;
    }

    // Opponent's turn
    currentBattle.isPlayerTurn = false;
    setTimeout(() => {
        executeOpponentMove();
    }, 1500);
}

/**
 * Execute opponent move
 */
function executeOpponentMove() {
    if (!currentBattle || currentBattle.isPlayerTurn) return;

    const move = currentBattle.opponent.getRandomMove();
    currentBattle.executeMove(move);

    updateBattleDisplay();

    // Check for battle end
    if (currentBattle.winner) {
        handleBattleEnd();
        return;
    }

    // Player's turn
    currentBattle.isPlayerTurn = true;
}

/**
 * Handle battle end
 */
function handleBattleEnd() {
    if (!currentBattle || !currentTournament) return;

    const winner = currentBattle.winner;
    currentTournament.recordMatchResult(currentBattle.player, currentBattle.opponent, winner);

    // Show result
    setTimeout(() => {
        if (winner === currentBattle.player) {
            alert(`You won! ${currentBattle.player.name} defeated ${currentBattle.opponent.name}!`);
        } else {
            alert(`You lost! ${currentBattle.opponent.name} defeated ${currentBattle.player.name}!`);
        }

        // Start next match
        startNextMatch();
    }, 2000);
}

/**
 * Show tournament results
 */
function showTournamentResults() {
    if (!currentTournament) return;

    const results = currentTournament.getResults();
    alert(`Tournament Complete!\n\n${results.message}`);

    // Reset to main menu
    document.getElementById('pokemon-select').style.display = 'none';
    document.getElementById('difficulty-select').style.display = 'block';
    document.getElementById('battle-arena').style.display = 'none';

    // Reset state
    currentBattle = null;
    currentTournament = null;
    selectedPokemon = null;
}

/**
 * Select a Pokemon for battle
 */
function selectPokemon(pokemonId) {
    selectedPokemon = pokemonId;
    
    // Update visual selection
    const cards = document.querySelectorAll('.pokemon-select-card');
    cards.forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`.pokemon-select-card[data-pokemon-id="${pokemonId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    console.log('Selected Pokemon:', pokemonId);
}

/**
 * Select difficulty
 */
function selectDifficulty(difficulty) {
    console.log('=== selectDifficulty called with:', difficulty, '===');
    selectedDifficulty = difficulty;
    
    // Hide difficulty selection and show Pokemon selection
    const difficultyEl = document.getElementById('difficulty-select');
    const pokemonEl = document.getElementById('pokemon-select');
    console.log('Elements found - difficulty:', !!difficultyEl, 'pokemon:', !!pokemonEl);
    
    if (difficultyEl) {
        difficultyEl.style.display = 'none';
        console.log('Hidden difficulty selection');
    }
    if (pokemonEl) {
        pokemonEl.style.display = 'block';
        console.log('Shown Pokemon selection');
    }
    
    // Load owned Pokemon for selection
    console.log('About to call loadOwnedPokemon...');
    loadOwnedPokemon();
    console.log('Called loadOwnedPokemon');
}

/**
 * Start tournament
 */
function startBattle() {
    if (!selectedPokemon) {
        alert('Please select a Pokemon first!');
        return;
    }

    let playerPokemon;

    // Check if in blockchain mode
    if (window.APP_CONFIG && window.APP_CONFIG.MODE === 'blockchain') {
        // In blockchain mode, we need to create Pokemon from blockchain data
        // We need to get the Pokemon data from the rendered cards or stored data
        const selectedCard = document.querySelector('.pokemon-select-card.selected');
        if (!selectedCard) {
            alert('Please select a Pokemon first!');
            return;
        }

        const pokemonId = parseInt(selectedCard.getAttribute('data-pokemon-id'));
        const pokemonData = getPokemonById(pokemonId);

        if (!pokemonData) {
            alert('Failed to load Pokemon data!');
            return;
        }

        // Get level from local storage for blockchain mode
        const blockchainLevels = JSON.parse(localStorage.getItem('blockchainPokemonLevels') || '{}');
        const level = blockchainLevels[pokemonId] || 5;

        // Create Pokemon instance with correct level for blockchain mode
        playerPokemon = new Pokemon(pokemonData, level);
    } else {
        // Local storage mode
        playerPokemon = localStore.getPokemonInstance(selectedPokemon);
    }

    if (!playerPokemon) {
        alert('Failed to load Pokemon!');
        return;
    }

    // Create tournament
    currentTournament = new Tournament(playerPokemon, selectedDifficulty);

    // Hide selection, show battle arena
    document.getElementById('pokemon-select').style.display = 'none';
    document.getElementById('difficulty-select').style.display = 'none';
    document.getElementById('battle-arena').style.display = 'block';

    // Show tournament info and start first match
    showTournamentInfo();
    startNextMatch();
}

/**
 * Show tournament bracket info
 */
function showTournamentInfo() {
    const status = currentTournament.getStatus();
    console.log('Tournament Status:', status);
}

/**
 * Start next match in tournament
 */
function startNextMatch() {
    const match = currentTournament.getCurrentMatch();

    if (!match) {
        // Tournament complete
        showTournamentResult();
        return;
    }

    // Check if player is in this match
    if (currentTournament.isPlayerMatch()) {
        // Player battles
        const opponent = match.player1 === currentTournament.playerPokemon ? match.player2 : match.player1;

        // Heal player's Pokemon
        currentTournament.playerPokemon.fullHeal();

        // Create battle
        currentBattle = new Battle(currentTournament.playerPokemon, opponent, selectedDifficulty);

        // Show round info
        const status = currentTournament.getStatus();
        alert(`${status.roundName} - Match ${status.currentMatch}\n\n` +
              `You vs ${opponent.name}\n\n` +
              `Good luck!`);

        // Render battle UI
        renderBattle();
        initMovesDisplay();

        // If opponent goes first, execute their turn
        if (!currentBattle.isPlayerTurn) {
            setTimeout(() => {
                executeBotTurn();
            }, 1000);
        }
    } else {
        // Bot vs Bot - simulate (silent, no alerts)
        const winner = currentTournament.simulateBotMatch(match);
        currentTournament.recordMatchResult(winner);

        // Auto-continue to next match without showing bot results
        setTimeout(() => {
            startNextMatch();
        }, 100);
    }
}

/**
 * Show tournament result
 */
function showTournamentResult() {
    const status = currentTournament.getStatus();

    if (status.winner === currentTournament.playerPokemon) {
        // Player won tournament!
        battleSounds.playVictory();

        alert('🏆 TOURNAMENT CHAMPION! 🏆\n\n' +
              'You defeated all opponents and won the tournament!\n\n' +
              'Congratulations!');
    } else {
        // Player lost
        battleSounds.playDefeat();
        alert('Tournament Over\n\n' +
              'You were eliminated from the tournament.\n\n' +
              'Better luck next time!');
    }

    // Show result screen
    const resultDiv = document.getElementById('battle-result');
    resultDiv.className = 'battle-result ' + (status.winner === currentTournament.playerPokemon ? 'victory' : 'defeat');
    resultDiv.innerHTML = `
        <div class="result-title ${status.winner === currentTournament.playerPokemon ? 'victory' : 'defeat'}">
            ${status.winner === currentTournament.playerPokemon ? '🏆 TOURNAMENT CHAMPION! 🏆' : 'ELIMINATED'}
        </div>
        <div class="result-details">
            ${status.winner === currentTournament.playerPokemon ?
                'You defeated all opponents and won the tournament!' :
                `You were eliminated from the tournament.${status.winner ? '<br>Tournament Winner: ' + status.winner.name : ''}`
            }
        </div>
        <div class="result-actions">
            <button class="btn-primary" onclick="showBracketUI()">📊 View Tournament Bracket</button>
            <button class="btn-primary" onclick="resetBattle()">New Tournament</button>
            <button class="btn-primary" onclick="location.href='collection.html'">My Collection</button>
        </div>
    `;
    resultDiv.style.display = 'block';

    // Auto-show bracket after a delay
    setTimeout(() => {
        if (typeof TournamentBracketUI !== 'undefined') {
            TournamentBracketUI.showBracket(currentTournament);
        }
    }, 1000);
}

/**
 * Show tournament bracket UI
 */
function showBracketUI() {
    if (currentTournament && typeof TournamentBracketUI !== 'undefined') {
        TournamentBracketUI.showBracket(currentTournament);
    } else {
        alert('Tournament bracket not available');
    }
}

/**
 * Render battle state
 */
function renderBattle() {
    const state = currentBattle.getState();

    // Update player display
    document.getElementById('player-sprite').src = currentBattle.player.sprite;
    document.getElementById('player-name').textContent = state.player.name;
    document.getElementById('player-level').textContent = `Lv. ${currentBattle.player.level}`;

    const playerHPBar = document.getElementById('player-hp-bar');
    playerHPBar.style.width = state.player.hpPercent + '%';
    playerHPBar.style.backgroundColor = currentBattle.player.getHPBarColor();
    playerHPBar.textContent = `${state.player.currentHP}/${state.player.maxHP}`;

    // Update opponent display
    document.getElementById('opponent-sprite').src = currentBattle.opponent.sprite;
    document.getElementById('opponent-name').textContent = state.opponent.name;
    document.getElementById('opponent-level').textContent = `Lv. ${currentBattle.opponent.level}`;

    const opponentHPBar = document.getElementById('opponent-hp-bar');
    opponentHPBar.style.width = state.opponent.hpPercent + '%';
    opponentHPBar.style.backgroundColor = currentBattle.opponent.getHPBarColor();
    opponentHPBar.textContent = `${state.opponent.currentHP}/${state.opponent.maxHP}`;

    // Update battle log
    document.getElementById('battle-log-text').textContent = state.log;

    // Auto-scroll to bottom
    const logContainer = document.getElementById('battle-log-text');
    logContainer.scrollTop = logContainer.scrollHeight;

    // Enable/disable move buttons
    const moveButtons = document.querySelectorAll('.move-btn');
    moveButtons.forEach(btn => {
        btn.disabled = !state.isPlayerTurn || state.winner !== null;
    });

    // Show waiting message if not player's turn
    const waitingMsg = document.getElementById('waiting-message');
    if (!state.isPlayerTurn && !state.winner) {
        waitingMsg.style.display = 'block';
        waitingMsg.textContent = `Waiting for ${state.opponent.name}...`;
    } else {
        waitingMsg.style.display = 'none';
    }

    // Check for battle end
    if (state.winner) {
        showBattleResult(state.winner);
    }
}

/**
 * Animate attack
 */
function animateAttack(isPlayer) {
    const sprite = document.getElementById(isPlayer ? 'player-sprite' : 'opponent-sprite');
    if (!sprite) return;

    sprite.style.transform = 'scale(1.2)';
    sprite.style.filter = 'brightness(1.5)';

    setTimeout(() => {
        sprite.style.transform = 'scale(1)';
        sprite.style.filter = 'brightness(1)';
    }, 200);
}

/**
 * Animate damage
 */
function animateDamage(isPlayer) {
    const sprite = document.getElementById(isPlayer ? 'player-sprite' : 'opponent-sprite');
    if (!sprite) return;

    sprite.style.filter = 'brightness(2) saturate(0)';
    sprite.style.transform = 'translateX(' + (isPlayer ? '-10px' : '10px') + ')';

    setTimeout(() => {
        sprite.style.filter = 'brightness(1) saturate(1)';
        sprite.style.transform = 'translateX(0)';
    }, 150);
}

/**
 * Player uses move
 */
function useMove(moveIndex) {
    if (!currentBattle || !currentBattle.isPlayerTurn) return;

    // Play attack sound
    if (typeof battleSounds !== 'undefined') {
        battleSounds.playAttack();
    }

    // Animate attack
    animateAttack(true);

    setTimeout(() => {
        // Play hit sound
        if (typeof battleSounds !== 'undefined') {
            battleSounds.playHit();
        }

        animateDamage(false);

        const result = currentBattle.playerTurn(moveIndex);
        renderBattle();

        if (result.ended) {
            return;
        }

        // Execute bot turn after delay
        setTimeout(() => {
            executeBotTurn();
        }, 1500);
    }, 300);
}

/**
 * Execute bot's turn
 */
function executeBotTurn() {
    if (!currentBattle) return;

    // Play attack sound
    if (typeof battleSounds !== 'undefined') {
        battleSounds.playAttack();
    }

    // Animate bot attack
    animateAttack(false);

    setTimeout(() => {
        // Play hit sound
        if (typeof battleSounds !== 'undefined') {
            battleSounds.playHit();
        }

        animateDamage(true);

        const result = currentBattle.opponentTurn();
        renderBattle();
    }, 300);
}

/**
 * Show battle result (for individual match)
 */
function showBattleResult(winner) {
    const isVictory = winner === 'player';

    // Play sound
    if (isVictory) {
        battleSounds.playVictory();
    } else {
        battleSounds.playDefeat();
    }

    // Disable all move buttons
    document.querySelectorAll('.move-btn').forEach(btn => btn.disabled = true);

    // Record tournament result
    if (currentTournament) {
        const matchWinner = isVictory ? currentTournament.playerPokemon : currentBattle.opponent;
        currentTournament.recordMatchResult(matchWinner);

        // Show match result
        setTimeout(() => {
            const status = currentTournament.getStatus();

            if (isVictory) {
                alert(`Match Won!\n\n` +
                      `You defeated ${currentBattle.opponent.name}!\n\n` +
                      `Advancing to next round...`);

                // Continue tournament
                document.getElementById('battle-result').style.display = 'none';
                startNextMatch();
            } else {
                // Player lost - tournament over
                showTournamentResult();
            }
        }, 2000);
    } else {
        // Non-tournament battle
        const resultDiv = document.getElementById('battle-result');
        resultDiv.className = 'battle-result ' + (isVictory ? 'victory' : 'defeat');
        resultDiv.innerHTML = `
            <div class="result-title ${isVictory ? 'victory' : 'defeat'}">
                ${isVictory ? 'VICTORY!' : 'DEFEAT!'}
            </div>
            <div class="result-details">
                ${isVictory ?
                    `${currentBattle.player.name} defeated ${currentBattle.opponent.name}!` :
                    `${currentBattle.opponent.name} defeated ${currentBattle.player.name}!`
                }
            </div>
            <div class="result-actions">
                <button class="btn-primary" onclick="resetBattle()">Battle Again</button>
                <button class="btn-primary" onclick="location.href='collection.html'">My Collection</button>
            </div>
        `;
        resultDiv.style.display = 'block';
    }
}

/**
 * Reset battle
 */
function resetBattle() {
    currentBattle = null;
    currentTournament = null;
    document.getElementById('battle-arena').style.display = 'none';
    document.getElementById('battle-result').style.display = 'none';
    document.getElementById('pokemon-select').style.display = 'block';
    document.getElementById('difficulty-select').style.display = 'block';

    loadOwnedPokemon();
}

/**
 * Initialize moves display
 */
function initMovesDisplay() {
    console.log('=== initMovesDisplay called ===');
    // This will be called after Pokemon is selected
    if (!currentBattle) {
        console.log('No current battle, returning');
        return;
    }

    const movesGrid = document.querySelector('.moves-grid');
    console.log('movesGrid element found:', !!movesGrid);
    if (!movesGrid) {
        console.error('moves-grid element not found!');
        return;
    }
    
    movesGrid.innerHTML = '';
    console.log('Player moves:', currentBattle.player.moves);

    currentBattle.player.moves.forEach((move, index) => {
        console.log('Creating button for move:', move.name);
        const btn = document.createElement('button');
        btn.className = 'move-btn';
        btn.onclick = () => useMove(index);
        btn.innerHTML = `
            <span class="move-name">${move.name}</span>
            <span class="move-details">
                ${move.type} | Power: ${move.power} | Acc: ${move.accuracy}%
            </span>
        `;
        movesGrid.appendChild(btn);
    });
    
    console.log('Moves display initialized, buttons created:', movesGrid.children.length);
}

// Initialize on page load (handles async loading)
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
        initBattlePage();
    });
} else {
    // DOM already loaded, initialize immediately
    initBattlePage();
}
