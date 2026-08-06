import { checkWord } from './WordValidator.js';
import { playCorrectSound } from './AudioManager.js';

let currentArrangement = [];
let isAlreadyCorrect = false;

// Panggil fungsi ini saat memuat soal baru/reset soal
export function setInitialLetters(letters) {
  currentArrangement = [...letters];
  isAlreadyCorrect = false; // Reset status jawaban agar suara bisa berbunyi di soal baru
}

export function updateArrangement(newOrder) {
  currentArrangement = [...newOrder];
  return checkArrangement();
}

export function getCurrentWord() {
  return currentArrangement.join('');
}

export function checkArrangement() {
  const word = currentArrangement.join('');
  const isCorrect = checkWord(word);

  if (isCorrect && !isAlreadyCorrect) {
    playCorrectSound();
    isAlreadyCorrect = true;
  }

  return isCorrect;
}