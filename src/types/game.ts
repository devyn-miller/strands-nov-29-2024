export interface Position {
  row: number;
  col: number;
}

export interface Word {
  word: string;
  start: Position;
  end: Position;
  found: boolean;
}

export interface Theme {
  name: string;
  words: string[];
  spangram: string;
}

export interface GameState {
  grid: string[][];
  theme: Theme;
  themeWords: Word[];
  spangram: Word | null;
  foundWords: Set<string>;
  hints: number;
  isComplete: boolean;
  activeHintWord: string | null;
}