/**
 * Web3 Integration for PokemonBTC
 * Handles wallet connection and smart contract interactions
 * Based on PokeChain and Pokemon-Blockchain implementations
 */

// Check if ethers is loaded
if (typeof ethers === 'undefined') {
    console.error('Ethers library not loaded! Make sure the ethers script is included before web3.js');
}

// Contract addresses - loaded from config.js
const CONTRACT_ADDRESSES = window.APP_CONFIG?.CONTRACTS || {
    token: '0xD646B8F82C95Cf49B48F742dbB128Ecaba642ECd', // PokemonToken address
    nft: '0x3c771Bcc5339b9d5b4EC425722Ec67D41A73A2EB'    // PokemonNFT address
};




// Contract ABIs (simplified - include only functions we use)
const TOKEN_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function faucetMint() external",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function canClaimFaucet(address user) view returns (bool, uint256)",
    "function getFaucetInfo(address user) view returns (uint256, bool, uint256)"
];

const NFT_ABI = [
    "function mintWithToken(uint256 pokemonId) external",
    "function tokensOfOwner(address owner) view returns (uint256[])",
    "function getPokemonId(uint256 tokenId) view returns (uint256)",
    "function hasMintedPokemon(address user, uint256 pokemonId) view returns (bool)",
    "function balanceOf(address owner) view returns (uint256)",
    "function totalSupply() view returns (uint256)",
    "function tokenURI(uint256 tokenId) view returns (string)"
];

// Global state
let provider = null;
let signer = null;
let userAddress = null;
let tokenContract = null;
let nftContract = null;
let isConnected = false;

/**
 * Check if MetaMask is installed
 * @returns {boolean}
 */
function isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined';
}

/**
 * Connect to MetaMask wallet
 * @returns {Promise<string>} User address
 */
async function connectWallet() {
    if (typeof ethers === 'undefined') {
        throw new Error('Ethers library not loaded');
    }

    if (!isMetaMaskInstalled()) {
        alert('Please install MetaMask to use this feature!\nVisit: https://metamask.io');
        throw new Error('MetaMask not installed');
    }

    try {
        // Request account access
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        userAddress = accounts[0];

        // Check if on correct network
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const expectedChainId = '0x' + APP_CONFIG.NETWORK.chainId.toString(16);
        
        if (chainId !== expectedChainId) {
            try {
                // Try to switch to Sepolia
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: expectedChainId }],
                });
                console.log('Switched to Sepolia network');
            } catch (switchError) {
                // If network doesn't exist, add it
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: expectedChainId,
                                chainName: APP_CONFIG.NETWORK.name,
                                rpcUrls: [APP_CONFIG.NETWORK.rpcUrl],
                                nativeCurrency: {
                                    name: 'SepoliaETH',
                                    symbol: 'ETH',
                                    decimals: 18
                                },
                                blockExplorerUrls: ['https://sepolia.etherscan.io/']
                            }],
                        });
                        console.log('Added Sepolia network');
                    } catch (addError) {
                        alert('Please switch to Sepolia testnet in MetaMask');
                        throw new Error('Please switch to Sepolia testnet');
                    }
                } else {
                    alert('Please switch to Sepolia testnet in MetaMask');
                    throw new Error('Please switch to Sepolia testnet');
                }
            }
        }

        // Initialize ethers provider
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();

        // Initialize contracts
        tokenContract = new ethers.Contract(CONTRACT_ADDRESSES.token, TOKEN_ABI, signer);
        nftContract = new ethers.Contract(CONTRACT_ADDRESSES.nft, NFT_ABI, signer);

        isConnected = true;

        console.log('Connected to wallet:', userAddress);

        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return userAddress;
    } catch (error) {
        console.error('Error connecting wallet:', error);
        throw error;
    }
}

/**
 * Disconnect wallet
 */
function disconnectWallet() {
    provider = null;
    signer = null;
    userAddress = null;
    tokenContract = null;
    nftContract = null;
    isConnected = false;

    // Remove listeners
    if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
}

/**
 * Handle account changes
 */
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        disconnectWallet();
        location.reload();
    } else if (accounts[0] !== userAddress) {
        location.reload();
    }
}

/**
 * Handle chain changes
 */
function handleChainChanged() {
    location.reload();
}

/**
 * Get user's token balance
 * @returns {Promise<string>} Balance in PBTC
 */
async function getTokenBalance() {
    if (!isConnected || !tokenContract) {
        throw new Error('Wallet not connected');
    }

    try {
        const balance = await tokenContract.balanceOf(userAddress);
        return ethers.formatEther(balance);
    } catch (error) {
        console.error('Error getting token balance:', error);
        throw error;
    }
}

/**
 * Claim tokens from faucet
 * @returns {Promise<object>} Transaction receipt
 */
async function claimFaucet() {
    if (!isConnected || !tokenContract) {
        throw new Error('Wallet not connected');
    }

    try {
        const tx = await tokenContract.faucetMint();
        console.log('Faucet claim transaction sent:', tx.hash);

        const receipt = await tx.wait();
        console.log('Faucet claim confirmed:', receipt);

        return receipt;
    } catch (error) {
        console.error('Error claiming faucet:', error);
        throw error;
    }
}

/**
 * Check if user can claim from faucet
 * @returns {Promise<object>} {canClaim: boolean, timeRemaining: number}
 */
