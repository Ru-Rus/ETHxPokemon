// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PokemonNFT
 * @dev ERC721 NFT contract for minting Pokemon
 * Based on pokemon-blockchain repo minting system
 */
contract PokemonNFT is ERC721, Ownable {
    // State variables
    uint256 public totalSupply;
    uint256 public constant MAX_SUPPLY = 151; // Gen 1 Pokemon limit
    uint256 public constant MINT_PRICE = 100 * 10**18; // 100 tokens

    IERC20 public pokemonToken;

    // Mapping from token ID to Pokemon ID (1-151)
    mapping(uint256 => uint256) public tokenToPokemonId;

    // Mapping to track which Pokemon IDs have been minted by user
    mapping(address => mapping(uint256 => bool)) public userMintedPokemon;

    // Events
    event PokemonMinted(address indexed owner, uint256 tokenId, uint256 pokemonId);
    event TokenAddressUpdated(address indexed newToken);

    constructor(address _tokenAddress) ERC721("PokemonBTC", "PBTC") Ownable(msg.sender) {
        pokemonToken = IERC20(_tokenAddress);
    }

    /**
     * @dev Mint a Pokemon NFT by paying with tokens
     * @param pokemonId The Pokemon ID to mint (1-151)
     */
    function mintWithToken(uint256 pokemonId) external {
        require(pokemonId >= 1 && pokemonId <= 151, "Invalid Pokemon ID");
        require(totalSupply < MAX_SUPPLY, "Max supply reached");
        require(!userMintedPokemon[msg.sender][pokemonId], "Already minted this Pokemon");

        // Transfer tokens from user to contract
        require(
            pokemonToken.transferFrom(msg.sender, address(this), MINT_PRICE),
            "Token transfer failed"
        );

        totalSupply++;
        uint256 tokenId = totalSupply;

        _safeMint(msg.sender, tokenId);
        tokenToPokemonId[tokenId] = pokemonId;
        userMintedPokemon[msg.sender][pokemonId] = true;

        emit PokemonMinted(msg.sender, tokenId, pokemonId);
    }

    /**
     * @dev Owner can mint Pokemon for free (giveaways/airdrops)
     * @param to Address to mint to
     * @param pokemonId The Pokemon ID to mint
     */
    function ownerMint(address to, uint256 pokemonId) external onlyOwner {
        require(pokemonId >= 1 && pokemonId <= 151, "Invalid Pokemon ID");
        require(totalSupply < MAX_SUPPLY, "Max supply reached");

        totalSupply++;
        uint256 tokenId = totalSupply;

        _safeMint(to, tokenId);
        tokenToPokemonId[tokenId] = pokemonId;
        userMintedPokemon[to][pokemonId] = true;

        emit PokemonMinted(to, tokenId, pokemonId);
    }

    /**
     * @dev Get all token IDs owned by an address
     * @param owner Address to check
     * @return Array of token IDs
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        uint256 index = 0;

        for (uint256 i = 1; i <= totalSupply; i++) {
            if (ownerOf(i) == owner) {
                tokens[index] = i;
                index++;
            }
        }

        return tokens;
    }

    /**
     * @dev Get Pokemon ID from token ID
     * @param tokenId The NFT token ID
     * @return The Pokemon ID (1-151)
     */
    function getPokemonId(uint256 tokenId) external view returns (uint256) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenToPokemonId[tokenId];
    }

    /**
     * @dev Check if user has minted a specific Pokemon
     * @param user Address to check
     * @param pokemonId Pokemon ID to check
     * @return Boolean if minted
     */
    function hasMintedPokemon(address user, uint256 pokemonId) external view returns (bool) {
        return userMintedPokemon[user][pokemonId];
    }

    /**
     * @dev Update token address (emergency only)
     * @param newToken New token contract address
     */
    function updateTokenAddress(address newToken) external onlyOwner {
        pokemonToken = IERC20(newToken);
        emit TokenAddressUpdated(newToken);
    }

    /**
     * @dev Withdraw accumulated tokens (owner only)
     */
    function withdrawTokens() external onlyOwner {
        uint256 balance = pokemonToken.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        pokemonToken.transfer(owner(), balance);
    }

    /**
     * @dev Override tokenURI to return PokeAPI image
     * @param tokenId The NFT token ID
     * @return URI string
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        uint256 pokemonId = tokenToPokemonId[tokenId];

        // Return PokeAPI URL for Pokemon sprite
        return string(abi.encodePacked(
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/",
            uint2str(pokemonId),
            ".png"
        ));
    }

    /**
     * @dev Helper function to convert uint to string
     */
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
