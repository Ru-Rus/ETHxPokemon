/**
 * Application Configuration
 *
 * Change MODE to switch between local storage and blockchain
 */

const APP_CONFIG = {
    // MODE OPTIONS:
    // - 'local': Use browser localStorage (no blockchain, no MetaMask needed)
    // - 'blockchain': Use Sepolia testnet with MetaMask and smart contracts
    MODE: 'blockchain',  // ← CHANGE THIS TO 'blockchain' when ready!

    // Contract addresses (only used in blockchain mode)
    CONTRACTS: {
        token: '0xD646B8F82C95Cf49B48F742dbB128Ecaba642ECd',  // Replace with deployed PokemonToken address
        nft: '0x69d6F6eC74c4F8D04Ff7447Eb8E35529bae66808'        // Replace with deployed PokemonNFT address
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
