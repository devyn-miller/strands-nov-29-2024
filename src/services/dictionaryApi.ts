const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export interface DictionaryResponse {
  word: string;
  phonetic?: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
      synonyms: string[];
      antonyms: string[];
    }[];
  }[];
}

export async function getWordDefinition(word: string): Promise<DictionaryResponse[]> {
  const response = await fetch(`${API_URL}/${word.toLowerCase()}`);
  if (!response.ok) {
    throw new Error(`Word "${word}" not found`);
  }
  return response.json();
}

// Generate a themed word search puzzle
export async function generateThemeWords(theme: string): Promise<{
  words: string[];
  spangram: string;
}> {
  try {
    // Get theme definition to find related words
    const themeData = await getWordDefinition(theme);
    
    // Extract relevant words from definitions and examples
    const words = new Set<string>();
    const spangrams = new Set<string>();
    
    themeData.forEach(entry => {
      entry.meanings.forEach(meaning => {
        meaning.definitions.forEach(def => {
          // Extract words from definition
          const definitionWords = def.definition
            .toUpperCase()
            .split(/\s+/)
            .filter(w => w.length >= 4 && w.length <= 7 && /^[A-Z]+$/.test(w));
          
          definitionWords.forEach(w => words.add(w));

          // Look for potential spangrams (longer words)
          const longWords = def.definition
            .toUpperCase()
            .split(/\s+/)
            .filter(w => w.length >= 8 && w.length <= 12 && /^[A-Z]+$/.test(w));
          
          longWords.forEach(w => spangrams.add(w));

          // Add synonyms if they're the right length
          if (def.synonyms) {
            def.synonyms.forEach(syn => {
              const word = syn.toUpperCase();
              if (word.length >= 4 && word.length <= 7 && /^[A-Z]+$/.test(word)) {
                words.add(word);
              } else if (word.length >= 8 && word.length <= 12 && /^[A-Z]+$/.test(word)) {
                spangrams.add(word);
              }
            });
          }
        });
      });
    });

    // Convert sets to arrays and take required number of words
    const themeWords = Array.from(words).slice(0, 8); // Take up to 8 theme words
    const spangram = Array.from(spangrams)[0] || theme.toUpperCase(); // Use first spangram or theme word

    return {
      words: themeWords,
      spangram
    };
  } catch (error) {
    console.error('Error generating theme words:', error);
    // Fallback to basic words if the API fails
    return {
      words: ['WORD', 'GAME', 'PLAY', 'FIND', 'SEEK', 'LOOK', 'SPOT', 'HUNT'],
      spangram: 'SEARCHING'
    };
  }
}
