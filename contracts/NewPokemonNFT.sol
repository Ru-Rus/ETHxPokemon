// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PokemonNFT
 * @dev ERC721 NFT contract for minting Pokemon
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
     * @dev Owner can mint Pokemon for free
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
     */
    function getPokemonId(uint256 tokenId) external view returns (uint256) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenToPokemonId[tokenId];
    }

    /**
     * @dev Check if user has minted a specific Pokemon
     */
    function hasMintedPokemon(address user, uint256 pokemonId) external view returns (bool) {
        return userMintedPokemon[user][pokemonId];
    }

    /**
     * @dev Update token address
     */
    function updateTokenAddress(address newToken) external onlyOwner {
        pokemonToken = IERC20(newToken);
        emit TokenAddressUpdated(newToken);
    }

    /**
     * @dev Withdraw accumulated tokens
     */
    function withdrawTokens() external onlyOwner {
        uint256 balance = pokemonToken.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        pokemonToken.transfer(owner(), balance);
    }

    /**
     * @dev Override tokenURI to return JSON metadata
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        uint256 pokemonId = tokenToPokemonId[tokenId];

        // Get Pokemon name
        string memory pokemonName = getPokemonName(pokemonId);

        // Return JSON metadata
        return string(abi.encodePacked(
            '{"name":"', pokemonName, '","description":"PokemonBTC NFT","image":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/',
            uint2str(pokemonId),
            '.png"}'
        ));
    }

    /**
     * @dev Get Pokemon name by ID
     */
    function getPokemonName(uint256 pokemonId) internal pure returns (string memory) {
        if (pokemonId == 1) return "Bulbasaur";
        if (pokemonId == 2) return "Ivysaur";
        if (pokemonId == 3) return "Venusaur";
        if (pokemonId == 4) return "Charmander";
        if (pokemonId == 5) return "Charmeleon";
        if (pokemonId == 6) return "Charizard";
        if (pokemonId == 7) return "Squirtle";
        if (pokemonId == 8) return "Wartortle";
        if (pokemonId == 9) return "Blastoise";
        if (pokemonId == 10) return "Caterpie";
        if (pokemonId == 11) return "Metapod";
        if (pokemonId == 12) return "Butterfree";
        if (pokemonId == 13) return "Weedle";
        if (pokemonId == 14) return "Kakuna";
        if (pokemonId == 15) return "Beedrill";
        if (pokemonId == 16) return "Pidgey";
        if (pokemonId == 17) return "Pidgeotto";
        if (pokemonId == 18) return "Pidgeot";
        if (pokemonId == 19) return "Rattata";
        if (pokemonId == 20) return "Raticate";
        if (pokemonId == 21) return "Spearow";
        if (pokemonId == 22) return "Fearow";
        if (pokemonId == 23) return "Ekans";
        if (pokemonId == 24) return "Arbok";
        if (pokemonId == 25) return "Pikachu";
        if (pokemonId == 26) return "Raichu";
        if (pokemonId == 27) return "Sandshrew";
        if (pokemonId == 28) return "Sandslash";
        if (pokemonId == 29) return "Nidoran♀";
        if (pokemonId == 30) return "Nidorina";
        if (pokemonId == 31) return "Nidoqueen";
        if (pokemonId == 32) return "Nidoran♂";
        if (pokemonId == 33) return "Nidorino";
        if (pokemonId == 34) return "Nidoking";
        if (pokemonId == 35) return "Clefairy";
        if (pokemonId == 36) return "Clefable";
        if (pokemonId == 37) return "Vulpix";
        if (pokemonId == 38) return "Ninetales";
        if (pokemonId == 39) return "Jigglypuff";
        if (pokemonId == 40) return "Wigglytuff";
        if (pokemonId == 41) return "Zubat";
        if (pokemonId == 42) return "Golbat";
        if (pokemonId == 43) return "Oddish";
        if (pokemonId == 44) return "Gloom";
        if (pokemonId == 45) return "Vileplume";
        if (pokemonId == 46) return "Paras";
        if (pokemonId == 47) return "Parasect";
        if (pokemonId == 48) return "Venonat";
        if (pokemonId == 49) return "Venomoth";
        if (pokemonId == 50) return "Diglett";
        if (pokemonId == 51) return "Dugtrio";
        if (pokemonId == 52) return "Meowth";
        if (pokemonId == 53) return "Persian";
        if (pokemonId == 54) return "Psyduck";
        if (pokemonId == 55) return "Golduck";
        if (pokemonId == 56) return "Mankey";
        if (pokemonId == 57) return "Primeape";
        if (pokemonId == 58) return "Growlithe";
        if (pokemonId == 59) return "Arcanine";
        if (pokemonId == 60) return "Poliwag";
        if (pokemonId == 61) return "Poliwhirl";
        if (pokemonId == 62) return "Poliwrath";
        if (pokemonId == 63) return "Abra";
        if (pokemonId == 64) return "Kadabra";
        if (pokemonId == 65) return "Alakazam";
        if (pokemonId == 66) return "Machop";
        if (pokemonId == 67) return "Machoke";
        if (pokemonId == 68) return "Machamp";
        if (pokemonId == 69) return "Bellsprout";
        if (pokemonId == 70) return "Weepinbell";
        if (pokemonId == 71) return "Victreebel";
        if (pokemonId == 72) return "Tentacool";
        if (pokemonId == 73) return "Tentacruel";
        if (pokemonId == 74) return "Geodude";
        if (pokemonId == 75) return "Graveler";
        if (pokemonId == 76) return "Golem";
        if (pokemonId == 77) return "Ponyta";
        if (pokemonId == 78) return "Rapidash";
        if (pokemonId == 79) return "Slowpoke";
        if (pokemonId == 80) return "Slowbro";
        if (pokemonId == 81) return "Magnemite";
        if (pokemonId == 82) return "Magneton";
        if (pokemonId == 83) return "Farfetch'd";
        if (pokemonId == 84) return "Doduo";
        if (pokemonId == 85) return "Dodrio";
        if (pokemonId == 86) return "Seel";
        if (pokemonId == 87) return "Dewgong";
        if (pokemonId == 88) return "Grimer";
        if (pokemonId == 89) return "Muk";
        if (pokemonId == 90) return "Shellder";
        if (pokemonId == 91) return "Cloyster";
        if (pokemonId == 92) return "Gastly";
        if (pokemonId == 93) return "Haunter";
        if (pokemonId == 94) return "Gengar";
        if (pokemonId == 95) return "Onix";
        if (pokemonId == 96) return "Drowzee";
        if (pokemonId == 97) return "Hypno";
        if (pokemonId == 98) return "Krabby";
        if (pokemonId == 99) return "Kingler";
        if (pokemonId == 100) return "Voltorb";
        if (pokemonId == 101) return "Electrode";
        if (pokemonId == 102) return "Exeggcute";
        if (pokemonId == 103) return "Exeggutor";
        if (pokemonId == 104) return "Cubone";
        if (pokemonId == 105) return "Marowak";
        if (pokemonId == 106) return "Hitmonlee";
        if (pokemonId == 107) return "Hitmonchan";
        if (pokemonId == 108) return "Lickitung";
        if (pokemonId == 109) return "Koffing";
        if (pokemonId == 110) return "Weezing";
        if (pokemonId == 111) return "Rhyhorn";
        if (pokemonId == 112) return "Rhydon";
        if (pokemonId == 113) return "Chansey";
        if (pokemonId == 114) return "Tangela";
        if (pokemonId == 115) return "Kangaskhan";
        if (pokemonId == 116) return "Horsea";
        if (pokemonId == 117) return "Seadra";
        if (pokemonId == 118) return "Goldeen";
        if (pokemonId == 119) return "Seaking";
        if (pokemonId == 120) return "Staryu";
        if (pokemonId == 121) return "Starmie";
        if (pokemonId == 122) return "Mr. Mime";
        if (pokemonId == 123) return "Scyther";
        if (pokemonId == 124) return "Jynx";
        if (pokemonId == 125) return "Electabuzz";
        if (pokemonId == 126) return "Magmar";
        if (pokemonId == 127) return "Pinsir";
        if (pokemonId == 128) return "Tauros";
        if (pokemonId == 129) return "Magikarp";
        if (pokemonId == 130) return "Gyarados";
        if (pokemonId == 131) return "Lapras";
        if (pokemonId == 132) return "Ditto";
        if (pokemonId == 133) return "Eevee";
        if (pokemonId == 134) return "Vaporeon";
        if (pokemonId == 135) return "Jolteon";
        if (pokemonId == 136) return "Flareon";
        if (pokemonId == 137) return "Porygon";
        if (pokemonId == 138) return "Omanyte";
        if (pokemonId == 139) return "Omastar";
        if (pokemonId == 140) return "Kabuto";
        if (pokemonId == 141) return "Kabutops";
        if (pokemonId == 142) return "Aerodactyl";
        if (pokemonId == 143) return "Snorlax";
        if (pokemonId == 144) return "Articuno";
        if (pokemonId == 145) return "Zapdos";
        if (pokemonId == 146) return "Moltres";
        if (pokemonId == 147) return "Dratini";
        if (pokemonId == 148) return "Dragonair";
        if (pokemonId == 149) return "Dragonite";
        if (pokemonId == 150) return "Mewtwo";
        if (pokemonId == 151) return "Mew";
        return "Unknown Pokemon";
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