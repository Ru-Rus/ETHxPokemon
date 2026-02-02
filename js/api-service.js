/**
 * API Service
 * Handles all API calls to the backend
 */

const API_BASE_URL = 'http://localhost:5000/api';

class APIService {
    constructor() {
        this.token = localStorage.getItem('auth_token');
    }

    /**
     * Set authentication token
     */
    setToken(token) {
        this.token = token;
        localStorage.setItem('auth_token', token);
    }

    /**
     * Clear authentication token
     */
    clearToken() {
        this.token = null;
        localStorage.removeItem('auth_token');
    }

    /**
     * Get authentication headers
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    /**
     * Make API request
     */
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            ...options,
            headers: this.getHeaders()
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ============ AUTH ENDPOINTS ============

    /**
     * Register new user
     */
    async register(username, password) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        if (data.success) {
            this.setToken(data.token);
        }

        return data;
    }

    /**
     * Login user
     */
    async login(username, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        if (data.success) {
            this.setToken(data.token);
        }

        return data;
    }

    /**
     * Get current user info
     */
    async getCurrentUser() {
        return await this.request('/auth/me');
    }

    /**
     * Logout user
     */
    logout() {
        this.clearToken();
        window.location.href = 'login.html';
    }

    // ============ GAME ENDPOINTS ============

    /**
     * Get owned Pokemon
     */
    async getOwnedPokemon() {
        return await this.request('/game/pokemon');
    }

    /**
     * Mint Pokemon
     */
    async mintPokemon(pokemonId) {
        return await this.request('/game/mint', {
            method: 'POST',
            body: JSON.stringify({ pokemonId })
        });
    }

    /**
     * Sell Pokemon
     */
    async sellPokemon(pokemonId) {
        return await this.request('/game/sell', {
            method: 'POST',
            body: JSON.stringify({ pokemonId })
        });
    }

    /**
     * Level up Pokemon
     */
    async levelUpPokemon(pokemonId) {
        return await this.request('/game/level-up', {
            method: 'POST',
            body: JSON.stringify({ pokemonId })
        });
    }

    /**
     * Claim faucet
     */
    async claimFaucet() {
        return await this.request('/game/faucet', {
            method: 'POST'
        });
    }

    /**
     * Get faucet status
     */
    async getFaucetStatus() {
        return await this.request('/game/faucet/status');
    }

    /**
     * Record battle result
     */
    async recordBattleResult(difficulty, won) {
        return await this.request('/game/battle/result', {
            method: 'POST',
            body: JSON.stringify({ difficulty, won })
        });
    }

    /**
     * Add reward Pokemon
     */
    async addRewardPokemon(pokemonId, level) {
        return await this.request('/game/reward', {
            method: 'POST',
            body: JSON.stringify({ pokemonId, level })
        });
    }

    /**
     * Get balance
     */
    async getBalance() {
        return await this.request('/game/balance');
    }

    /**
     * Get game stats
     */
    async getStats() {
        return await this.request('/game/stats');
    }

    // ============ HELPER METHODS ============

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.token;
    }

    /**
     * Redirect to login if not authenticated
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
}

// Export singleton instance
window.apiService = new APIService();
