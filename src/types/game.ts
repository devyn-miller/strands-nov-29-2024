export interface Position {
  row: number;
  col: number;
}

export interface WordLocation {
  word: string;
  positions: Position[];
}

export interface Theme {
  name: string;
  description: string;
  spangram: string;
  words: string[];
}

export interface GameState {
  grid: string[][];
  theme: Theme;
  themeWords: WordLocation[];
  spangram: WordLocation | null;
  foundWords: Set<string>;
  nonThemeWords: Set<string>;
  hints: number;
  activeHintWord: WordLocation | null;
  isComplete: boolean;
}

export interface WordSelectionState {
  selectedPositions: Position[];
  isSelecting: boolean;
}