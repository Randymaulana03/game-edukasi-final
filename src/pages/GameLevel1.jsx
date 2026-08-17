import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { letters } from '../data/letters';
import { playLetterSound } from '../core/AudioManager';
import './GameLevel1.css';

// Palette warna background & teks presisi 26 huruf (Statis di luar komponen)
const LETTER_COLORS = [
  { bg: '#ff7675', text: '#d63031' }, // Aa
  { bg: '#8c7ae6', text: '#bae776' }, // Bb
  { bg: '#78e08f', text: '#2c3e50' }, // Cc
  { bg: '#ff4d4d', text: '#006266' }, // Dd
  { bg: '#b8e994', text: '#e997e9' }, // Ee
  { bg: '#192a56', text: '#eccc68' }, // Ff
  { bg: '#2ed573', text: '#ffffff' }, // Gg
  { bg: '#e84118', text: '#f5cd79' }, // Hh
  { bg: '#e1b12c', text: '#00a8ff' }, // Ii
  { bg: '#44bd32', text: '#f5cd79' }, // Jj
  { bg: '#fbc531', text: '#e84118' }, // Kk
  { bg: '#9c88ff', text: '#ffffff' }, // Ll
  { bg: '#00d2d3', text: '#192a56' }, // Mm
  { bg: '#10ac84', text: '#ffffff' }, // Nn
  { bg: '#ee5253', text: '#5f27cd' }, // Oo
  { bg: '#c8d6e5', text: '#000000' }, // Pp
  { bg: '#feca57', text: '#10ac84' }, // Qq
  { bg: '#ff6b6b', text: '#feca57' }, // Rr
  { bg: '#54a0ff', text: '#ffffff' }, // Ss
  { bg: '#5f27cd', text: '#feca57' }, // Tt
  { bg: '#ff9ff3', text: '#000000' }, // Uu
  { bg: '#341f97', text: '#ff9ff3' }, // Vv
  { bg: '#ff007f', text: '#192a56' }, // Ww
  { bg: '#00d2d3', text: '#000000' }, // Xx
  { bg: '#f3a683', text: '#ff007f' }, // Yy
  { bg: '#ff4757', text: '#2ed573' }, // Zz
];

const DEFAULT_COLOR = { bg: '#ff7675', text: '#ffffff' };

export default function GameLevel1({ onBackToDashboard }) {
  const [activeLetter, setActiveLetter] = useState(null);
  const activeTimerRef = useRef(null);

  // Memoisasi list alfabet dari data huruf
  const alphabetList = useMemo(() => Object.keys(letters), []);

  // Cleanup Timer saat Unmount
  useEffect(() => {
    return () => {
      if (activeTimerRef.current) {
        clearTimeout(activeTimerRef.current);
      }
    };
  }, []);

  // Handler Play Audio + Visual Feedback
  const playAudio = useCallback((letter) => {
    setActiveLetter(letter);

    try {
      playLetterSound(letter);
    } catch (err) {
      console.warn('Gagal memutar suara huruf:', err);
    }

    if (activeTimerRef.current) {
      clearTimeout(activeTimerRef.current);
    }

    activeTimerRef.current = setTimeout(() => {
      setActiveLetter(null);
    }, 200);
  }, []);

  return (
    <div className="level1-body">
      <main className="game-wrap" aria-label="Permainan mengenal huruf A sampai Z">
        <header className="top-bar">
          <h1>Level 1 - Mengenal Huruf A-Z</h1>
          <p className="status" id="voiceStatus">
            Klik salah satu huruf untuk mendengarkan suaranya
          </p>

          <button 
            type="button"
            className="home-btn-img" 
            onClick={onBackToDashboard}
            aria-label="Kembali ke Dashboard"
          >
            <img 
              src="/images/back.PNG" 
              alt="Tombol Kembali" 
              className="back-img" 
              loading="lazy"
            />
          </button>
        </header>

        <section className="letters-grid">
          {alphabetList.map((char, index) => {
            const displayChar = `${char.toUpperCase()}${char.toLowerCase()}`;
            const color = LETTER_COLORS[index] || DEFAULT_COLOR;

            return (
              <button
                key={char}
                type="button"
                className={`letter-btn ${activeLetter === char ? 'active' : ''} ${char === 'Y' ? 'letter-y' : ''} ${char === 'Z' ? 'letter-z' : ''}`}
                style={{ 
                  animationDelay: `${index * 0.02}s`,
                  '--btn-bg-custom': color.bg,
                  '--btn-text-custom': color.text
                }}
                onClick={() => playAudio(char)}
              >
                <span className="letter-text">{displayChar}</span>
              </button>
            );
          })}
        </section>
      </main>
    </div>
  );
}