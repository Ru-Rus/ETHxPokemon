/**
 * Pokemon Class
 * Based on PokeChain stat calculation system
 * Includes battle stats and methods
 */
class Pokemon {
    constructor(pokemonData, level = 5) {
        this.id = pokemonData.id;
        this.name = pokemonData.name;
        this.types = pokemonData.types;
        this.baseStats = pokemonData.baseStats;
        this.sprite = pokemonData.sprite;
        this.moves = pokemonData.moves;
        this.level = level;

        // Generate random IV (Individual Values) 0-31
        this.iv = {
            hp: Math.floor(Math.random() * 32),
            attack: Math.floor(Math.random() * 32),
            defense: Math.floor(Math.random() * 32),
            speed: Math.floor(Math.random() * 32)
        };

        // Calculate actual stats using PokeChain formula
        this.stats = this.calculateStats();

        // Battle stats (current HP, etc.)
        this.currentHP = this.stats.hp;
        this.maxHP = this.stats.hp;
        this.fainted = false;
    }

    /**
     * Calculate stats using PokeChain formula
     * HP = (2 × baseStat + IV) × level / 100 + level + 10
     * Other Stats = ((2 × baseStat + IV) × level / 100) + 5
     */
    calculateStats() {
        const level = this.level;

        return {
            hp: Math.floor(((2 * this.baseStats.hp + this.iv.hp) * level / 100) + level + 10),
            attack: Math.floor(((2 * this.baseStats.attack + this.iv.attack) * level / 100) + 5),
            defense: Math.floor(((2 * this.baseStats.defense + this.iv.defense) * level / 100) + 5),
            speed: Math.floor(((2 * this.baseStats.speed + this.iv.speed) * level / 100) + 5)
        };
    }

    /**
     * Recalculate stats after level up
     */
    recalculateStats() {
        const oldMaxHP = this.maxHP;
        this.stats = this.calculateStats();
        this.maxHP = this.stats.hp;

        // Heal proportionally after level up
        const hpPercent = this.currentHP / oldMaxHP;
        this.currentHP = Math.floor(this.maxHP * hpPercent);
    }

    /**
     * Level up the Pokemon
     */
    levelUp() {
        this.level++;
        this.recalculateStats();
        console.log(`${this.name} leveled up to ${this.level}!`);
    }

    /**
     * Take damage
     * @param {number} damage - Amount of damage to take
     * @returns {number} Actual damage taken
     */
    takeDamage(damage) {
        const actualDamage = Math.min(damage, this.currentHP);
        this.currentHP -= actualDamage;

        if (this.currentHP <= 0) {
            this.currentHP = 0;
            this.fainted = true;
        }

        return actualDamage;
    }

    /**
     * Heal HP
     * @param {number} amount - Amount to heal
     * @returns {number} Actual amount healed
     */
    heal(amount) {
        const actualHeal = Math.min(amount, this.maxHP - this.currentHP);
        this.currentHP += actualHeal;
        return actualHeal;
    }

    /**
     * Restore to full HP
     */
    fullHeal() {
        this.currentHP = this.maxHP;
        this.fainted = false;
    }

    /**
     * Check if Pokemon has STAB (Same Type Attack Bonus)
     * @param {string} moveType - Type of the move
     * @returns {boolean}
     */
    hasSTAB(moveType) {
        return this.types.includes(moveType);
    }

    /**
     * Get a random move
     * @returns {object} Move object
     */
    getRandomMove() {
        return this.moves[Math.floor(Math.random() * this.moves.length)];
    }

    /**
     * Get Pokemon info as string
     * @returns {string}
     */
    getInfo() {
        return `${this.name} (Lv.${this.level}) - HP: ${this.currentHP}/${this.maxHP}, ATK: ${this.stats.attack}, DEF: ${this.stats.defense}, SPD: ${this.stats.speed}`;
    }

    /**
     * Get HP percentage
     * @returns {number} Percentage (0-100)
     */
    getHPPercent() {
        return (this.currentHP / this.maxHP) * 100;
    }

    /**
     * Get HP bar color based on percentage
     * @returns {string} Color code
     */
    getHPBarColor() {
        const percent = this.getHPPercent();
        if (percent > 50) return '#00ff00'; // Green
        if (percent > 25) return '#ffcc00'; // Yellow
        return '#ff0000'; // Red
    }

    /**
     * Check if Pokemon is alive
     * @returns {boolean}
     */
    isAlive() {
        return !this.fainted && this.currentHP > 0;
    }

    /**
     * Get total base stats
     * @returns {number}
     */
    getTotalBaseStats() {
        return this.baseStats.hp + this.baseStats.attack +
               this.baseStats.defense + this.baseStats.speed;
    }

    /**
     * Export Pokemon data for storage
     * @returns {object}
     */
    export() {
        return {
            id: this.id,
            level: this.level,
            iv: this.iv,
            currentHP: this.currentHP
        };
    }

    /**
     * Import Pokemon from stored data
     * @param {object} data - Stored Pokemon data
     * @param {object} pokemonData - Base Pokemon data from database
     * @returns {Pokemon}
     */
    static import(data, pokemonData) {
        const pokemon = new Pokemon(pokemonData, data.level);
        pokemon.iv = data.iv;
        pokemon.stats = pokemon.calculateStats();
        pokemon.maxHP = pokemon.stats.hp;
        pokemon.currentHP = data.currentHP;
        pokemon.fainted = pokemon.currentHP <= 0;
        return pokemon;
    }
}
