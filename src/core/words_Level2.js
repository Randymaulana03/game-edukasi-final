// Filler Array Statis (Di-precalculate agar cepat)
const FILLER_LETTERS = Array.from('CEFGHIKLMNOPQRSTVWXYZ');

const ORIENTATION_GROUPS = Object.freeze({
  horizontal: [
    [0, 1],  // Kiri -> Kanan
    [0, -1]  // Kanan -> Kiri
  ],
  vertical: [
    [1, 0]   // Atas -> Bawah
  ],
  diagonal: [
    [1, 1],  // ↘
    [1, -1]  // ↙
  ]
});

export const wordsLevel2 = Object.freeze([
  { id: 1, label: 'Atap', answer: 'ATAP', image: '/images/atap.png', grid: { rows: 4, cols: 4 } },
  { id: 2, label: 'Baju', answer: 'BAJU', image: '/images/baju.png', grid: { rows: 4, cols: 4 } },
  { id: 3, label: 'Cermin', answer: 'CERMIN', image: '/images/cermin.png', grid: { rows: 6, cols: 6 } },
  { id: 4, label: 'Ember', answer: 'EMBER', image: '/images/ember.png', grid: { rows: 5, cols: 5 } },
  { id: 5, label: 'Foto', answer: 'FOTO', image: '/images/foto.png', grid: { rows: 4, cols: 4 } },
  { id: 6, label: 'Gelas', answer: 'GELAS', image: '/images/gelas.png', grid: { rows: 5, cols: 5 } },
  { id: 7, label: 'Handuk', answer: 'HANDUK', image: '/images/handuk.png', grid: { rows: 6, cols: 6 } },
  { id: 8, label: 'Ikan', answer: 'IKAN', image: '/images/ikan.png', grid: { rows: 4, cols: 4 } },
  { id: 9, label: 'Kipas', answer: 'KIPAS', image: '/images/kipas.png', grid: { rows: 5, cols: 5 } },
  { id: 10, label: 'Vas', answer: 'VAS', image: '/images/vas.png', grid: { rows: 3, cols: 3 } },
  { id: 11, label: 'Xilofon', answer: 'XILOFON', image: '/images/xilofon.png', grid: { rows: 7, cols: 7 } },
  { id: 12, label: 'Yoyo', answer: 'YOYO', image: '/images/yoyo.png', grid: { rows: 4, cols: 4 } },
  { id: 13, label: 'Quran', answer: 'QURAN', image: '/images/quran.png', grid: { rows: 5, cols: 5 } },
  { id: 14, label: 'Oven', answer: 'OVEN', image: '/images/oven.png', grid: { rows: 4, cols: 4 } },
]);

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function pickRandom(arr) {
  return arr[randomInt(arr.length)];
}

function createEmptyMatrix(rows, cols) {
  const matrix = new Array(rows);
  for (let r = 0; r < rows; r++) {
    matrix[r] = new Array(cols).fill('');
  }
  return matrix;
}

function isWithinBounds(row, col, rows, cols) {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

function getValidStarts(length, dr, dc, rows, cols) {
  const starts = [];
  const maxEndRow = rows - 1;
  const maxEndCol = cols - 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const endRow = row + dr * (length - 1);
      const endCol = col + dc * (length - 1);

      if (endRow >= 0 && endRow <= maxEndRow && endCol >= 0 && endCol <= maxEndCol) {
        starts.push([row, col]);
      }
    }
  }
  return starts;
}

function fillRandomLetters(matrix, rows, cols) {
  const fillerLen = FILLER_LETTERS.length;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!matrix[row][col]) {
        matrix[row][col] = FILLER_LETTERS[Math.floor(Math.random() * fillerLen)];
      }
    }
  }
}

function getValidDirectionPool(length, rows, cols) {
  const pool = [];
  const entries = Object.entries(ORIENTATION_GROUPS);

  for (let i = 0; i < entries.length; i++) {
    const [orientationName, directions] = entries[i];
    for (let j = 0; j < directions.length; j++) {
      const [dr, dc] = directions[j];
      if (getValidStarts(length, dr, dc, rows, cols).length > 0) {
        pool.push({ orientationName, dr, dc });
      }
    }
  }
  return pool;
}

export function buildLevel2Matrix(answer, grid = { rows: 4, cols: 4 }) {
  const word = answer.toUpperCase().trim();
  const rows = grid.rows || 4;
  const cols = grid.cols || 4;
  const matrix = createEmptyMatrix(rows, cols);

  const directionPool = getValidDirectionPool(word.length, rows, cols);
  if (directionPool.length === 0) {
    throw new Error(`Tidak ada penempatan valid untuk kata "${word}" pada grid ${rows}x${cols}`);
  }

  const { orientationName, dr, dc } = pickRandom(directionPool);
  const starts = getValidStarts(word.length, dr, dc, rows, cols);
  const [startRow, startCol] = pickRandom(starts);

  for (let i = 0; i < word.length; i++) {
    const row = startRow + dr * i;
    const col = startCol + dc * i;
    matrix[row][col] = word[i];
  }

  fillRandomLetters(matrix, rows, cols);

  return {
    matrix,
    placement: {
      orientation: orientationName,
      startRow,
      startCol,
      dr,
      dc
    }
  };
}