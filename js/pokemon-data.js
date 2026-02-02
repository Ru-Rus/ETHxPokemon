/**
 * Pokemon Data System
 * Based on Cryptomon and Arena of Legends catalog structure
 * Contains 20 starter Pokemon with base stats and moves
 */

const POKEMON_DATABASE = [
  {
    id: 1,
    name: "Bulbasaur",
    types: ["Grass", "Poison"],
    baseStats: {
      hp: 45,
      attack: 49,
      defense: 49,
      speed: 45,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    moves: [
      { name: "Vine Whip", power: 45, type: "Grass", accuracy: 100 },
      { name: "Tackle", power: 40, type: "Normal", accuracy: 100 },
      { name: "Razor Leaf", power: 55, type: "Grass", accuracy: 95 },
      { name: "Seed Bomb", power: 80, type: "Grass", accuracy: 100 },
    ],
  },
  {
    id: 4,
    name: "Charmander",
    types: ["Fire"],
    baseStats: {
      hp: 39,
      attack: 52,
      defense: 43,
      speed: 65,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    moves: [
      { name: "Ember", power: 40, type: "Fire", accuracy: 100 },
      { name: "Scratch", power: 40, type: "Normal", accuracy: 100 },
      { name: "Flamethrower", power: 90, type: "Fire", accuracy: 100 },
      { name: "Fire Fang", power: 65, type: "Fire", accuracy: 95 },
    ],
  },
  {
    id: 7,
    name: "Squirtle",
    types: ["Water"],
    baseStats: {
      hp: 44,
      attack: 48,
      defense: 65,
      speed: 43,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/7.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    moves: [
      { name: "Water Gun", power: 40, type: "Water", accuracy: 100 },
      { name: "Tackle", power: 40, type: "Normal", accuracy: 100 },
      { name: "Aqua Tail", power: 90, type: "Water", accuracy: 90 },
      { name: "Bite", power: 60, type: "Dark", accuracy: 100 },
    ],
  },
  {
    id: 25,
    name: "Pikachu",
    types: ["Electric"],
    baseStats: {
      hp: 35,
      attack: 55,
      defense: 40,
      speed: 90,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    moves: [
      { name: "Thunder Shock", power: 40, type: "Electric", accuracy: 100 },
      { name: "Quick Attack", power: 40, type: "Normal", accuracy: 100 },
      { name: "Thunderbolt", power: 90, type: "Electric", accuracy: 100 },
      { name: "Electro Ball", power: 80, type: "Electric", accuracy: 100 },
    ],
  },
  {
    id: 6,
    name: "Charizard",
    types: ["Fire", "Flying"],
    baseStats: {
      hp: 78,
      attack: 84,
      defense: 78,
      speed: 100,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/6.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
    moves: [
      { name: "Flamethrower", power: 90, type: "Fire", accuracy: 100 },
      { name: "Air Slash", power: 75, type: "Flying", accuracy: 95 },
      { name: "Dragon Claw", power: 80, type: "Dragon", accuracy: 100 },
      { name: "Fire Blast", power: 110, type: "Fire", accuracy: 85 },
    ],
  },
  {
    id: 9,
    name: "Blastoise",
    types: ["Water"],
    baseStats: {
      hp: 79,
      attack: 83,
      defense: 100,
      speed: 78,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/9.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
    moves: [
      { name: "Hydro Pump", power: 110, type: "Water", accuracy: 80 },
      { name: "Bite", power: 60, type: "Dark", accuracy: 100 },
      { name: "Ice Beam", power: 90, type: "Ice", accuracy: 100 },
      { name: "Skull Bash", power: 130, type: "Normal", accuracy: 100 },
    ],
  },
  {
    id: 3,
    name: "Venusaur",
    types: ["Grass", "Poison"],
    baseStats: {
      hp: 80,
      attack: 82,
      defense: 83,
      speed: 80,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/3.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
    moves: [
      { name: "Solar Beam", power: 120, type: "Grass", accuracy: 100 },
      { name: "Sludge Bomb", power: 90, type: "Poison", accuracy: 100 },
      { name: "Razor Leaf", power: 55, type: "Grass", accuracy: 95 },
      { name: "Body Slam", power: 85, type: "Normal", accuracy: 100 },
    ],
  },
  {
    id: 94,
    name: "Gengar",
    types: ["Ghost", "Poison"],
    baseStats: {
      hp: 60,
      attack: 65,
      defense: 60,
      speed: 110,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/94.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
    moves: [
      { name: "Shadow Ball", power: 80, type: "Ghost", accuracy: 100 },
      { name: "Sludge Bomb", power: 90, type: "Poison", accuracy: 100 },
      { name: "Dark Pulse", power: 80, type: "Dark", accuracy: 100 },
      { name: "Hypnosis", power: 0, type: "Psychic", accuracy: 60 },
    ],
  },
  {
    id: 65,
    name: "Alakazam",
    types: ["Psychic"],
    baseStats: {
      hp: 55,
      attack: 50,
      defense: 45,
      speed: 120,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/65.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png",
    moves: [
      { name: "Psychic", power: 90, type: "Psychic", accuracy: 100 },
      { name: "Shadow Ball", power: 80, type: "Ghost", accuracy: 100 },
      { name: "Dazzling Gleam", power: 80, type: "Fairy", accuracy: 100 },
      { name: "Focus Blast", power: 120, type: "Fighting", accuracy: 70 },
    ],
  },
  {
    id: 68,
    name: "Machamp",
    types: ["Fighting"],
    baseStats: {
      hp: 90,
      attack: 130,
      defense: 80,
      speed: 55,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/68.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png",
    moves: [
      { name: "Dynamic Punch", power: 100, type: "Fighting", accuracy: 50 },
      { name: "Cross Chop", power: 100, type: "Fighting", accuracy: 80 },
      { name: "Stone Edge", power: 100, type: "Rock", accuracy: 80 },
      { name: "Earthquake", power: 100, type: "Ground", accuracy: 100 },
    ],
  },
  {
    id: 130,
    name: "Gyarados",
    types: ["Water", "Flying"],
    baseStats: {
      hp: 95,
      attack: 125,
      defense: 79,
      speed: 81,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/130.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png",
    moves: [
      { name: "Hydro Pump", power: 110, type: "Water", accuracy: 80 },
      { name: "Dragon Dance", power: 0, type: "Dragon", accuracy: 100 },
      { name: "Crunch", power: 80, type: "Dark", accuracy: 100 },
      { name: "Ice Fang", power: 65, type: "Ice", accuracy: 95 },
    ],
  },
  {
    id: 131,
    name: "Lapras",
    types: ["Water", "Ice"],
    baseStats: {
      hp: 130,
      attack: 85,
      defense: 80,
      speed: 60,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/131.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png",
    moves: [
      { name: "Ice Beam", power: 90, type: "Ice", accuracy: 100 },
      { name: "Surf", power: 90, type: "Water", accuracy: 100 },
      { name: "Thunderbolt", power: 90, type: "Electric", accuracy: 100 },
      { name: "Psychic", power: 90, type: "Psychic", accuracy: 100 },
    ],
  },
  {
    id: 143,
    name: "Snorlax",
    types: ["Normal"],
    baseStats: {
      hp: 160,
      attack: 110,
      defense: 65,
      speed: 30,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/143.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png",
    moves: [
      { name: "Body Slam", power: 85, type: "Normal", accuracy: 100 },
      { name: "Earthquake", power: 100, type: "Ground", accuracy: 100 },
      { name: "Crunch", power: 80, type: "Dark", accuracy: 100 },
      { name: "Rest", power: 0, type: "Psychic", accuracy: 100 },
    ],
  },
  {
    id: 149,
    name: "Dragonite",
    types: ["Dragon", "Flying"],
    baseStats: {
      hp: 91,
      attack: 134,
      defense: 95,
      speed: 80,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/149.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png",
    moves: [
      { name: "Dragon Claw", power: 80, type: "Dragon", accuracy: 100 },
      { name: "Outrage", power: 120, type: "Dragon", accuracy: 100 },
      { name: "Hurricane", power: 110, type: "Flying", accuracy: 70 },
      { name: "Earthquake", power: 100, type: "Ground", accuracy: 100 },
    ],
  },
  {
    id: 150,
    name: "Mewtwo",
    types: ["Psychic"],
    baseStats: {
      hp: 106,
      attack: 110,
      defense: 90,
      speed: 130,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/150.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
    moves: [
      { name: "Psychic", power: 90, type: "Psychic", accuracy: 100 },
      { name: "Aura Sphere", power: 80, type: "Fighting", accuracy: 100 },
      { name: "Ice Beam", power: 90, type: "Ice", accuracy: 100 },
      { name: "Thunderbolt", power: 90, type: "Electric", accuracy: 100 },
    ],
  },
  {
    id: 59,
    name: "Arcanine",
    types: ["Fire"],
    baseStats: {
      hp: 90,
      attack: 110,
      defense: 80,
      speed: 95,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/59.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png",
    moves: [
      { name: "Flare Blitz", power: 120, type: "Fire", accuracy: 100 },
      { name: "Crunch", power: 80, type: "Dark", accuracy: 100 },
      { name: "Wild Charge", power: 90, type: "Electric", accuracy: 100 },
      { name: "Extreme Speed", power: 80, type: "Normal", accuracy: 100 },
    ],
  },
  {
    id: 133,
    name: "Eevee",
    types: ["Normal"],
    baseStats: {
      hp: 55,
      attack: 55,
      defense: 50,
      speed: 55,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/133.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png",
    moves: [
      { name: "Quick Attack", power: 40, type: "Normal", accuracy: 100 },
      { name: "Bite", power: 60, type: "Dark", accuracy: 100 },
      { name: "Swift", power: 60, type: "Normal", accuracy: 100 },
      { name: "Double-Edge", power: 120, type: "Normal", accuracy: 100 },
    ],
  },
  {
    id: 38,
    name: "Ninetales",
    types: ["Fire"],
    baseStats: {
      hp: 73,
      attack: 76,
      defense: 75,
      speed: 100,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/38.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/38.png",
    moves: [
      { name: "Flamethrower", power: 90, type: "Fire", accuracy: 100 },
      { name: "Extrasensory", power: 80, type: "Psychic", accuracy: 100 },
      { name: "Dark Pulse", power: 80, type: "Dark", accuracy: 100 },
      { name: "Solar Beam", power: 120, type: "Grass", accuracy: 100 },
    ],
  },
  {
    id: 103,
    name: "Exeggutor",
    types: ["Grass", "Psychic"],
    baseStats: {
      hp: 95,
      attack: 95,
      defense: 85,
      speed: 55,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/103.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/103.png",
    moves: [
      { name: "Solar Beam", power: 120, type: "Grass", accuracy: 100 },
      { name: "Psychic", power: 90, type: "Psychic", accuracy: 100 },
      { name: "Giga Drain", power: 75, type: "Grass", accuracy: 100 },
      { name: "Wood Hammer", power: 120, type: "Grass", accuracy: 100 },
    ],
  },
  {
    id: 144,
    name: "Articuno",
    types: ["Ice", "Flying"],
    baseStats: {
      hp: 90,
      attack: 85,
      defense: 100,
      speed: 85,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/144.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png",
    moves: [
      { name: "Ice Beam", power: 90, type: "Ice", accuracy: 100 },
      { name: "Blizzard", power: 110, type: "Ice", accuracy: 70 },
      { name: "Hurricane", power: 110, type: "Flying", accuracy: 70 },
      { name: "Ancient Power", power: 60, type: "Rock", accuracy: 100 },
    ],
  },
  {
    id: 18,
    name: "Pidgeot",
    types: ["Normal", "Flying"],
    baseStats: { hp: 83, attack: 80, defense: 75, speed: 101 },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/18.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/18.png",
    moves: [
      { name: "Hurricane", power: 110, type: "Flying", accuracy: 70 },
      { name: "Air Slash", power: 75, type: "Flying", accuracy: 95 },
      { name: "Quick Attack", power: 40, type: "Normal", accuracy: 100 },
      { name: "Steel Wing", power: 70, type: "Steel", accuracy: 90 },
    ],
  },
  {
    id: 26,
    name: "Raichu",
    types: ["Electric"],
    baseStats: { hp: 60, attack: 90, defense: 55, speed: 110 },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/26.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png",
    moves: [
      { name: "Thunderbolt", power: 90, type: "Electric", accuracy: 100 },
      { name: "Volt Tackle", power: 120, type: "Electric", accuracy: 100 },
      { name: "Iron Tail", power: 100, type: "Steel", accuracy: 75 },
      { name: "Quick Attack", power: 40, type: "Normal", accuracy: 100 },
    ],
  },
  {
    id: 31,
    name: "Nidoqueen",
    types: ["Poison", "Ground"],
    baseStats: { hp: 90, attack: 92, defense: 87, speed: 76 },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/31.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/31.png",
    moves: [
      { name: "Earthquake", power: 100, type: "Ground", accuracy: 100 },
      { name: "Sludge Wave", power: 95, type: "Poison", accuracy: 100 },
      { name: "Ice Beam", power: 90, type: "Ice", accuracy: 100 },
      { name: "Stone Edge", power: 100, type: "Rock", accuracy: 80 },
    ],
  },
  {
    id: 34,
    name: "Nidoking",
    types: ["Poison", "Ground"],
    baseStats: { hp: 81, attack: 102, defense: 77, speed: 85 },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/34.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/34.png",
    moves: [
      { name: "Earthquake", power: 100, type: "Ground", accuracy: 100 },
      { name: "Megahorn", power: 120, type: "Bug", accuracy: 85 },
      { name: "Poison Jab", power: 80, type: "Poison", accuracy: 100 },
      { name: "Thunderbolt", power: 90, type: "Electric", accuracy: 100 },
    ],
  },
  {
    id: 36,
    name: "Clefable",
    types: ["Fairy"],
    baseStats: { hp: 95, attack: 70, defense: 73, speed: 60 },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/36.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/36.png",
    moves: [
      { name: "Moonblast", power: 95, type: "Fairy", accuracy: 100 },
      { name: "Flamethrower", power: 90, type: "Fire", accuracy: 100 },
      { name: "Thunderbolt", power: 90, type: "Electric", accuracy: 100 },
      { name: "Psychic", power: 90, type: "Psychic", accuracy: 100 },
    ],
  },
  {
    id: 62,
    name: "Poliwrath",
    types: ["Water", "Fighting"],
    baseStats: { hp: 90, attack: 95, defense: 95, speed: 70 },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/62.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/62.png",
    moves: [
      { name: "Hydro Pump", power: 110, type: "Water", accuracy: 80 },
      { name: "Dynamic Punch", power: 100, type: "Fighting", accuracy: 50 },
      { name: "Ice Punch", power: 75, type: "Ice", accuracy: 100 },
      { name: "Earthquake", power: 100, type: "Ground", accuracy: 100 },
    ],
  },
  {
    id: 91,
    name: "Cloyster",
    types: ["Water", "Ice"],
    baseStats: { hp: 70, attack: 95, defense: 180, speed: 70 },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/91.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/91.png",
    moves: [
      { name: "Icicle Spear", power: 90, type: "Ice", accuracy: 100 },
      { name: "Surf", power: 90, type: "Water", accuracy: 100 },
      { name: "Rock Blast", power: 75, type: "Rock", accuracy: 90 },
      { name: "Hydro Pump", power: 110, type: "Water", accuracy: 80 },
    ],
  },
  {
    id: 112,
    name: "Rhydon",
    types: ["Ground", "Rock"],
    baseStats: { hp: 105, attack: 130, defense: 120, speed: 40 },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/112.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/112.png",
    moves: [
      { name: "Earthquake", power: 100, type: "Ground", accuracy: 100 },
      { name: "Stone Edge", power: 100, type: "Rock", accuracy: 80 },
      { name: "Megahorn", power: 120, type: "Bug", accuracy: 85 },
      { name: "Hammer Arm", power: 100, type: "Fighting", accuracy: 90 },
    ],
  },
  {
    id: 123,
    name: "Scyther",
    types: ["Bug", "Flying"],
    baseStats: { hp: 70, attack: 110, defense: 80, speed: 105 },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/123.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/123.png",
    moves: [
      { name: "X-Scissor", power: 80, type: "Bug", accuracy: 100 },
      { name: "Air Slash", power: 75, type: "Flying", accuracy: 95 },
      { name: "Night Slash", power: 70, type: "Dark", accuracy: 100 },
      { name: "Quick Attack", power: 40, type: "Normal", accuracy: 100 },
    ],
  },
  {
    id: 141,
    name: "Kabutops",
    types: ["Rock", "Water"],
    baseStats: { hp: 80, attack: 115, defense: 105, speed: 80 },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/141.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/141.png",
    moves: [
      { name: "Stone Edge", power: 100, type: "Rock", accuracy: 80 },
      { name: "Aqua Jet", power: 40, type: "Water", accuracy: 100 },
      { name: "X-Scissor", power: 80, type: "Bug", accuracy: 100 },
      { name: "Night Slash", power: 70, type: "Dark", accuracy: 100 },
    ],
  },

  // REWARD-ONLY POKEMON (Only obtainable through battle victories)
  {
    id: 145,
    name: "Zapdos",
    types: ["Electric", "Flying"],
    baseStats: {
      hp: 90,
      attack: 90,
      defense: 85,
      speed: 100,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/145.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png",
    moves: [
      { name: "Thunderbolt", power: 90, type: "Electric", accuracy: 100 },
      { name: "Drill Peck", power: 80, type: "Flying", accuracy: 100 },
      { name: "Thunder", power: 110, type: "Electric", accuracy: 70 },
      { name: "Heat Wave", power: 95, type: "Fire", accuracy: 90 },
    ],
    rewardOnly: true,
  },
  {
    id: 146,
    name: "Moltres",
    types: ["Fire", "Flying"],
    baseStats: {
      hp: 90,
      attack: 100,
      defense: 90,
      speed: 90,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/146.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png",
    moves: [
      { name: "Flamethrower", power: 90, type: "Fire", accuracy: 100 },
      { name: "Air Slash", power: 75, type: "Flying", accuracy: 95 },
      { name: "Heat Wave", power: 95, type: "Fire", accuracy: 90 },
      { name: "Solar Beam", power: 120, type: "Grass", accuracy: 100 },
    ],
    rewardOnly: true,
  },
  {
    id: 243,
    name: "Raikou",
    types: ["Electric"],
    baseStats: {
      hp: 90,
      attack: 85,
      defense: 75,
      speed: 115,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/243.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/243.png",
    moves: [
      { name: "Thunderbolt", power: 90, type: "Electric", accuracy: 100 },
      { name: "Crunch", power: 80, type: "Dark", accuracy: 100 },
      { name: "Thunder", power: 110, type: "Electric", accuracy: 70 },
      { name: "Shadow Ball", power: 80, type: "Ghost", accuracy: 100 },
    ],
    rewardOnly: true,
  },
  {
    id: 244,
    name: "Entei",
    types: ["Fire"],
    baseStats: {
      hp: 115,
      attack: 115,
      defense: 85,
      speed: 100,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/244.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/244.png",
    moves: [
      { name: "Flare Blitz", power: 120, type: "Fire", accuracy: 100 },
      { name: "Stone Edge", power: 100, type: "Rock", accuracy: 80 },
      { name: "Crunch", power: 80, type: "Dark", accuracy: 100 },
      { name: "Extreme Speed", power: 80, type: "Normal", accuracy: 100 },
    ],
    rewardOnly: true,
  },
  {
    id: 245,
    name: "Suicune",
    types: ["Water"],
    baseStats: {
      hp: 100,
      attack: 75,
      defense: 115,
      speed: 85,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/245.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/245.png",
    moves: [
      { name: "Surf", power: 90, type: "Water", accuracy: 100 },
      { name: "Ice Beam", power: 90, type: "Ice", accuracy: 100 },
      { name: "Hydro Pump", power: 110, type: "Water", accuracy: 80 },
      { name: "Mirror Coat", power: 0, type: "Psychic", accuracy: 100 },
    ],
    rewardOnly: true,
  },
  {
    id: 151,
    name: "Mew",
    types: ["Psychic"],
    baseStats: {
      hp: 100,
      attack: 100,
      defense: 100,
      speed: 100,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/151.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png",
    moves: [
      { name: "Psychic", power: 90, type: "Psychic", accuracy: 100 },
      { name: "Aura Sphere", power: 80, type: "Fighting", accuracy: 100 },
      { name: "Ice Beam", power: 90, type: "Ice", accuracy: 100 },
      { name: "Thunderbolt", power: 90, type: "Electric", accuracy: 100 },
    ],
    rewardOnly: true,
  },
  {
    id: 248,
    name: "Tyranitar",
    types: ["Rock", "Dark"],
    baseStats: {
      hp: 100,
      attack: 134,
      defense: 110,
      speed: 61,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/248.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/248.png",
    moves: [
      { name: "Stone Edge", power: 100, type: "Rock", accuracy: 80 },
      { name: "Crunch", power: 80, type: "Dark", accuracy: 100 },
      { name: "Earthquake", power: 100, type: "Ground", accuracy: 100 },
      { name: "Ice Beam", power: 90, type: "Ice", accuracy: 100 },
    ],
    rewardOnly: true,
  },
  {
    id: 282,
    name: "Gardevoir",
    types: ["Psychic", "Fairy"],
    baseStats: {
      hp: 68,
      attack: 65,
      defense: 65,
      speed: 80,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/282.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/282.png",
    moves: [
      { name: "Psychic", power: 90, type: "Psychic", accuracy: 100 },
      { name: "Moonblast", power: 95, type: "Fairy", accuracy: 100 },
      { name: "Shadow Ball", power: 80, type: "Ghost", accuracy: 100 },
      { name: "Thunderbolt", power: 90, type: "Electric", accuracy: 100 },
    ],
    rewardOnly: true,
  },
  {
    id: 306,
    name: "Aggron",
    types: ["Steel", "Rock"],
    baseStats: {
      hp: 70,
      attack: 110,
      defense: 180,
      speed: 50,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/306.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/306.png",
    moves: [
      { name: "Iron Head", power: 80, type: "Steel", accuracy: 100 },
      { name: "Stone Edge", power: 100, type: "Rock", accuracy: 80 },
      { name: "Earthquake", power: 100, type: "Ground", accuracy: 100 },
      { name: "Ice Beam", power: 90, type: "Ice", accuracy: 100 },
    ],
    rewardOnly: true,
  },
  {
    id: 448,
    name: "Lucario",
    types: ["Fighting", "Steel"],
    baseStats: {
      hp: 70,
      attack: 110,
      defense: 70,
      speed: 90,
    },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/448.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png",
    moves: [
      { name: "Aura Sphere", power: 80, type: "Fighting", accuracy: 100 },
      { name: "Flash Cannon", power: 80, type: "Steel", accuracy: 100 },
      { name: "Close Combat", power: 120, type: "Fighting", accuracy: 100 },
      { name: "Extreme Speed", power: 80, type: "Normal", accuracy: 100 },
    ],
    rewardOnly: true,
  },
  {
    id: 249,
    name: "Lugia",
    types: ["Psychic", "Flying"],
    baseStats: { hp: 106, attack: 90, defense: 130, speed: 110 },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/249.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/249.png",
    moves: [
      { name: "Aeroblast", power: 100, type: "Flying", accuracy: 95 },
      { name: "Psychic", power: 90, type: "Psychic", accuracy: 100 },
      { name: "Ice Beam", power: 90, type: "Ice", accuracy: 100 },
      { name: "Hydro Pump", power: 110, type: "Water", accuracy: 80 },
    ],
    rewardOnly: true,
  },
  {
    id: 250,
    name: "Ho-Oh",
    types: ["Fire", "Flying"],
    baseStats: { hp: 106, attack: 130, defense: 90, speed: 90 },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/250.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/250.png",
    moves: [
      { name: "Sacred Fire", power: 100, type: "Fire", accuracy: 95 },
      { name: "Brave Bird", power: 120, type: "Flying", accuracy: 100 },
      { name: "Earthquake", power: 100, type: "Ground", accuracy: 100 },
      { name: "Recover", power: 0, type: "Normal", accuracy: 100 },
    ],
    rewardOnly: true,
  },
  {
    id: 384,
    name: "Rayquaza",
    types: ["Dragon", "Flying"],
    baseStats: { hp: 105, attack: 150, defense: 90, speed: 95 },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/384.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/384.png",
    moves: [
      { name: "Dragon Ascent", power: 120, type: "Flying", accuracy: 100 },
      { name: "Outrage", power: 120, type: "Dragon", accuracy: 100 },
      { name: "Earthquake", power: 100, type: "Ground", accuracy: 100 },
      { name: "Extreme Speed", power: 80, type: "Normal", accuracy: 100 },
    ],
    rewardOnly: true,
  },
  {
    id: 383,
    name: "Groudon",
    types: ["Ground"],
    baseStats: { hp: 100, attack: 150, defense: 140, speed: 90 },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/383.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/383.png",
    moves: [
      { name: "Precipice Blades", power: 120, type: "Ground", accuracy: 85 },
      { name: "Fire Punch", power: 75, type: "Fire", accuracy: 100 },
      { name: "Stone Edge", power: 100, type: "Rock", accuracy: 80 },
      { name: "Solar Beam", power: 120, type: "Grass", accuracy: 100 },
    ],
    rewardOnly: true,
  },
  {
    id: 382,
    name: "Kyogre",
    types: ["Water"],
    baseStats: { hp: 100, attack: 100, defense: 90, speed: 90 },
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/382.gif",
    spriteStatic:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/382.png",
    moves: [
      { name: "Origin Pulse", power: 110, type: "Water", accuracy: 85 },
      { name: "Ice Beam", power: 90, type: "Ice", accuracy: 100 },
      { name: "Thunder", power: 110, type: "Electric", accuracy: 70 },
      { name: "Hydro Pump", power: 110, type: "Water", accuracy: 80 },
    ],
    rewardOnly: true,
  },
];

// Type effectiveness chart (simplified)
const TYPE_CHART = {
  Normal: { weakTo: ["Fighting"], resistantTo: [], immuneTo: ["Ghost"] },
  Fire: {
    weakTo: ["Water", "Ground", "Rock"],
    resistantTo: ["Fire", "Grass", "Ice", "Bug", "Steel", "Fairy"],
    immuneTo: [],
  },
  Water: {
    weakTo: ["Electric", "Grass"],
    resistantTo: ["Fire", "Water", "Ice", "Steel"],
    immuneTo: [],
  },
  Electric: {
    weakTo: ["Ground"],
    resistantTo: ["Electric", "Flying", "Steel"],
    immuneTo: [],
  },
  Grass: {
    weakTo: ["Fire", "Ice", "Poison", "Flying", "Bug"],
    resistantTo: ["Water", "Electric", "Grass", "Ground"],
    immuneTo: [],
  },
  Ice: {
    weakTo: ["Fire", "Fighting", "Rock", "Steel"],
    resistantTo: ["Ice"],
    immuneTo: [],
  },
  Fighting: {
    weakTo: ["Flying", "Psychic", "Fairy"],
    resistantTo: ["Bug", "Rock", "Dark"],
    immuneTo: [],
  },
  Poison: {
    weakTo: ["Ground", "Psychic"],
    resistantTo: ["Grass", "Fighting", "Poison", "Bug", "Fairy"],
    immuneTo: [],
  },
  Ground: {
    weakTo: ["Water", "Grass", "Ice"],
    resistantTo: ["Poison", "Rock"],
    immuneTo: ["Electric"],
  },
  Flying: {
    weakTo: ["Electric", "Ice", "Rock"],
    resistantTo: ["Grass", "Fighting", "Bug"],
    immuneTo: ["Ground"],
  },
  Psychic: {
    weakTo: ["Bug", "Ghost", "Dark"],
    resistantTo: ["Fighting", "Psychic"],
    immuneTo: [],
  },
  Bug: {
    weakTo: ["Fire", "Flying", "Rock"],
    resistantTo: ["Grass", "Fighting", "Ground"],
    immuneTo: [],
  },
  Rock: {
    weakTo: ["Water", "Grass", "Fighting", "Ground", "Steel"],
    resistantTo: ["Normal", "Fire", "Poison", "Flying"],
    immuneTo: [],
  },
  Ghost: {
    weakTo: ["Ghost", "Dark"],
    resistantTo: ["Poison", "Bug"],
    immuneTo: ["Normal", "Fighting"],
  },
  Dragon: {
    weakTo: ["Ice", "Dragon", "Fairy"],
    resistantTo: ["Fire", "Water", "Electric", "Grass"],
    immuneTo: [],
  },
  Dark: {
    weakTo: ["Fighting", "Bug", "Fairy"],
    resistantTo: ["Ghost", "Dark"],
    immuneTo: ["Psychic"],
  },
  Steel: {
    weakTo: ["Fire", "Fighting", "Ground"],
    resistantTo: [
      "Normal",
      "Grass",
      "Ice",
      "Flying",
      "Psychic",
      "Bug",
      "Rock",
      "Dragon",
      "Steel",
      "Fairy",
    ],
    immuneTo: ["Poison"],
  },
  Fairy: {
    weakTo: ["Poison", "Steel"],
    resistantTo: ["Fighting", "Bug", "Dark"],
    immuneTo: ["Dragon"],
  },
};

/**
 * Get Pokemon by ID
 * @param {number} id - Pokemon ID (1-151)
 * @returns {object|null} Pokemon data
 */
function getPokemonById(id) {
  return POKEMON_DATABASE.find((p) => p.id === id) || null;
}

/**
 * Get all available Pokemon
 * @returns {array} Array of all Pokemon
 */
function getAllPokemon() {
  return POKEMON_DATABASE;
}

/**
 * Calculate type effectiveness multiplier
 * @param {string} moveType - The type of the move
 * @param {array} defenderTypes - Array of defender's types
 * @returns {number} Damage multiplier (0, 0.25, 0.5, 1, 2, 4)
 */
function getTypeEffectiveness(moveType, defenderTypes) {
  let multiplier = 1;

  defenderTypes.forEach((defType) => {
    const typeData = TYPE_CHART[defType];
    if (!typeData) return;

    if (typeData.immuneTo.includes(moveType)) {
      multiplier = 0;
    } else if (typeData.weakTo.includes(moveType)) {
      multiplier *= 2;
    } else if (typeData.resistantTo.includes(moveType)) {
      multiplier *= 0.5;
    }
  });

  return multiplier;
}

/**
 * Get all reward-only Pokemon
 * @returns {array} Array of reward-only Pokemon
 */
function getRewardPokemon() {
  return POKEMON_DATABASE.filter((p) => p.rewardOnly === true);
}

/**
 * Get random reward Pokemon based on difficulty
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @returns {object} Object with pokemon and level
 */
function getRandomReward(difficulty) {
  const rewardPokemon = getRewardPokemon();
  const randomPokemon =
    rewardPokemon[Math.floor(Math.random() * rewardPokemon.length)];

  // Determine level based on difficulty
  let level;
  switch (difficulty) {
    case "easy":
      level = Math.floor(Math.random() * 3) + 3; // 3-5
      break;
    case "medium":
      level = Math.floor(Math.random() * 3) + 6; // 6-8
      break;
    case "hard":
      level = Math.floor(Math.random() * 4) + 9; // 9-12
      break;
    default:
      level = 5;
  }

  return {
    pokemonId: randomPokemon.id,
    level: level,
  };
}
