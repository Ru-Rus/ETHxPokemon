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
function initBattlePage() {
    loadOwnedPokemon();
}

/**
 * Load user's owned Pokemon for selection
 */
function loadOwnedPokemon() {
    // Check if Pokemon was pre-selected from collection page
    const preSelected = sessionStorage.getItem('selectedPokemonForBattle');
    if (preSelected) {
        selectedPokemon = parseInt(preSelected);
        sessionStorage.removeItem('selectedPokemonForBattle');
    }

    const ownedPokemon = localStore.getOwnedPokemon();

    if (ownedPokemon.length === 0) {
        document.getElementById('battle-content').innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <h2 style="color: var(--pokemon-red);">No Pokemon Found!</h2>
                <p style="font-size: 1.2rem; margin: 2rem 0;">
                    You need to mint Pokemon first before you can battle.
                </p>
                <a href="mint.html" class="btn-primary">Go to Mint Page</a>
            </div>
        `;
        return;
    }

    const grid = document.getElementById('pokemon-select-grid');
    grid.innerHTML = '';

    ownedPokemon.forEach(owned => {
        const pokemonData = getPokemonById(owned.pokemonId);
        if (!pokemonData) return;

        const card = document.createElement('div');
        card.className = 'pokemon-select-card';
        card.onclick = () => selectPokemon(owned.pokemonId);
        card.innerHTML = `
            <img src="${pokemonData.sprite}" alt="${pokemonData.name}">
            <div style="font-weight: bold; margin-top: 0.5rem;">${pokemonData.name}</div>
            <div style="font-size: 0.8rem; color: #666;">Lv. ${owned.level}</div>
        `;
        grid.appendChild(card);
    });

    // Auto-select first Pokemon
    if (!selectedPokemon) {
        selectPokemon(ownedPokemon[0].pokemonId);
    }
}

/**
 * Select a Pokemon
 */
function selectPokemon(pokemonId) {
    selectedPokemon = pokemonId;

    // Update UI
    document.querySelectorAll('.pokemon-select-card').forEach(card => {
        card.classList.remove('selected');
    });

    const cards = document.querySelectorAll('.pokemon-select-card');
    const ownedPokemon = localStore.getOwnedPokemon();
    const index = ownedPokemon.findIndex(p => p.pokemonId === pokemonId);
    if (index !== -1 && cards[index]) {
        cards[index].classList.add('selected');
    }
}

/**
 * Select difficulty
 */
function selectDifficulty(difficulty) {
    selectedDifficulty = difficulty;
}

/**
 * Start tournament
 */
function startBattle() {
    if (!selectedPokemon) {
        alert('Please select a Pokemon first!');
        return;
    }

    // Get player's Pokemon
    const playerPokemon = localStore.getPokemonInstance(selectedPokemon);
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

    // Show tournament info
    showTournamentInfo();

    // Start first match
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
        // Bot vs Bot - simulate
        const winner = currentTournament.simulateBotMatch(match);
        currentTournament.recordMatchResult(winner);

        // Show simulation result
        setTimeout(() => {
            alert(`Bot Match: ${match.player1.name} vs ${match.player2.name}\n\n` +
                  `Winner: ${winner.name}`);
            startNextMatch();
        }, 500);
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
                'You were eliminated from the tournament.'
            }
        </div>
        <div class="result-actions">
            <button class="btn-primary" onclick="resetBattle()">New Tournament</button>
            <button class="btn-primary" onclick="location.href='collection.html'">My Collection</button>
        </div>
    `;
    resultDiv.style.display = 'block';
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
    // This will be called after Pokemon is selected
    if (!currentBattle) return;

    const movesGrid = document.querySelector('.moves-grid');
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

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    initBattlePage();
});
