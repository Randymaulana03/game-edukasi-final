const FILLER_LETTERS = "BCDEFGHIJKLMOPQRSTUVWXYZ";

export const wordsLevel3 = [
  {
    id: 1,
    label: "Nanas",
    answer: "NANAS",
    image: "/images/nanas.png",
  },
  {
    id: 2,
    label: "Okra",
    answer: "OKRA",
    image: "/images/okra.png",
  },
  {
    id: 3,
    label: "Pepaya",
    answer: "PEPAYA",
    image: "/images/pepaya.png",
  },
  {
    id: 4,
    label: "Rambutan",
    answer: "RAMBUTAN",
    image: "/images/rambutan.png",
  },
  {
    id: 5,
    label: "Sirsak",
    answer: "SIRSAK",
    image: "/images/sirsak.png",
  },
  {
    id: 6,
    label: "Timun",
    answer: "TIMUN",
    image: "/images/timun.png",
  },
  {
    id: 7,
    label: "Ubiungu",
    answer: "UBIUNGU",
    image: "/images/ubi-ungu.png",
  },
  {
    id: 8,
    label: "Waluh",
    answer: "WALUH",
    image: "/images/waluh.png",
  },
  {
    id: 9,
    label: "Zaitun",
    answer: "ZAITUN",
    image: "/images/zaitun.png",
  },
  {
    id: 10,
    label: "Jeruk",
    answer: "JERUK",
    image: "/images/jeruk.png",
  },
  {
    id: 11,
    label: "Leci",
    answer: "LECI",
    image: "/images/leci.png",
  },
  {
    id: 12,
    label: "Melon",
    answer: "MELON",
    image: "/images/melon.png",
  },
];

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function shuffleLetters(chars) {
  const arr = [...chars];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function buildLevel3Letters(answer) {
  const letters = answer.toUpperCase().trim().split("");
  return shuffleLetters(letters);
}
