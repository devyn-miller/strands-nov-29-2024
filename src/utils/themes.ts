import { Theme } from '../types/game';

export const themes: Theme[] = [
  {
    name: "Celestial Bodies",
    words: ["STAR", "MOON", "PLANET", "COMET", "NEBULA", "GALAXY", "METEOR", "ORBIT"],
    spangram: "ASTRONOMICAL"
  },
  {
    name: "Ocean Life",
    words: ["WHALE", "CORAL", "SHARK", "DOLPHIN", "TURTLE", "OCTOPUS", "FISH", "SEAL"],
    spangram: "UNDERWATER"
  },
  {
    name: "Weather",
    words: ["CLOUD", "STORM", "RAIN", "WIND", "THUNDER", "BREEZE", "FROST", "HAIL"],
    spangram: "ATMOSPHERIC"
  },
  {
    name: "Kitchen",
    words: ["SPOON", "PLATE", "KNIFE", "BOWL", "WHISK", "STOVE", "OVEN", "PAN"],
    spangram: "COOKWARE"
  },
  {
    name: "Garden",
    words: ["PLANT", "SOIL", "SEED", "BLOOM", "WATER", "PRUNE", "WEED", "ROOT"],
    spangram: "BOTANICAL"
  },
  {
    name: "Music",
    words: ["BEAT", "NOTE", "SONG", "TUNE", "RHYTHM", "TEMPO", "CHORD", "SCALE"],
    spangram: "MELODIOUS"
  },
  {
    name: "Sports",
    words: ["TEAM", "GAME", "SCORE", "BALL", "FIELD", "COACH", "PLAY", "WIN"],
    spangram: "ATHLETIC"
  },
  {
    name: "Colors",
    words: ["BLUE", "GREEN", "PINK", "GOLD", "BLACK", "WHITE", "BROWN", "GRAY"],
    spangram: "SPECTRUM"
  },
  {
    name: "Birds",
    words: ["HAWK", "DOVE", "CROW", "SWAN", "EAGLE", "FINCH", "DUCK", "WREN"],
    spangram: "FEATHERED"
  },
  {
    name: "Mountains",
    words: ["PEAK", "SNOW", "ROCK", "CLIMB", "TRAIL", "SLOPE", "RIDGE", "BASE"],
    spangram: "ELEVATION"
  },
  {
    name: "Desert",
    words: ["SAND", "DUNE", "CACTUS", "HEAT", "OASIS", "PALM", "WIND", "SUN"],
    spangram: "SCORCHING"
  },
  {
    name: "Art",
    words: ["PAINT", "BRUSH", "COLOR", "DRAW", "CRAFT", "STYLE", "LINE", "FORM"],
    spangram: "CREATIVE"
  },
  {
    name: "Books",
    words: ["PAGE", "PLOT", "STORY", "READ", "COVER", "PRINT", "BIND", "TEXT"],
    spangram: "LITERARY"
  },
  {
    name: "Dance",
    words: ["STEP", "SPIN", "LEAP", "MOVE", "TWIST", "TURN", "FLOW", "SWAY"],
    spangram: "GRACEFUL"
  },
  {
    name: "Forest",
    words: ["TREE", "LEAF", "PINE", "MOSS", "FERN", "BARK", "WOOD", "SHADE"],
    spangram: "WOODLAND"
  },
  {
    name: "City",
    words: ["ROAD", "PARK", "SHOP", "CAFE", "TRAIN", "LIGHT", "WALK", "SIGN"],
    spangram: "DOWNTOWN"
  },
  {
    name: "Beach",
    words: ["SAND", "WAVE", "SHELL", "SURF", "TIDE", "SWIM", "SALT", "SUN"],
    spangram: "COASTAL"
  },
  {
    name: "Winter",
    words: ["SNOW", "ICE", "COLD", "SLED", "FROST", "CHILL", "FIRE", "COAT"],
    spangram: "FREEZING"
  },
  {
    name: "Baking",
    words: ["CAKE", "BREAD", "FLOUR", "SUGAR", "BAKE", "OVEN", "RISE", "MIX"],
    spangram: "PASTRIES"
  },
  {
    name: "Night",
    words: ["MOON", "STAR", "DARK", "DREAM", "SLEEP", "DUSK", "LAMP", "OWL"],
    spangram: "NOCTURNAL"
  }
];

// Key for storing used themes in local storage
const USED_THEMES_KEY = 'strands-used-themes';

// Get used themes from local storage
function getUsedThemes(): Set<string> {
  const usedThemesJson = localStorage.getItem(USED_THEMES_KEY);
  return usedThemesJson ? new Set(JSON.parse(usedThemesJson)) : new Set<string>();
}

// Save used themes to local storage
function saveUsedThemes(usedThemes: Set<string>): void {
  localStorage.setItem(USED_THEMES_KEY, JSON.stringify(Array.from(usedThemes)));
}

// Get a random theme that hasn't been used recently
export function getRandomTheme(): Theme {
  const usedThemes = getUsedThemes();
  
  // If all themes have been used, reset the used themes list
  if (usedThemes.size >= themes.length) {
    usedThemes.clear();
  }
  
  // Get available themes
  const availableThemes = themes.filter(theme => !usedThemes.has(theme.name));
  
  // Select a random theme from available themes
  const selectedTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
  
  // Add the selected theme to used themes
  usedThemes.add(selectedTheme.name);
  saveUsedThemes(usedThemes);
  
  return selectedTheme;
}