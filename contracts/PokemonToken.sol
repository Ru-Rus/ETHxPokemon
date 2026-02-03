// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PokemonToken (PBTC)
 * @dev ERC20 utility token for PokemonBTC game
 * Based on pokemon-blockchain FaucetToken system
 */
contract PokemonToken is ERC20, Ownable {
    // Faucet configuration
    uint256 public constant FAUCET_AMOUNT = 1000 * 10**18; // 1000 tokens
    uint256 public constant FAUCET_LIMIT = 10000 * 10**18; // 10,000 tokens max

    // Track last faucet claim time per user (cooldown)
    mapping(address => uint256) public lastFaucetClaim;
    uint256 public constant FAUCET_COOLDOWN = 24 hours;

    // Events
    event FaucetClaimed(address indexed user, uint256 amount);
    event TokensMinted(address indexed to, uint256 amount);

    constructor() ERC20("PokemonBTC Token", "PBTC") Ownable(msg.sender) {
        // Mint initial supply to owner (1,000,000 tokens)
        _mint(msg.sender, 1_000_000 * 10**18);
    }

    /**
     * @dev Faucet function - users can claim free tokens
     * Users with less than 10,000 tokens can claim 1,000 tokens
     * 24-hour cooldown between claims
     */
    function faucetMint() external {
        require(balanceOf(msg.sender) < FAUCET_LIMIT, "Balance exceeds faucet limit");
        require(
            block.timestamp >= lastFaucetClaim[msg.sender] + FAUCET_COOLDOWN,
            "Faucet cooldown active"
        );

        lastFaucetClaim[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);

        emit FaucetClaimed(msg.sender, FAUCET_AMOUNT);
    }

    /**
     * @dev Owner can mint additional tokens if needed
     * @param to Address to mint to
     * @param amount Amount to mint
     */
    function ownerMint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev Check if user can claim from faucet
     * @param user Address to check
     * @return canClaim Boolean if user can claim
     * @return timeUntilNextClaim Seconds until next claim available
     */
    function canClaimFaucet(address user) external view returns (bool canClaim, uint256 timeUntilNextClaim) {
        if (balanceOf(user) >= FAUCET_LIMIT) {
            return (false, 0);
        }

        uint256 nextClaimTime = lastFaucetClaim[user] + FAUCET_COOLDOWN;
        if (block.timestamp >= nextClaimTime) {
            return (true, 0);
        } else {
            return (false, nextClaimTime - block.timestamp);
        }
    }

    /**
     * @dev Get faucet info for display
     * @param user Address to check
     * @return balance Current balance
     * @return canClaim Can user claim now
     * @return cooldownRemaining Seconds until next claim
     */
    function getFaucetInfo(address user) external view returns (
        uint256 balance,
        bool canClaim,
        uint256 cooldownRemaining
    ) {
        balance = balanceOf(user);

        if (balance >= FAUCET_LIMIT) {
            canClaim = false;
            cooldownRemaining = 0;
        } else {
            uint256 nextClaimTime = lastFaucetClaim[user] + FAUCET_COOLDOWN;
            if (block.timestamp >= nextClaimTime) {
                canClaim = true;
                cooldownRemaining = 0;
            } else {
                canClaim = false;
                cooldownRemaining = nextClaimTime - block.timestamp;
            }
        }
    }
}