async function checkFaucetStatus() {
    if (!isConnected || !tokenContract) {
        throw new Error('Wallet not connected');
    }

    try {
        const [balance, canClaim, cooldown] = await tokenContract.getFaucetInfo(userAddress);

        return {
            balance: ethers.formatEther(balance),
            canClaim: canClaim,
            cooldownSeconds: Number(cooldown)
        };
    } catch (error) {
        console.error('Error checking faucet status:', error);
        throw error;
    }
}

/**
 * Mint a Pokemon NFT
 * @param {number} pokemonId - Pokemon ID to mint (1-151)
 * @returns {Promise<object>} Transaction receipt
 */
async function mintPokemon(pokemonId) {
    if (!isConnected || !nftContract || !tokenContract) {
        throw new Error('Wallet not connected');
    }

    try {
        // Check if already minted
        const alreadyMinted = await nftContract.hasMintedPokemon(userAddress, pokemonId);
        if (alreadyMinted) {
            throw new Error('You have already minted this Pokemon!');
        }

        // Check token balance
        const balance = await tokenContract.balanceOf(userAddress);
        const mintPrice = ethers.parseEther('100'); // 100 PBTC

        if (balance < mintPrice) {
            throw new Error('Insufficient PBTC tokens. Claim from faucet first!');
        }

        // Check and approve tokens if needed
        const allowance = await tokenContract.allowance(userAddress, CONTRACT_ADDRESSES.nft);
        if (allowance < mintPrice) {
            console.log('Approving tokens...');
            const approveTx = await tokenContract.approve(CONTRACT_ADDRESSES.nft, mintPrice);
            await approveTx.wait();
            console.log('Token approval confirmed');
        }

        // Mint NFT
        console.log(`Minting Pokemon #${pokemonId}...`);
        const tx = await nftContract.mintWithToken(pokemonId);
        console.log('Mint transaction sent:', tx.hash);

        const receipt = await tx.wait();
        console.log('Mint confirmed:', receipt);

        return receipt;
    } catch (error) {
        console.error('Error minting Pokemon:', error);
        throw error;
    }
}

/**
 * Get user's owned Pokemon NFTs
 * @returns {Promise<array>} Array of {tokenId, pokemonId}
 */
async function getOwnedPokemon() {
    if (!isConnected || !nftContract) {
        throw new Error('Wallet not connected');
    }

    try {
        const tokenIds = await nftContract.tokensOfOwner(userAddress);
        const owned = [];

        for (let tokenId of tokenIds) {
            const pokemonId = await nftContract.getPokemonId(tokenId);
            owned.push({
                tokenId: Number(tokenId),
                pokemonId: Number(pokemonId)
            });
        }

        return owned;
    } catch (error) {
        console.error('Error getting owned Pokemon:', error);
        throw error;
    }
}

/**
 * Check if user has minted a specific Pokemon
 * @param {number} pokemonId - Pokemon ID to check
 * @returns {Promise<boolean>}
 */
async function hasMintedPokemon(pokemonId) {
    if (!isConnected || !nftContract) {
        return false;
    }

    try {
        return await nftContract.hasMintedPokemon(userAddress, pokemonId);
    } catch (error) {
        console.error('Error checking minted status:', error);
        return false;
    }
}

/**
 * Get total NFTs minted
 * @returns {Promise<number>}
 */
async function getTotalSupply() {
    if (!nftContract) {
        throw new Error('Contract not initialized');
    }

    try {
        const supply = await nftContract.totalSupply();
        return Number(supply);
    } catch (error) {
        console.error('Error getting total supply:', error);
        throw error;
    }
}

/**
 * Get user's NFT token IDs
 * @returns {Promise<Array<number>>} Array of token IDs
 */
async function getUserNFTs() {
    if (!nftContract || !userAddress) {
        throw new Error('Contract not initialized or wallet not connected');
    }

    try {
        const tokenIds = await nftContract.tokensOfOwner(userAddress);
        return tokenIds.map(id => Number(id));
    } catch (error) {
        console.error('Error getting user NFTs:', error);
        throw error;
    }
}

/**
 * Get Pokemon ID from token ID
 * @param {number} tokenId - NFT token ID
 * @returns {Promise<number>} Pokemon ID
 */
async function getPokemonIdFromToken(tokenId) {
    if (!nftContract) {
        throw new Error('Contract not initialized');
    }

    try {
        const pokemonId = await nftContract.getPokemonId(tokenId);
        return Number(pokemonId);
    } catch (error) {
        console.error('Error getting Pokemon ID from token:', error);
        throw error;
    }
}

/**
 * Format address for display
 * @param {string} address - Ethereum address
 * @returns {string} Formatted address (0x1234...5678)
 */
function formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format time remaining
 * @param {number} seconds - Seconds remaining
 * @returns {string} Formatted time (1h 30m)
 */
function formatTimeRemaining(seconds) {
    if (seconds <= 0) return 'Available now';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

// Export functions for global use
try {
    window.web3Utils = {
        isMetaMaskInstalled,
        connectWallet,
        disconnectWallet,
        getTokenBalance,
        claimFaucet,
        checkFaucetStatus,
        mintPokemon,
        getOwnedPokemon,
        hasMintedPokemon,
        getTotalSupply,
        getUserNFTs,
        getPokemonIdFromToken,
        formatAddress,
        formatTimeRemaining,
        get isConnected() { return isConnected; },
        get userAddress() { return userAddress; }
    };
    console.log('web3Utils loaded successfully');
} catch (error) {
    console.error('Error loading web3Utils:', error);
}
