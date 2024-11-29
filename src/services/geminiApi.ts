import { Theme } from '../types/game';

const API_KEY = 'johdus-riHfuj-2hixry';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-text';

interface GeminiResponse {
  words: string[];
  spangram: string;
}

export async function generatePuzzleTheme(keyword: string): Promise<Theme> {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Generate a word search puzzle theme about "${keyword}". 
                Return exactly 8 theme words (3-7 letters each) and 
                one spangram word (8-12 letters) that describes the theme.
                All words must be related to "${keyword}".`,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate puzzle theme');
    }

    const data: GeminiResponse = await response.json();
    
    return {
      name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
      words: data.words,
      spangram: data.spangram,
    };
  } catch (error) {
    console.error('Error generating puzzle theme:', error);
    // Fallback to a default theme if API fails
    return {
      name: 'Celestial Bodies',
      words: ['STAR', 'MOON', 'PLANET', 'COMET', 'NEBULA', 'GALAXY', 'METEOR', 'ORBIT'],
      spangram: 'ASTRONOMICAL',
    };
  }
}