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
  // Add more themes as needed
];

export function getRandomTheme(): Theme {
  return themes[Math.floor(Math.random() * themes.length)];
}