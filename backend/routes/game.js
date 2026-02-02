/**
 * Game Routes
 * Handles Pokemon operations, battles, faucet, etc.
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Game configuration
const GAME_CONFIG = {
    MINT_PRICE: 100,
    FAUCET_AMOUNT: 1000,
    FAUCET_COOLDOWN: 60000, // 1 minute
    LEVEL_UP_BASE_COST: 50,
    LEVEL_UP_MULTIPLIER: 1.5,
    SELL_BASE_PRICE: 50,
    SELL_LEVEL_MULTIPLIER: 20
};

/**
 * @route   GET /api/game/pokemon
 * @desc    Get user's owned Pokemon
 * @access  Private
 */
router.get('/pokemon', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        res.json({
            success: true,
            pokemon: user.ownedPokemon
        });
    } catch (error) {
        console.error('Get pokemon error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   POST /api/game/mint
 * @desc    Mint a Pokemon
 * @access  Private
 */
router.post('/mint', auth, async (req, res) => {
    try {
        const { pokemonId } = req.body;
        const user = await User.findById(req.userId);

        // Check if already owned
        if (user.ownedPokemon.some(p => p.pokemonId === pokemonId)) {
            return res.status(400).json({
                success: false,
                message: 'You already own this Pokemon'
            });
        }

        // Check balance
        if (user.balance < GAME_CONFIG.MINT_PRICE) {
            return res.status(400).json({
                success: false,
                message: `Insufficient balance. Need ${GAME_CONFIG.MINT_PRICE} PBTC`
            });
        }

        // Deduct balance and add Pokemon
        user.balance -= GAME_CONFIG.MINT_PRICE;
        user.ownedPokemon.push({
            pokemonId,
            level: 5,
            experience: 0
        });

        await user.save();

        res.json({
            success: true,
            message: 'Pokemon minted successfully',
            newBalance: user.balance,
            pokemon: user.ownedPokemon[user.ownedPokemon.length - 1]
        });
    } catch (error) {
        console.error('Mint error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   POST /api/game/sell
 * @desc    Sell a Pokemon
 * @access  Private
 */
router.post('/sell', auth, async (req, res) => {
    try {
        const { pokemonId } = req.body;
        const user = await User.findById(req.userId);

        // Find Pokemon
        const pokemonIndex = user.ownedPokemon.findIndex(p => p.pokemonId === pokemonId);
        if (pokemonIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Pokemon not found'
            });
        }

        const pokemon = user.ownedPokemon[pokemonIndex];
        const sellPrice = GAME_CONFIG.SELL_BASE_PRICE + (pokemon.level * GAME_CONFIG.SELL_LEVEL_MULTIPLIER);

        // Remove Pokemon and add balance
        user.ownedPokemon.splice(pokemonIndex, 1);
        user.balance += sellPrice;

        await user.save();

        res.json({
            success: true,
            message: 'Pokemon sold successfully',
            soldPrice: sellPrice,
            newBalance: user.balance
        });
    } catch (error) {
        console.error('Sell error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   POST /api/game/level-up
 * @desc    Level up a Pokemon
 * @access  Private
 */
router.post('/level-up', auth, async (req, res) => {
    try {
        const { pokemonId } = req.body;
        const user = await User.findById(req.userId);

        // Find Pokemon
        const pokemon = user.ownedPokemon.find(p => p.pokemonId === pokemonId);
        if (!pokemon) {
            return res.status(404).json({
                success: false,
                message: 'Pokemon not found'
            });
        }

        // Check max level
        if (pokemon.level >= 105) {
            return res.status(400).json({
                success: false,
                message: 'Pokemon is already at max level'
            });
        }

        // Calculate cost
        const cost = Math.floor(GAME_CONFIG.LEVEL_UP_BASE_COST * Math.pow(GAME_CONFIG.LEVEL_UP_MULTIPLIER, pokemon.level - 5));

        // Check balance
        if (user.balance < cost) {
            return res.status(400).json({
                success: false,
                message: `Insufficient balance. Need ${cost} PBTC`
            });
        }

        // Level up
        user.balance -= cost;
        pokemon.level++;

        await user.save();

        res.json({
            success: true,
            message: 'Pokemon leveled up successfully',
            newLevel: pokemon.level,
            cost,
            newBalance: user.balance
        });
    } catch (error) {
        console.error('Level up error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   POST /api/game/faucet
 * @desc    Claim faucet tokens
 * @access  Private
 */
router.post('/faucet', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        // Check cooldown
        if (user.lastFaucetClaim) {
            const timeSinceLastClaim = Date.now() - user.lastFaucetClaim.getTime();
            if (timeSinceLastClaim < GAME_CONFIG.FAUCET_COOLDOWN) {
                const timeRemaining = Math.ceil((GAME_CONFIG.FAUCET_COOLDOWN - timeSinceLastClaim) / 1000);
                return res.status(400).json({
                    success: false,
                    message: 'Faucet cooldown active',
                    timeRemaining
                });
            }
        }

        // Claim faucet
        user.balance += GAME_CONFIG.FAUCET_AMOUNT;
        user.lastFaucetClaim = new Date();

        await user.save();

        res.json({
            success: true,
            message: `Claimed ${GAME_CONFIG.FAUCET_AMOUNT} PBTC`,
            amount: GAME_CONFIG.FAUCET_AMOUNT,
            newBalance: user.balance
        });
    } catch (error) {
        console.error('Faucet error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   GET /api/game/faucet/status
 * @desc    Check faucet claim status
 * @access  Private
 */
router.get('/faucet/status', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        let canClaim = true;
        let timeRemaining = 0;

        if (user.lastFaucetClaim) {
            const timeSinceLastClaim = Date.now() - user.lastFaucetClaim.getTime();
            if (timeSinceLastClaim < GAME_CONFIG.FAUCET_COOLDOWN) {
                canClaim = false;
                timeRemaining = Math.ceil((GAME_CONFIG.FAUCET_COOLDOWN - timeSinceLastClaim) / 1000);
            }
        }

        res.json({
            success: true,
            canClaim,
            timeRemaining
        });
    } catch (error) {
        console.error('Faucet status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   POST /api/game/battle/result
 * @desc    Record battle result
 * @access  Private
 */
router.post('/battle/result', auth, async (req, res) => {
    try {
        const { difficulty, won } = req.body;
        const user = await User.findById(req.userId);

        // Validate difficulty
        if (!['easy', 'medium', 'hard'].includes(difficulty)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid difficulty'
            });
        }

        // Update battle stats
        if (won) {
            user.battleStats[difficulty].wins++;
        } else {
            user.battleStats[difficulty].losses++;
        }

        await user.save();

        res.json({
            success: true,
            message: 'Battle result recorded',
            battleStats: user.battleStats,
            totalWins: user.getTotalWins(),
            totalLosses: user.getTotalLosses(),
            winRate: user.getWinRate()
        });
    } catch (error) {
        console.error('Battle result error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   POST /api/game/reward
 * @desc    Add reward Pokemon
 * @access  Private
 */
router.post('/reward', auth, async (req, res) => {
    try {
        const { pokemonId, level } = req.body;
        const user = await User.findById(req.userId);

        // Check if already owned
        const alreadyOwned = user.ownedPokemon.some(p => p.pokemonId === pokemonId);

        if (!alreadyOwned) {
            user.ownedPokemon.push({
                pokemonId,
                level,
                experience: 0
            });

            await user.save();
        }

        res.json({
            success: true,
            alreadyOwned,
            pokemon: alreadyOwned ? null : user.ownedPokemon[user.ownedPokemon.length - 1]
        });
    } catch (error) {
        console.error('Reward error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   GET /api/game/balance
 * @desc    Get user balance
 * @access  Private
 */
router.get('/balance', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        res.json({
            success: true,
            balance: user.balance
        });
    } catch (error) {
        console.error('Get balance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   GET /api/game/stats
 * @desc    Get user game statistics
 * @access  Private
 */
router.get('/stats', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        res.json({
            success: true,
            stats: {
                balance: user.balance,
                totalPokemon: user.ownedPokemon.length,
                battleStats: user.battleStats,
                totalWins: user.getTotalWins(),
                totalLosses: user.getTotalLosses(),
                winRate: user.getWinRate()
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
