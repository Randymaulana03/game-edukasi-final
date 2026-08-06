import { words as baseWords } from '../data/words.js';
import { wordsLevel2 } from './words_Level2.js';
import { wordsLevel3 } from '../data/Word_Level3.js';

// Menggabungkan semua kata dari berbagai level ke dalam Set untuk pencarian O(1) super cepat
const VALID_WORDS = new Set([
  ...(baseWords ? baseWords.map((word) => word.toUpperCase().trim()) : []),
  ...wordsLevel2.map((item) => item.answer.toUpperCase().trim()),
  ...(wordsLevel3 ? wordsLevel3.map((item) => item.answer.toUpperCase().trim()) : [])
]);

export function checkWord(input) {
  if (!input) {
    return false;
  }
  
  const upperInput = input.toUpperCase().trim();
  return VALID_WORDS.has(upperInput);
}