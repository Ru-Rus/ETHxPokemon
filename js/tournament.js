/**
 * Tournament Bracket System
 * Single-elimination tournament with 8 opponents
 */

class Tournament {
    constructor(playerPokemon, difficulty) {
        this.playerPokemon = playerPokemon;
        this.difficulty = difficulty;
        this.currentRound = 0;
        this.currentMatch = 0;
        this.bracket = [];
        this.matchHistory = [];
        this.isComplete = false;
        this.winner = null;

        this.setupBracket();
    }

    /**
     * Setup tournament bracket
     * 8 total participants: 1 player + 7 bots
     */
    setupBracket() {
        // Generate 7 bot opponents
        const bots = [];
        for (let i = 0; i < 7; i++) {
            bots.push(generateBotPokemon(this.difficulty));
        }

        // Round 1: Quarterfinals (8 → 4)
        this.bracket.push({
            round: 1,
            name: 'Quarterfinals',
            matches: [
                { player1: this.playerPokemon, player2: bots[0], winner: null },
                { player1: bots[1], player2: bots[2], winner: null },
                { player1: bots[3], player2: bots[4], winner: null },
                { player1: bots[5], player2: bots[6], winner: null }
            ]
        });

        // Rounds 2 and 3 will be populated as matches complete
        this.bracket.push({
            round: 2,
            name: 'Semifinals',
            matches: []
        });

        this.bracket.push({
            round: 3,
            name: 'Finals',
            matches: []
        });
    }

    /**
     * Get current match
     */
    getCurrentMatch() {
        if (this.isComplete) return null;

        const round = this.bracket[this.currentRound];
        if (!round || this.currentMatch >= round.matches.length) {
            return null;
        }

        return round.matches[this.currentMatch];
    }

    /**
     * Record match result
     */
    recordMatchResult(winner) {
        const match = this.getCurrentMatch();
        if (!match) return;

        match.winner = winner;
        this.matchHistory.push({
            round: this.currentRound + 1,
            match: this.currentMatch + 1,
            player1: match.player1.name,
            player2: match.player2.name,
            winner: winner.name
        });

        // Move to next match
        this.currentMatch++;

        // Check if round is complete
        if (this.currentMatch >= this.bracket[this.currentRound].matches.length) {
            this.advanceRound();
        }
    }

    /**
     * Advance to next round
     */
    advanceRound() {
        const currentRound = this.bracket[this.currentRound];

        // Collect winners
        const winners = currentRound.matches.map(m => m.winner).filter(w => w !== null);

        if (winners.length < currentRound.matches.length) {
            // Not all matches complete
            return;
        }

        // Check if player lost
        if (!winners.includes(this.playerPokemon)) {
            this.isComplete = true;
            this.winner = null; // Player lost
            return;
        }

        // Move to next round
        this.currentRound++;
        this.currentMatch = 0;

        if (this.currentRound >= this.bracket.length) {
            // Tournament complete - player won!
            this.isComplete = true;
            this.winner = this.playerPokemon;
            return;
        }

        // Setup next round matches
        const nextRound = this.bracket[this.currentRound];
        nextRound.matches = [];

        for (let i = 0; i < winners.length; i += 2) {
            nextRound.matches.push({
                player1: winners[i],
                player2: winners[i + 1],
                winner: null
            });
        }
    }

    /**
     * Check if player is in current match
     */
    isPlayerMatch() {
        const match = this.getCurrentMatch();
        if (!match) return false;

        return match.player1 === this.playerPokemon || match.player2 === this.playerPokemon;
    }

    /**
     * Simulate bot vs bot match
     */
    simulateBotMatch(match) {
        // Simple simulation - random winner with slight bias toward higher stats
        const p1Power = match.player1.stats.attack + match.player1.stats.hp;
        const p2Power = match.player2.stats.attack + match.player2.stats.hp;

        const p1Chance = p1Power / (p1Power + p2Power);
        const winner = Math.random() < p1Chance ? match.player1 : match.player2;

        return winner;
    }

    /**
     * Get tournament status
     */
    getStatus() {
        return {
            currentRound: this.currentRound + 1,
            roundName: this.bracket[this.currentRound]?.name || 'Complete',
            totalRounds: this.bracket.length,
            matchesInRound: this.bracket[this.currentRound]?.matches.length || 0,
            currentMatch: this.currentMatch + 1,
            isComplete: this.isComplete,
            winner: this.winner,
            bracket: this.bracket,
            history: this.matchHistory
        };
    }

    /**
     * Get bracket display data
     */
    getBracketDisplay() {
        return this.bracket.map(round => ({
            name: round.name,
            matches: round.matches.map(m => ({
                player1: m.player1.name,
                player2: m.player2.name,
                winner: m.winner ? m.winner.name : 'TBD'
            }))
        }));
    }
}

// Export to window
window.Tournament = Tournament;
