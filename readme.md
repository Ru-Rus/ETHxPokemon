# 🎮 PokemonBTC - Complete Project Overview 

## 📋 Executive Summary 

 

**PokemonBTC** is a hybrid gaming platform that combines classic Pokémon gameplay mechanics with blockchain technology. It's a full-stack web application that allows users to: 

- **Collect and battle Pokémon** using a sophisticated battle system 

- **Earn and spend cryptocurrency tokens (PBTC)** in both traditional and blockchain modes 

- **Mint NFTs** of Pokémon on the Sepolia testnet 

- **Compete in tournaments** with AI-powered opponents 

- **Manage a collection** with leveling and trading mechanics 

 

The project supports **two modes of operation**: 

1. **Local Mode** - Uses browser localStorage (no blockchain required) 

2. **Blockchain Mode** - Uses Sepolia testnet with MetaMask and smart contracts 

 

--- 

 

## 🏗️ Architecture Overview 

 

### Tech Stack 

``` 

Frontend: 

├── HTML/CSS (responsive web interface) 

├── Vanilla JavaScript (no frameworks) 

├── Ethers.js (blockchain interactions) 

└── Local Storage API 

 

Backend: 

├── Node.js + Express (REST API server) 

├── MongoDB (user data persistence) 

├── JWT (authentication) 

└── bcryptjs (password hashing) 

 

Blockchain: 

├── Solidity Smart Contracts (ERC-20 & ERC-721) 

└── Sepolia Testnet (Ethereum test network) 

``` 

 

### Folder Structure 

``` 

ETHxPokemon/ 

├── Frontend Files (HTML/CSS/JS) 

│   ├── index.html, login.html, dashboard.html, etc. 

│   ├── js/ (core game logic) 

│   │   ├── pokemon.js (Pokemon class) 

│   │   ├── battle.js (Battle system) 

│   │   ├── tournament.js (Tournament logic) 

│   │   ├── web3.js (Blockchain integration) 

│   │   ├── config.js (App configuration) 

│   │   └── storage.js (localStorage management) 

│   └── css/ (styling) 

│ 

├── backend/ 

│   ├── server.js (Express server setup) 

│   ├── config/database.js (MongoDB connection) 

│   ├── models/User.js (Database schema) 

│   ├── routes/auth.js (Login/Register) 

│   ├── routes/game.js (Game operations) 

│   └── middleware/auth.js (JWT verification) 

│ 

└── contracts/ 

    ├── NewPokemonToken.sol (ERC-20 token contract) 

    └── NewPokemonNFT.sol (ERC-721 NFT contract) 

``` 

 

--- 

 

## 🔐 Authentication & User System 

 

### User Flow 

1. **Registration** (`/api/auth/register`) 

   - Users create account with username (3-20 chars) and password (min 6 chars) 

   - Password hashed with bcryptjs before storage 

   - User starts with 1,000 PBTC balance 

   - JWT token issued for session management 

 

2. **Login** (`/api/auth/login`) 

   - Verify credentials against MongoDB 

   - Return JWT token valid for 30 days 

   - Token stored in localStorage 

 

3. **User Model** (MongoDB) 

   - Stores: username, password, balance, owned Pokémon, battle stats 

   - Battle stats tracked separately for Easy/Medium/Hard difficulties 

   - Timestamps for last login and faucet claims 

 

### Middleware 

- **JWT Authentication**: Protects all game endpoints 

- **Token validation** on every protected route request 

- **User lookup** from decoded token payload 

 

--- 

 

## 🎮 Core Game Systems 

 

### 1. Pokémon Database & Mechanics 

 

**20 Starter Pokémon Available:** 

- Bulbasaur, Charmander, Squirtle (Gen 1 starters) 

- Pikachu, Charizard, Blastoise, Venusaur 

- Plus 13 more iconic Pokémon 

 

**Stats System (PokeChain Formula):** 

``` 

HP = (2 × baseStat + IV) × level / 100 + level + 10 

Other Stats = ((2 × baseStat + IV) × level / 100) + 5 

``` 

 

**Individual Values (IV):** 

- Random 0-31 range per stat (HP, Attack, Defense, Speed) 

- Creates unique stat variation among same Pokémon 

- Assigned at creation time 

 

**Pokémon Class Features:** 

- Level up system with stat recalculation 

- HP tracking (current/max) 

- Type system (Grass, Fire, Water, Electric, etc.) 

