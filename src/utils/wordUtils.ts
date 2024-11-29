// This is a simple word validation function.
// In a production environment, you would want to use a proper dictionary API or word list.
export const isValidWord = (word: string): boolean => {
  // Minimum word length
  if (word.length < 3) return false;

  // You could integrate with a dictionary API here
  // For now, we'll use a simple check that the word contains only letters
  return /^[A-Z]+$/.test(word);
};
