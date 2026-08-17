import { Howl, Howler } from 'howler';
import { letters } from '../data/letters.js';

const sounds = new Map();
let correctSound = null;
let incorrectSound = null;

/**
 * Memastikan AudioContext aktif (diperlukan untuk kebijakan Autoplay browser modern/mobile)
 */
function ensureAudioContext() {
  if (Howler.ctx && Howler.ctx.state === 'suspended') {
    Howler.ctx.resume().catch((err) => {
      console.warn('Gagal meresume AudioContext:', err);
    });
  }
}

/**
 * Memutar suara per huruf A-Z (Lazy Load dengan Map Cache)
 */
export function playLetterSound(letter) {
  if (!letter) return;
  const upper = letter.toUpperCase();

  ensureAudioContext();

  let sound = sounds.get(upper);

  if (!sound) {
    const src = letters[upper];
    if (!src) return;

    sound = new Howl({
      src: [src],
      volume: 1.0,
      html5: false, // Gunakan Web Audio API untuk latensi rendah
      onloaderror: (id, err) => {
        console.warn(`Gagal memuat suara untuk huruf ${upper}:`, err);
      }
    });

    sounds.set(upper, sound);
  }

  // Hentikan suara yang sedang berputar pada instance huruf ini lalu mainkan dari awal
  sound.stop();
  sound.play();
}

/**
 * Memutar Suara Benar
 */
export function playCorrectSound() {
  ensureAudioContext();

  if (!correctSound) {
    correctSound = new Howl({
      src: ['/audio/benar-lv3.mpeg'],
      volume: 1.0,
      sprite: {
        potong: [0, 2500] // Memutar 2.5 detik pertama
      },
      onloaderror: (id, err) => {
        console.warn('Gagal memuat suara benar:', err);
      }
    });
  }

  // Reset & replay agar suara terasa langsung merespon
  correctSound.stop();
  correctSound.play('potong');
}

/**
 * Memutar Suara Salah
 */
export function playIncorrectSound() {
  ensureAudioContext();

  if (!incorrectSound) {
    incorrectSound = new Howl({
      src: ['/audio/Salah.mp3'],
      volume: 1.0,
      onloaderror: (id, err) => {
        console.warn('Gagal memuat suara salah:', err);
      }
    });
  }

  // Reset & replay agar suara terasa langsung merespon
  incorrectSound.stop();
  incorrectSound.play();
}

/**
 * Membersihkan seluruh instance Howl dari memori (Opsional, untuk unmount/cleanup global)
 */
export function unloadAllSounds() {
  sounds.forEach((sound) => sound.unload());
  sounds.clear();

  if (correctSound) {
    correctSound.unload();
    correctSound = null;
  }

  if (incorrectSound) {
    incorrectSound.unload();
    incorrectSound = null;
  }
}