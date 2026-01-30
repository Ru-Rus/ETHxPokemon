// Pokemon Class Definition
class Pokemon {
    constructor(name, hp, attack, defense) {
        this.name = name;
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
    }

    // Method to get Pokemon info as a string
    getInfo() {
        return `${this.name} - HP: ${this.hp}, ATK: ${this.attack}, DEF: ${this.defense}`;
    }

    // Method to calculate total stats
    getTotalStats() {
        return this.hp + this.attack + this.defense;
    }
}

// Array of Pokemon names for random generation
const pokemonNames = [
    'Pikachu', 'Charizard', 'Blastoise', 'Venusaur', 'Mewtwo',
    'Dragonite', 'Gyarados', 'Alakazam', 'Gengar', 'Machamp',
    'Lapras', 'Snorlax', 'Articuno', 'Zapdos', 'Moltres',
    'Eevee', 'Jigglypuff', 'Meowth', 'Psyduck', 'Bulbasaur',
    'Squirtle', 'Charmander', 'Raichu', 'Arcanine', 'Ninetales'
];

// Function to generate random Pokemon stats
function generateRandomStats() {
    return {
        hp: Math.floor(Math.random() * 100) + 50,        // HP: 50-149
        attack: Math.floor(Math.random() * 80) + 30,     // Attack: 30-109
        defense: Math.floor(Math.random() * 70) + 20     // Defense: 20-89
    };
}

// Function to get a random Pokemon name
function getRandomPokemonName() {
    const randomIndex = Math.floor(Math.random() * pokemonNames.length);
    return pokemonNames[randomIndex];
}

// Function to create a random Pokemon
function createRandomPokemon() {
    const name = getRandomPokemonName();
    const stats = generateRandomStats();
    return new Pokemon(name, stats.hp, stats.attack, stats.defense);
}

// Function to display Pokemon card in the DOM
function displayPokemonCard(pokemon) {
    const container = document.getElementById('pokemon-container');

    // Create card element
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    // Calculate stat percentages for progress bars (max stat is 150 for HP, 110 for ATK, 90 for DEF)
    const hpPercent = (pokemon.hp / 150) * 100;
    const attackPercent = (pokemon.attack / 110) * 100;
    const defensePercent = (pokemon.defense / 90) * 100;

    // Create card HTML
    card.innerHTML = `
        <h3>${pokemon.name}</h3>
        <div class="pokemon-stats">
            <div class="stat-row">
                <span class="stat-label">HP</span>
                <span class="stat-value">${pokemon.hp}</span>
            </div>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${hpPercent}%"></div>
            </div>

            <div class="stat-row">
                <span class="stat-label">Attack</span>
                <span class="stat-value">${pokemon.attack}</span>
            </div>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${attackPercent}%"></div>
            </div>

            <div class="stat-row">
                <span class="stat-label">Defense</span>
                <span class="stat-value">${pokemon.defense}</span>
            </div>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${defensePercent}%"></div>
            </div>
        </div>
    `;

    // Add card to container
    container.appendChild(card);

    // Add animation
    setTimeout(() => {
        card.style.animation = 'fadeIn 0.5s ease-in';
    }, 10);
}

// Function to generate and display a random Pokemon
function generateRandomPokemon() {
    const pokemon = createRandomPokemon();
    displayPokemonCard(pokemon);
    console.log('Generated Pokemon:', pokemon.getInfo());
}

// Function to clear all Pokemon cards
function clearPokemonCards() {
    const container = document.getElementById('pokemon-container');
    container.innerHTML = '';
}

// Generate initial Pokemon when page loads
window.addEventListener('DOMContentLoaded', () => {
    console.log('PokemonBTC Battle Game Loaded!');
    // Generate 3 starter Pokemon
    for (let i = 0; i < 3; i++) {
        generateRandomPokemon();
    }
});

// Add CSS animation for cards
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