- Move sets (4 moves per Pokémon with power/accuracy) 

- Experience tracking 

 

--- 

 

### 2. Battle System 

 

**Battle Flow:** 

``` 

1. Speed check → Determine turn order 

   └─ Faster Pokémon goes first 

   └─ Tie = 50/50 random 

 

2. Player/Bot selects move 

3. Calculate damage 

4. Apply damage to opponent 

5. Check if fainted 

6. Repeat until one faints 

``` 

 

**Damage Calculation:** 

``` 

baseDamage = (((2 × level / 5 + 2) × movePower × attack / defense) / 50) + 2 

``` 

 

**Damage Modifiers:** 

- **STAB** (Same Type Attack Bonus): 1.5x if move type matches Pokémon type 

- **Type Effectiveness**: 0x (no effect), 0.5x (weak), 1x (neutral), 2x (super effective) 

- **Critical Hit**: 6% chance for 1.5x damage 

- **Variance**: 0.85x to 1.0x random multiplier 

- **Defense Reduction**: 30% damage reduction 

 

**Type Effectiveness Chart:** 

- Water beats Fire 

- Fire beats Grass 

- Grass beats Water 

- Electric beats Water 

- (And more classic Pokémon type matchups) 

 

--- 

 

### 3. Battle AI (Bot Opponents) 

 

**Three Difficulty Levels:** 

 

| Difficulty | Stats | Move Selection | Strategy | 

|-----------|-------|-----------------|----------| 

| **Easy** | 70% of player | Random moves | No tactics | 

| **Medium** | 100% of player | 50% smart moves | Sometimes strategic | 

| **Hard** | 120% of player | 80% optimal moves | Always tactical | 

 

**Bot Strategy:** 

- Analyzes current situation 

- Prioritizes super effective moves 

- Uses healing/support moves when HP is low 

- Adapts based on difficulty level 

 

--- 

 

### 4. Tournament System 

 

**Single-Elimination Format:** 

``` 

Round 1 (Quarterfinals): 8 Pokémon → 4 winners 

Round 2 (Semifinals):    4 Pokémon → 2 winners 

Round 3 (Finals):        2 Pokémon → 1 champion 

``` 

 

**Tournament Features:** 

- Player faces 7 AI opponents 

- Player enters at position 1 

- Other 6 slots filled with generated bot Pokémon 

- Matches automatically progress 

- Full bracket tracking with match history 

- Victory conditions clear at each round 

 

--- 

 

## 💰 Economy System 

 

### Currency: PBTC Token 

- ERC-20 token on Sepolia testnet 

- Used for minting, leveling, and trading 

- Can be earned or claimed from faucet 

 

### Economy Operations 

 

#### Minting (Creating New Pokémon) 

- **Cost**: 100 PBTC per Pokémon 

- **Requirement**: User must have balance ≥ 100 PBTC 

- **Limit**: One instance per Pokémon species per user 

- **Result**: Owned Pokémon added to collection at level 5 

 

#### Leveling Up 

- **Cost Formula**: `level × 10 PBTC` 

- **Max Level**: 100 

- **Progression**: Stats recalculate and scale 

- **HP Healing**: Proportional heal on level up 

 

#### Selling Pokémon 

- **Price Formula**: `level × 5 PBTC` 

- **Action**: Removes from collection, adds funds to balance 

- **Note**: In blockchain mode, NFT remains owned on-chain 

 

#### Faucet (Free Token Claim) 

- **Reward**: 1,000 PBTC per claim 

- **Cooldown**: 24 hours between claims 

- **Limit**: Can't exceed 10,000 PBTC balance 

- **Purpose**: Help new players bootstrap their economy 

 

--- 

 

## 🔗 Blockchain Integration 

 

### Smart Contracts 

 

#### 1. PokemonToken (ERC-20) 

**Contract Address**: `0xD646B8F82C95Cf49B48F742dbB128Ecaba642ECd` 

 

**Functions:** 

- `faucetMint()` - Claim free 1,000 tokens (24h cooldown) 

- `balanceOf(address)` - Check token balance 

- `approve(address, uint256)` - Approve token spending 

- `transfer(address, uint256)` - Send tokens 

- `ownerMint(address, uint256)` - Owner function to mint tokens 

 

**Features:** 

- 1,000,000 initial supply (to contract owner) 

- Faucet limit: 10,000 tokens max per user 

- 24-hour cooldown per user 

- ERC-20 standard compliant 

 

