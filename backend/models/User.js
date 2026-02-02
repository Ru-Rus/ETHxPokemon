/**
 * User Model
 * Stores user authentication and game data
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const pokemonSchema = new mongoose.Schema({
    pokemonId: {
        type: Number,
        required: true
    },
    level: {
        type: Number,
        default: 5
    },
    experience: {
        type: Number,
        default: 0
    },
    mintedAt: {
        type: Date,
        default: Date.now
    }
});

const battleStatsSchema = new mongoose.Schema({
    easy: {
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 }
    },
    medium: {
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 }
    },
    hard: {
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 }
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    balance: {
        type: Number,
        default: 1000 // Starting balance
    },
    ownedPokemon: [pokemonSchema],
    battleStats: {
        type: battleStatsSchema,
        default: () => ({
            easy: { wins: 0, losses: 0 },
            medium: { wins: 0, losses: 0 },
            hard: { wins: 0, losses: 0 }
        })
    },
    lastFaucetClaim: {
        type: Date,
        default: null
    },
    availablePokemonToday: {
        type: [Number],
        default: []
    },
    lastPokemonRefresh: {
        type: String, // Date string in YYYY-MM-DD format
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get total wins
userSchema.methods.getTotalWins = function() {
    return this.battleStats.easy.wins +
           this.battleStats.medium.wins +
           this.battleStats.hard.wins;
};

// Method to get total losses
userSchema.methods.getTotalLosses = function() {
    return this.battleStats.easy.losses +
           this.battleStats.medium.losses +
           this.battleStats.hard.losses;
};

// Method to get win rate
userSchema.methods.getWinRate = function() {
    const totalGames = this.getTotalWins() + this.getTotalLosses();
    if (totalGames === 0) return 0;
    return ((this.getTotalWins() / totalGames) * 100).toFixed(2);
};

module.exports = mongoose.model('User', userSchema);
