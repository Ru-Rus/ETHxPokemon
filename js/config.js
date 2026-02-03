/**
 * Application Configuration
 *
 * Change MODE to switch between local storage and blockchain
 */

const APP_CONFIG = {
    // MODE OPTIONS:
    // - 'local': Use browser localStorage (no blockchain, no MetaMask needed)
    // - 'blockchain': Use Sepolia testnet with MetaMask and smart contracts
    MODE: 'local',  // ← CHANGE THIS TO 'blockchain' when ready!

    // Contract addresses (only used in blockchain mode)
    CONTRACTS: {
        token: '0xd9145CCE52D386f254917e481eB44e9943F39138',
        nft: '0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8'
    },

    // Network configuration
    NETWORK: {
        chainId: 11155111, // Sepolia
        name: 'Sepolia',
        rpcUrl: 'https://rpc.sepolia.org'
    }
};

// Don't edit below this line
window.APP_CONFIG = APP_CONFIG;
