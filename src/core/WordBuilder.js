import { checkWord } from './WordValidator.js';

let currentWord = "";

export function startWord(letter) {
  currentWord = letter;
}

export function addLetter(letter) {
  currentWord += letter;
  return checkCurrentWord();
}

export function checkCurrentWord() {
  return checkWord(currentWord);
}

export function resetWord() {
  currentWord = "";
}

export function getCurrentString() {
  return currentWord;
}