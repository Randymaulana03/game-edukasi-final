// Pre-calculated Filler Array (Statis di tingkat modul)
const FILLER_LETTERS = Array.from("BCDEFGHIJKLMOPQRSTUVWXYZ");

// Bank Soal Level 3 (Freezed untuk mencegah mutasi runtime)
export const wordsLevel3 = Object.freeze([
  { id: 1, label: "Nanas", answer: "NANAS", image: "/images/nanas.png" },
  { id: 2, label: "Okra", answer: "OKRA", image: "/images/okra.png" },
  { id: 3, label: "Pepaya", answer: "PEPAYA", image: "/images/pepaya.png" },
  { id: 4, label: "Rambutan", answer: "RAMBUTAN", image: "/images/rambutan.png" },
  { id: 5, label: "Sirsak", answer: "SIRSAK", image: "/images/sirsak.png" },
  { id: 6, label: "Timun", answer: "TIMUN", image: "/images/timun.png" },
  { id: 7, label: "Ubiungu", answer: "UBIUNGU", image: "/images/ubi-ungu.png" },
  { id: 8, label: "Waluh", answer: "WALUH", image: "/images/waluh.png" },
  { id: 9, label: "Zaitun", answer: "ZAITUN", image: "/images/zaitun.png" },
  { id: 10, label: "Jeruk", answer: "JERUK", image: "/images/jeruk.png" },
  { id: 11, label: "Leci", answer: "LECI", image: "/images/leci.png" },
  { id: 12, label: "Melon", answer: "MELON", image: "/images/melon.png" },
]);

/**
 * Fisher-Yates Shuffle Algorithm (In-Place Array)
 */
function shuffleLetters(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

/**
 * Membuat susunan huruf acak untuk Level 3.
 * Dipastikan susunan huruf awal tidak langsung membentuk jawaban yang benar.
 */
export function buildLevel3Letters(answer) {
  if (!answer) return [];
  
  const cleanAnswer = answer.toUpperCase().trim();
  const originalLetters = cleanAnswer.split("");
  
  // Jika panjang huruf <= 1, langsung kembalikan
  if (originalLetters.length <= 1) return [...originalLetters];

  let shuffled = shuffleLetters([...originalLetters]);
  let attempts = 0;

  // Pastikan hasil acakan tidak persis sama dengan kata kunci asli
  while (shuffled.join("") === cleanAnswer && attempts < 5) {
    shuffled = shuffleLetters([...originalLetters]);
    attempts++;
  }

  return shuffled;
}