#### 2. PokemonNFT (ERC-721) 

**Contract Address**: `0x3c771Bcc5339b9d5b4EC425722Ec67D41A73A2EB` 

 

**Functions:** 

- `mintWithToken(uint256 pokemonId)` - Mint NFT by paying tokens 

- `tokensOfOwner(address owner)` - Get user's NFTs 

- `getPokemonId(uint256 tokenId)` - Get Pokémon species from token ID 

- `ownerMint(address, to, uint256)` - Owner mints for user 

 

**Features:** 

- Max supply: 151 (Generation 1 Pokémon) 

- One token per Pokémon species per user 

- Each token maps to a Pokémon ID (1-151) 

- Tokens can be transferred/traded on secondary markets 

 

### Web3 Integration (web3.js) 

**Key Functions:** 

- `connectWallet()` - Request MetaMask connection 

- `getTokenBalance()` - Fetch PBTC balance 

- `mintPokemon(pokemonId)` - Call NFT contract to mint 

- `getUserNFTs()` - Get owned NFT token IDs 

- `getPokemonIdFromToken(tokenId)` - Get species from NFT 

- `checkFaucetStatus()` - Check if can claim tokens 

- Auto-switching to Sepolia network if needed 

 

--- 

 

## 🎯 Frontend Pages & Features 

 

### 1. **Home Page** (index.html) 

- Landing page with feature overview 

- Call-to-action buttons (Login/Register) 

- Feature cards explaining gameplay 

- Responsive hero section with gradient styling 

 

### 2. **Login/Register** (login.html, register.html) 

- User authentication forms 

- Input validation (username, password) 

- Error messages and feedback 

- Link between login/register pages 

 

### 3. **Dashboard** (dashboard.html) 

- User statistics overview 

  - Total Pokémon owned 

  - Battle win/loss record 

  - Win rate percentage 

  - Balance display 

- Battle stats by difficulty (Easy/Medium/Hard) 

- Username display 

- Quick links to other sections 

 

### 4. **Collection** (collection.html) 

- Display all owned Pokémon 

- Level display for each 

- Action buttons (Level Up, Sell, Battle) 

- Statistics aggregation 

- Supports both local and blockchain modes 

 

### 5. **Battle Arena** (battle.html) 

- Difficulty selection (Easy/Medium/Hard) 

- Pokémon selection from owned collection 

- Live battle interface with: 

  - Opponent sprite/stats 

  - Player sprite/stats 

  - HP bars 

  - Move selection buttons 

  - Battle log 

  - Sound effects (optional) 

- Battle results screen 

- Tournament support 

 

### 6. **Mint Page** (mint.html) 

- Wallet connection interface (blockchain mode) 

- Display available Pokémon to mint 

- Show user's PBTC balance 

- Faucet claim button 

- Mint buttons for each Pokémon 

- Transaction status feedback 

 

--- 

 

## 📊 Data Models 

 

### User (MongoDB) 

```javascript 

{ 

  username: String (unique, 3-20 chars), 

  password: String (hashed), 

  balance: Number (starting 1000), 

  ownedPokemon: [ 

    { 

      pokemonId: Number, 

      level: Number (default 5), 

      experience: Number (default 0), 

      mintedAt: Date 

    } 

  ], 

  battleStats: { 

    easy: { wins: Number, losses: Number }, 

    medium: { wins: Number, losses: Number }, 

    hard: { wins: Number, losses: Number } 

  }, 

  lastFaucetClaim: Date, 

  createdAt: Date, 

  lastLogin: Date 

} 

``` 

 

### Pokémon (In-Memory/Local Storage) 

```javascript 

{ 

  id: Number (1-151), 

  name: String, 

  types: String[] (e.g., ["Grass", "Poison"]), 

  baseStats: { 

    hp: Number, 

    attack: Number, 

    defense: Number, 

    speed: Number 

  }, 

  sprite: String (GIF URL), 

  spriteStatic: String (PNG URL), 

  moves: [ 

    { 

      name: String, 

      power: Number, 

      type: String, 

      accuracy: Number (0-100) 

    } 

  ] 

} 

``` 

 

--- 

 

## 🎮 How to Use - Player Guide 

 

### Getting Started 

1. **Visit the home page** and click "Login" or "Register" 

2. **Create account** with username and password 

3. **You receive 1,000 PBTC** to start your journey 

 

### In Local Mode (No Blockchain) 

