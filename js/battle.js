/**
 * Battle System with Bot AI
 * Based on PokeChain damage calculation and Pokemon-Blockchain mechanics
 */

class Battle {
    constructor(playerPokemon, opponentPokemon, difficulty = 'medium') {
        this.player = playerPokemon;
        this.opponent = opponentPokemon;
        this.difficulty = difficulty;
        this.turn = 0;
        this.battleLog = [];
        this.winner = null;
        this.isPlayerTurn = true;

        // Determine who goes first based on speed
        if (this.opponent.stats.speed > this.player.stats.speed) {
            this.isPlayerTurn = false;
        } else if (this.opponent.stats.speed === this.player.stats.speed) {
            this.isPlayerTurn = Math.random() < 0.5;
        }

        this.addLog(`Battle Start! ${this.player.name} vs ${this.opponent.name}!`);
        if (!this.isPlayerTurn) {
            this.addLog(`${this.opponent.name} is faster and goes first!`);
        }
    }

    /**
     * Calculate damage using PokeChain formula
     */
    calculateDamage(attacker, defender, move) {
        const level = attacker.level;
        const movePower = move.power;
        const attackStat = attacker.stats.attack;
        const defenseStat = defender.stats.defense;

        // Base damage calculation
        // baseDamage = (((2 × level / 5 + 2) × movePower × attack / defense) / 50) + 2
        let damage = (((2 * level / 5 + 2) * movePower * attackStat / defenseStat) / 50) + 2;

        // STAB (Same Type Attack Bonus) - 1.5x if move type matches Pokemon type
        const hasSTAB = attacker.hasSTAB(move.type);
        if (hasSTAB) {
            damage *= 1.5;
        }

        // Type effectiveness
        const effectiveness = getTypeEffectiveness(move.type, defender.types);
        damage *= effectiveness;

        // Critical hit (6% chance, 1.5x damage)
        const isCritical = Math.random() < 0.06;
        if (isCritical) {
            damage *= 1.5;
        }

        // Random variance (0.85 to 1.0)
        const variance = 0.85 + Math.random() * 0.15;
        damage *= variance;

        // Defense reduction (30% damage reduction by default)
        damage *= 0.7;

        // Floor the damage
        damage = Math.floor(damage);

        // Minimum 1 damage
        damage = Math.max(1, damage);

        return {
            damage,
            isCritical,
            effectiveness,
            hasSTAB
        };
    }

    /**
     * Execute a move
     */
    executeMove(attacker, defender, move) {
        const result = this.calculateDamage(attacker, defender, move);
        const actualDamage = defender.takeDamage(result.damage);

        // Build message
        let message = `${attacker.name} used ${move.name}!`;

        if (result.isCritical) {
            message += ' Critical hit!';
            if (typeof battleSounds !== 'undefined') {
                setTimeout(() => battleSounds.playCritical(), 100);
            }
        }

        if (result.effectiveness === 0) {
            message += " It doesn't affect the opponent...";
        } else if (result.effectiveness < 1) {
            message += " It's not very effective...";
            if (typeof battleSounds !== 'undefined') {
                setTimeout(() => battleSounds.playNotEffective(), 200);
            }
        } else if (result.effectiveness > 1) {
            message += " It's super effective!";
            if (typeof battleSounds !== 'undefined') {
                setTimeout(() => battleSounds.playSuperEffective(), 200);
            }
        }

        if (result.hasSTAB) {
            message += ' (STAB!)';
        }

        this.addLog(message);
        this.addLog(`${defender.name} took ${actualDamage} damage! (${defender.currentHP}/${defender.maxHP} HP)`);

        // Check if defender fainted
        if (!defender.isAlive()) {
            this.addLog(`${defender.name} fainted!`);
            this.winner = attacker === this.player ? 'player' : 'opponent';

            if (typeof battleSounds !== 'undefined') {
                setTimeout(() => battleSounds.playFaint(), 300);
            }
        }

        // Check for low HP warning
        if (defender.isAlive() && defender.getHPPercent() < 25 && defender === this.player) {
            if (typeof battleSounds !== 'undefined') {
                setTimeout(() => battleSounds.playLowHP(), 400);
            }
        }

        return result;
    }

