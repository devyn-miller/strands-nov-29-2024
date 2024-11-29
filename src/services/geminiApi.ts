import { Theme } from '../types/game';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

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
        contents: [{
          parts: [{
            text: `You are a word search puzzle generator. Generate a themed word search puzzle about "${keyword}".
                  Return ONLY a JSON object with exactly 8 theme words (3-7 letters each) and one spangram word (8-11 letters) that describes the theme.
                  All words must be UPPERCASE and contain only letters A-Z (no spaces or special characters).
                  The response must be a valid JSON object with this exact structure:
                  {
                    "words": ["WORD1", "WORD2", "WORD3", "WORD4", "WORD5", "WORD6", "WORD7", "WORD8"],
                    "spangram": "SPANGRAM"
                  }
                  Do not include any other text, markdown formatting, or explanation in your response.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate puzzle theme');
    }

    const data = await response.json();
    console.log('Raw API response:', data);
    const generatedContent = data.candidates[0].content.parts[0].text;
    console.log('Generated content:', generatedContent);
    
    // Extract JSON from the response, handling potential markdown formatting
    const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log('No JSON match found in response');
      throw new Error('Invalid response format from Gemini API');
    }
    console.log('Extracted JSON:', jsonMatch[0]);
    const parsedContent: GeminiResponse = JSON.parse(jsonMatch[0]);
    console.log('Parsed content:', parsedContent);
    
    return {
      name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
      words: parsedContent.words,
      spangram: parsedContent.spangram,
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