1. **Go to Mint page** 

   - Select any Pokémon to add to collection (100 PBTC each) 

   - Faucet gives 1,000 PBTC every day 

2. **View Collection** 

   - See all owned Pokémon 

   - Level up your favorites (costs PBTC) 

   - Sell for PBTC if needed 

3. **Battle** 

   - Select difficulty (Easy/Medium/Hard) 

   - Choose your Pokémon 

   - Battle AI opponent 

   - Win to get satisfaction and battle stats 

4. **Dashboard** 

   - Check your stats and progress 

   - View win/loss records by difficulty 

 

### In Blockchain Mode (with MetaMask) 

1. **Install MetaMask** browser extension 

2. **Connect wallet** on Mint page 

3. **Claim PBTC** from faucet (1,000 tokens, 24h cooldown) 

4. **Mint Pokémon as NFTs** 

   - Each Pokémon becomes an ERC-721 NFT 

   - Costs 100 PBTC per mint 

   - You own the NFT on blockchain 

5. **Battle with NFTs** 

   - Your NFTs appear as available Pokémon 

   - Battle with blockchain-backed Pokémon 

6. **Trade/Sell NFTs** 

   - Use your wallet to transfer NFTs 

   - List on secondary marketplaces 

   - NFTs persist even after "removing" from game collection 

 

--- 

 

## 🌐 API Endpoints 

 

### Authentication Routes 

``` 

POST /api/auth/register 

POST /api/auth/login 

GET  /api/auth/me (requires token) 

``` 

 

### Game Routes 

``` 

GET    /api/game/pokemon (get user's Pokémon) 

POST   /api/game/mint (mint new Pokémon) 

POST   /api/game/sell (sell a Pokémon) 

POST   /api/game/level-up (increase Pokémon level) 

POST   /api/game/battle (record battle result) 

POST   /api/game/claim-faucet (claim free tokens) 

``` 

 

### Response Format 

```json 

{ 

  "success": true/false, 

  "message": "Operation description", 

  "data": { /* operation-specific data */ } 

} 

``` 

 

--- 

 

## ⚙️ Configuration 

 

### Mode Selection (config.js) 

```javascript 

APP_CONFIG = { 

  MODE: 'blockchain'  // Change to 'local' for offline mode 

} 

``` 

 

### Contract Addresses (config.js) 

```javascript 

CONTRACTS: { 

  token: '0xD646B8F82C95Cf49B48F742dbB128Ecaba642ECd', 

  nft: '0x3c771Bcc5339b9d5b4EC425722Ec67D41A73A2EB' 

} 

``` 

 

### Network Configuration 

```javascript 

NETWORK: { 

  chainId: 11155111,        // Sepolia 

  name: 'Sepolia', 

  rpcUrl: 'https://rpc.sepolia.org' 

} 

``` 

 

### Game Economics (Stored in Routes) 

``` 

MINT_PRICE: 100 PBTC 

FAUCET_AMOUNT: 1,000 PBTC 

FAUCET_COOLDOWN: 24 hours 

LEVEL_UP_BASE_COST: 50 PBTC 

``` 

 

--- 

 

## 🔄 Data Flow 

 

### User Registration & Login 

``` 

User Input → Validation → Password Hash → MongoDB Save → JWT Generate → Return Token 

``` 

 

### Pokémon Minting 

``` 

User Selects Pokémon → Check Balance → Deduct PBTC → Create Pokémon Instance 

→ Calculate Stats (IV + Level) → Save to DB/Storage → Confirm to User 

``` 

 

### Battle Execution 

``` 

1. Select Pokémon & Difficulty 

2. Generate Bot Pokémon 

3. Create Battle Instance 

4. Determine Turn Order (Speed Check) 

5. Player Selects Move 

   └─ Bot Selects Move (AI Logic) 

6. Calculate Damage (with all modifiers) 

7. Apply Damage & Check Faint 

8. Log Battle Event 

9. Repeat until Winner 

10. Record Stats & Return Rewards 

``` 

 

### Tournament Flow 

``` 

Setup Bracket (Player + 7 Bots) 

└─ Quarterfinals (4 Matches) 

   └─ Semifinals (2 Matches from QF winners) 

      └─ Finals (1 Match from SF winners) 

         └─ Tournament Complete 

``` 

 

--- 

 

## 🎨 Styling & UI 

 

### Design System 

