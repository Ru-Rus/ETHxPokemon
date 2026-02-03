/**
 * Tournament Bracket UI
 * Visual display of tournament bracket with match results
 */

const TournamentBracketUI = {
    /**
     * Show tournament bracket modal
     */
    showBracket(tournament) {
        const status = tournament.getStatus();
        const modal = this.createBracketModal(tournament, status);
        document.body.appendChild(modal);

        // Add close handler
        modal.querySelector('.bracket-close-btn')?.addEventListener('click', () => {
            modal.remove();
        });

        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    /**
     * Create bracket modal HTML
     */
    createBracketModal(tournament, status) {
        const modal = document.createElement('div');
        modal.className = 'tournament-bracket-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            overflow-y: auto;
            padding: 20px;
        `;

        const container = document.createElement('div');
        container.style.cssText = `
            background: linear-gradient(135deg, #1a1a1d 0%, #252527 100%);
            border: 3px solid #8B5CF6;
            border-radius: 20px;
            padding: 2rem;
            max-width: 1200px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        `;

        const isPlayerWinner = status.winner === tournament.playerPokemon;
        const isComplete = status.isComplete;

        container.innerHTML = `
            <button class="bracket-close-btn" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: #F44336;
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                font-size: 1.5rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">×</button>

            <div style="text-align: center; margin-bottom: 2rem;">
                <h2 style="font-size: 2.5rem; background: linear-gradient(135deg, #FFB900 0%, #EC4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem;">
                    🏆 Tournament Bracket
                </h2>
                ${isComplete ? `
                    <div style="font-size: 1.5rem; color: ${isPlayerWinner ? '#4CAF50' : '#F44336'}; font-weight: bold; margin-top: 1rem;">
                        ${isPlayerWinner ? '🎉 YOU WON THE TOURNAMENT! 🎉' : '❌ Tournament Complete'}
                    </div>
                    ${!isPlayerWinner && status.winner ? `
                        <div style="font-size: 1.2rem; color: #FFB900; margin-top: 0.5rem;">
                            Winner: ${status.winner.name}
                        </div>
                    ` : ''}
                ` : `
                    <div style="color: #8B5CF6; font-size: 1.2rem;">
                        ${status.roundName} - Match ${status.currentMatch}/${status.matchesInRound}
                    </div>
                `}
            </div>

            <div class="bracket-container" style="display: flex; justify-content: space-around; gap: 2rem; margin: 2rem 0;">
                ${this.createRoundColumn(tournament.bracket[0], 'Quarterfinals', 0)}
                ${this.createRoundColumn(tournament.bracket[1], 'Semifinals', 1)}
                ${this.createRoundColumn(tournament.bracket[2], 'Finals', 2)}
            </div>

            ${status.isComplete ? `
                <div style="text-align: center; margin-top: 2rem;">
                    <button onclick="this.closest('.tournament-bracket-modal').remove()" style="
                        background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
                        color: white;
                        border: none;
                        padding: 1rem 3rem;
                        border-radius: 15px;
                        font-size: 1.2rem;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.3s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        Close Bracket
                    </button>
                </div>
            ` : ''}
        `;

        modal.appendChild(container);
        return modal;
    },

    /**
     * Create a round column in the bracket
     */
    createRoundColumn(round, name, roundIndex) {
        if (!round || !round.matches || round.matches.length === 0) {
            return `
                <div class="bracket-round" style="flex: 1; display: flex; flex-direction: column; gap: 1rem;">
                    <div style="text-align: center; color: #FFB900; font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem;">
                        ${name}
                    </div>
                    <div style="color: #666; text-align: center; font-style: italic;">
                        Waiting for matches...
                    </div>
                </div>
            `;
        }

        const matchesHTML = round.matches.map((match, idx) => this.createMatchCard(match, idx, roundIndex)).join('');

        return `
            <div class="bracket-round" style="flex: 1; display: flex; flex-direction: column; gap: ${roundIndex * 2 + 1}rem;">
                <div style="text-align: center; color: #FFB900; font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem;">
                    ${name}
                </div>
                ${matchesHTML}
            </div>
        `;
    },

    /**
     * Create a match card
     */
    createMatchCard(match, matchIndex, roundIndex) {
        const hasWinner = match.winner !== null;
        const winner = match.winner;

        const player1Won = winner === match.player1;
        const player2Won = winner === match.player2;

        return `
            <div class="match-card" style="
                background: rgba(139, 92, 246, 0.15);
                border: 2px solid ${hasWinner ? '#4CAF50' : '#8B5CF6'};
                border-radius: 15px;
                padding: 1rem;
                transition: all 0.3s;
                ${!hasWinner ? 'animation: pulse 2s infinite;' : ''}
            ">
                <div style="text-align: center; color: #666; font-size: 0.8rem; margin-bottom: 0.5rem;">
                    Match ${matchIndex + 1}
                </div>

                <!-- Player 1 -->
                <div style="
                    background: ${player1Won ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.05)'};
                    border: 2px solid ${player1Won ? '#4CAF50' : '#444'};
                    border-radius: 10px;
                    padding: 0.8rem;
                    margin-bottom: 0.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    ${player1Won ? 'font-weight: bold;' : ''}
                ">
                    <span style="color: ${player1Won ? '#4CAF50' : '#fff'};">
                        ${match.player1.name}
                    </span>
                    ${player1Won ? '<span style="color: #4CAF50;">✓</span>' : ''}
                </div>

                <div style="text-align: center; color: #666; margin: 0.5rem 0;">vs</div>

                <!-- Player 2 -->
                <div style="
                    background: ${player2Won ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.05)'};
                    border: 2px solid ${player2Won ? '#4CAF50' : '#444'};
                    border-radius: 10px;
                    padding: 0.8rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    ${player2Won ? 'font-weight: bold;' : ''}
                ">
                    <span style="color: ${player2Won ? '#4CAF50' : '#fff'};">
                        ${match.player2.name}
                    </span>
                    ${player2Won ? '<span style="color: #4CAF50;">✓</span>' : ''}
                </div>

                ${hasWinner ? `
                    <div style="text-align: center; margin-top: 0.5rem; color: #4CAF50; font-weight: bold; font-size: 0.9rem;">
                        Winner: ${winner.name}
                    </div>
                ` : `
                    <div style="text-align: center; margin-top: 0.5rem; color: #FFB900; font-size: 0.8rem;">
                        In Progress...
                    </div>
                `}
            </div>
        `;
    }
};

// Add CSS animation for pulsing effect
if (!document.getElementById('tournament-bracket-styles')) {
    const style = document.createElement('style');
    style.id = 'tournament-bracket-styles';
    style.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        .bracket-container {
            scrollbar-width: thin;
            scrollbar-color: #8B5CF6 #1a1a1d;
        }

        .bracket-container::-webkit-scrollbar {
            height: 8px;
        }

        .bracket-container::-webkit-scrollbar-track {
            background: #1a1a1d;
        }

        .bracket-container::-webkit-scrollbar-thumb {
            background: #8B5CF6;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(style);
}

// Export to window
window.TournamentBracketUI = TournamentBracketUI;