    /**
     * Bot AI - select move based on difficulty
     */
    botSelectMove() {
        const moves = this.opponent.moves.filter(m => m.power > 0); // Filter out non-damaging moves

        if (this.difficulty === 'easy') {
            // Easy: Random move
            return moves[Math.floor(Math.random() * moves.length)];
        }

        if (this.difficulty === 'medium') {
            // Medium: 50% chance to pick smart move
            if (Math.random() < 0.5) {
                return this.getSmartMove(this.opponent, this.player, moves);
            }
            return moves[Math.floor(Math.random() * moves.length)];
        }

        if (this.difficulty === 'hard') {
            // Hard: 80% chance to pick optimal move
            if (Math.random() < 0.8) {
                return this.getOptimalMove(this.opponent, this.player, moves);
            }
            return this.getSmartMove(this.opponent, this.player, moves);
        }

        return moves[0];
    }

    /**
     * Get smart move (considers type effectiveness)
     */
    getSmartMove(attacker, defender, moves) {
        let bestMove = moves[0];
        let bestEffectiveness = 0;

        for (const move of moves) {
            const effectiveness = getTypeEffectiveness(move.type, defender.types);
            if (effectiveness > bestEffectiveness) {
                bestEffectiveness = effectiveness;
                bestMove = move;
            }
        }

        return bestMove;
    }

    /**
     * Get optimal move (considers damage output)
     */
    getOptimalMove(attacker, defender, moves) {
        let bestMove = moves[0];
        let bestDamage = 0;

        for (const move of moves) {
            const result = this.calculateDamage(attacker, defender, move);
            if (result.damage > bestDamage) {
                bestDamage = result.damage;
                bestMove = move;
            }
        }

        return bestMove;
    }

    /**
     * Player's turn
     */
    playerTurn(moveIndex) {
        if (this.winner) return { ended: true, winner: this.winner };
        if (!this.isPlayerTurn) return { error: "Not player's turn" };

        const move = this.player.moves[moveIndex];
        if (!move) return { error: "Invalid move" };

        this.turn++;
        this.addLog(`\n--- Turn ${this.turn} ---`);

        this.executeMove(this.player, this.opponent, move);

        if (this.winner) {
            return { ended: true, winner: this.winner };
        }

        // Switch to opponent's turn
        this.isPlayerTurn = false;

        // Auto-execute opponent turn after delay
        return { success: true, nextTurn: 'opponent' };
    }

    /**
     * Opponent's turn (bot)
     */
    opponentTurn() {
        if (this.winner) return { ended: true, winner: this.winner };
        if (this.isPlayerTurn) return { error: "Not opponent's turn" };

        if (this.turn === 0) {
            this.turn++;
            this.addLog(`\n--- Turn ${this.turn} ---`);
        }

        const move = this.botSelectMove();
        this.executeMove(this.opponent, this.player, move);

        if (this.winner) {
            return { ended: true, winner: this.winner };
        }

        // Switch to player's turn
        this.isPlayerTurn = true;

        return { success: true, nextTurn: 'player' };
    }

    /**
     * Add to battle log
     */
    addLog(message) {
        this.battleLog.push(message);
    }

    /**
     * Get battle log
     */
    getLog() {
        return this.battleLog.join('\n');
    }

    /**
     * Get battle state
     */
    getState() {
        return {
            turn: this.turn,
            isPlayerTurn: this.isPlayerTurn,
            player: {
                name: this.player.name,
                currentHP: this.player.currentHP,
                maxHP: this.player.maxHP,
                hpPercent: this.player.getHPPercent()
            },
            opponent: {
                name: this.opponent.name,
                currentHP: this.opponent.currentHP,
                maxHP: this.opponent.maxHP,
                hpPercent: this.opponent.getHPPercent()
            },
            winner: this.winner,
            log: this.getLog()
        };
    }
}

/**
 * Generate bot Pokemon based on difficulty
 */
function generateBotPokemon(difficulty = 'medium') {
    // Get random Pokemon from database
    const allPokemon = getAllPokemon();
    const randomPokemon = allPokemon[Math.floor(Math.random() * allPokemon.length)];

    // Create Pokemon instance
    const level = 5;
    const bot = new Pokemon(randomPokemon, level);

    // Adjust stats based on difficulty
    const multipliers = {
        easy: 0.7,
        medium: 1.0,
        hard: 1.2
    };

    const multiplier = multipliers[difficulty] || 1.0;

    bot.stats.hp = Math.floor(bot.stats.hp * multiplier);
    bot.stats.attack = Math.floor(bot.stats.attack * multiplier);
    bot.stats.defense = Math.floor(bot.stats.defense * multiplier);
    bot.stats.speed = Math.floor(bot.stats.speed * multiplier);

    bot.maxHP = bot.stats.hp;
    bot.currentHP = bot.stats.hp;

    return bot;
}

// Export to window
window.Battle = Battle;
window.generateBotPokemon = generateBotPokemon;
