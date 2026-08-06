import { Howl, Howler } from 'howler';
import { letters } from '../data/letters.js';

const sounds = {};
let correctSound = null;
let incorrectSound = null;

// Memutar suara per huruf A-Z (Lazy Load)
export function playLetterSound(letter) {
  if (!letter) return;
  const upper = letter.toUpperCase();

  if (!sounds[upper]) {
    const src = letters[upper];
    if (!src) return;

    sounds[upper] = new Howl({
      src: [src],
      volume: 1.0,
      html5: false // True Audio Web API
    });
  }

  if (Howler.ctx && Howler.ctx.state === 'suspended') {
    Howler.ctx.resume();
  }

  sounds[upper].play();
}

// Memutar Suara Benar
export function playCorrectSound() {
  if (Howler.ctx && Howler.ctx.state === 'suspended') {
    Howler.ctx.resume();
  }

  if (!correctSound) {
    correctSound = new Howl({
      src: ['/audio/benar-lv3.mpeg'],
      volume: 1.0,
      sprite: {
        potong: [0, 2500] // Memutar 2.5 detik
      }
    });
  }

  if (correctSound.playing()) return;

  correctSound.play('potong');
}

// Memutar Suara Salah
export function playIncorrectSound() {
  if (Howler.ctx && Howler.ctx.state === 'suspended') {
    Howler.ctx.resume();
  }

  if (!incorrectSound) {
    incorrectSound = new Howl({
      src: ['/audio/Salah.mp3'],
      volume: 1.0
    });
  }

  if (incorrectSound.playing()) return;

  incorrectSound.play();
}   