- **Color Palette**:  

  - Primary Purple: `#8B5CF6` 

  - Neon Blue: `#06B6D4` 

  - Crypto Pink: `#EC4899` 

  - Crypto Yellow: `#FBBF24` 

  - Dark Background: `#1a1a1a` 

 

- **Typography**: Clean sans-serif with gradient text effects 

- **Animations**: Smooth transitions and hover effects 

- **Responsive**: Mobile-first design with flexbox/grid layouts 

 

### CSS Themes 

- **btc-theme.css**: Crypto/blockchain aesthetic 

- **battle.css**: Battle-specific UI (sprites, HP bars, move buttons) 

- **collection.css**: Collection grid and card layouts 

 

--- 

 

## 🔧 Backend Setup 

 

### Environment Variables (.env) 

``` 

PORT=5000 

MONGODB_URI=mongodb://localhost/pokemonbtc 

JWT_SECRET=your_secret_key_here 

NODE_ENV=development 

``` 

 

### Running Backend 

```bash 

cd backend 

npm install 

npm run dev  # Development with nodemon 

npm start    # Production 

``` 

 

### Database 

- MongoDB local instance or Atlas connection 

- Collections: users (with embedded Pokémon) 

- Automatic indexing on unique fields (username) 

 

--- 

 

## 📱 Local vs Blockchain Mode 

 

### Local Mode (`MODE: 'local'`) 

✅ **Advantages:** 

- No wallet required 

- Instant transactions 

- Great for testing/playing offline 

- Simple setup 

 

❌ **Limitations:** 

- Data stored only in browser 

- Not blockchain-backed 

- Limited to single device 

 

### Blockchain Mode (`MODE: 'blockchain'`) 

✅ **Advantages:** 

- Pokémon minted as real NFTs 

- Portable across devices (via wallet) 

- Tradeable on marketplaces 

- Immutable on blockchain 

 

❌ **Limitations:** 

- Requires MetaMask 

- Test ETH needed (from faucet) 

- Transaction fees (though minimal on testnet) 

- Network latency 

 

--- 

 

## 🚀 Key Features Summary 

 

| Feature | Local | Blockchain | 

|---------|-------|-----------| 

| User Accounts | ✅ | ✅ | 

| Pokémon Minting | ✅ | ✅ (as NFTs) | 

| Battle System | ✅ | ✅ | 

| Tournament Mode | ✅ | ✅ | 

| Leveling | ✅ | ✅ | 

| Economy | ✅ (localStorage) | ✅ (ERC-20 tokens) | 

| Collection Management | ✅ | ✅ | 

| Stats Tracking | ✅ | ✅ | 

| Trading | ❌ | ✅ (via wallet) | 

 

--- 

 

## 🐛 Error Handling 

 

### Frontend Validation 

- Username/password format checks 

- Balance validation before transactions 

- Pokemon existence checks 

- Difficulty level validation 

 

### Backend Validation 

- JWT token verification 

- MongoDB schema validation 

- Express-validator for input sanitation 

- Error middleware for consistent responses 

 

### Blockchain Validation 

- Network chain ID verification 

- Contract address validation 

- Function call error handling 

- Transaction status monitoring 

 

--- 

 

## 🎓 Learning Outcomes 

 

This project demonstrates: 

 

1. **Full-Stack Development**: Frontend, backend, database, blockchain 

2. **Smart Contract Integration**: Interaction with ERC-20 and ERC-721 

3. **Game Design**: Turn-based combat, AI, progression systems 

4. **User Authentication**: JWT tokens, password hashing, session management 

5. **Data Persistence**: MongoDB, localStorage, blockchain 

6. **API Design**: RESTful endpoints, error handling 

7. **Web3 Integration**: MetaMask, ethers.js, contract interaction 

8. **Responsive Design**: CSS, mobile-friendly layouts 

9. **State Management**: Local/global state across app 

10. **Test Network Usage**: Sepolia testnet configuration 

 

--- 

 

## 📝 Summary 

 

**PokemonBTC** is a comprehensive gaming platform that bridges traditional web applications with blockchain technology. Whether playing in local mode for casual fun or blockchain mode for NFT ownership, users experience a polished Pokémon battle game with real economic incentives. 

 

The architecture is modular, allowing easy switching between modes and clear separation of concerns. The battle system is mathematically balanced, the economy is designed to feel rewarding, and the UI provides a smooth, engaging experience. 

 

Perfect for learning about full-stack development, blockchain integration, and game design all in one project! 🎮⚡ 

 

 

 