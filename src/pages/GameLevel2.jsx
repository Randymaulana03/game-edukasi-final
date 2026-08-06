import React, { useState, useEffect, useRef, useCallback } from 'react';
import { wordsLevel2 as QUESTION_BANK, buildLevel2Matrix } from '../core/words_Level2';
import { startWord, addLetter, resetWord, getCurrentString } from '../core/WordBuilder';
import { playCorrectSound, playIncorrectSound } from '../core/AudioManager';
import './GameLevel2.css';

export default function GameLevel2({ onNextLevel, onBackToDashboard, onFinishLevel }) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [isWordCorrect, setIsWordCorrect] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', type: '' });
  const [notification, setNotification] = useState({ show: false, isCorrect: false });
  const [matrixData, setMatrixData] = useState({ matrix: [], cols: 4 });

  // State untuk Pop-up Tutorial di awal Level 2
  const [showTutorial, setShowTutorial] = useState(true);

  const isDraggingRef = useRef(false);
  const lastIndexRef = useRef(null);
  const isAnsweredRef = useRef(false);
  const letterRefs = useRef([]);
  const canvasRef = useRef(null);

  const currentQuestion = QUESTION_BANK[currentQuestionIdx];

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const loadQuestion = useCallback((index) => {
    resetWord();
    setIsWordCorrect(false);
    isAnsweredRef.current = false;
    setSelectedIndices([]);
    setFeedback({ text: '', type: '' });
    setNotification({ show: false, isCorrect: false });

    const q = QUESTION_BANK[index];
    if (q) {
      const { matrix } = buildLevel2Matrix(q.answer, q.grid);
      setMatrixData({
        matrix: matrix.flat(),
        cols: q.grid?.cols || 4,
      });
    }

    clearCanvas();
  }, []);

  useEffect(() => {
    loadQuestion(currentQuestionIdx);
  }, [currentQuestionIdx, loadQuestion]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const drawLine = (fromIdx, toIdx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const el1 = letterRefs.current[fromIdx];
    const el2 = letterRefs.current[toIdx];
    if (!el1 || !el2) return;

    const r1 = el1.getBoundingClientRect();
    const r2 = el2.getBoundingClientRect();

    const x1 = r1.left + r1.width / 2;
    const y1 = r1.top + r1.height / 2;
    const x2 = r2.left + r2.width / 2;
    const y2 = r2.top + r2.height / 2;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const triggerNotification = (isCorrect) => {
    setNotification({ show: true, isCorrect });

    setTimeout(() => {
      setNotification({ show: false, isCorrect: false });
    }, 2500);
  };

  const isValidMove = (prevIdx, currIdx) => {
    const cols = matrixData.cols;
    const prevRow = Math.floor(prevIdx / cols);
    const prevCol = prevIdx % cols;
    const currRow = Math.floor(currIdx / cols);
    const currCol = currIdx % cols;

    const rowDiff = currRow - prevRow;
    const colDiff = currCol - prevCol;

    return (
      (rowDiff === 0 && Math.abs(colDiff) === 1) ||
      (rowDiff === 1 && colDiff === 0) ||
      (rowDiff === 1 && Math.abs(colDiff) === 1)
    );
  };

  const handleMouseDown = (letter, index) => {
    if (isAnsweredRef.current) return;
    isDraggingRef.current = true;
    lastIndexRef.current = index;

    startWord(letter);
    setSelectedIndices([index]);
    setFeedback({ text: '', type: '' });
  };

  const handleMouseEnter = (letter, index) => {
    if (!isDraggingRef.current || isAnsweredRef.current) return;
    if (lastIndexRef.current === index) return;

    if (lastIndexRef.current !== null && !isValidMove(lastIndexRef.current, index)) {
      return;
    }

    const correct = addLetter(letter);
    drawLine(lastIndexRef.current, index);

    setSelectedIndices((prev) => [...prev, index]);
    lastIndexRef.current = index;

    if (correct) {
      isAnsweredRef.current = true;
      setIsWordCorrect(true);
      isDraggingRef.current = false;

      triggerNotification(true);
      playCorrectSound();
    }
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (!isAnsweredRef.current) {
      setSelectedIndices([]);
      lastIndexRef.current = null;
      resetWord();
      clearCanvas();

      triggerNotification(false);
      playIncorrectSound();
    }
  };

  const handleReset = () => {
    loadQuestion(currentQuestionIdx);
  };

  const handleNext = () => {
    if (currentQuestionIdx + 1 < QUESTION_BANK.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      // Kata sudah habis -> Panggil handler untuk pindah ke Level 3
      if (onFinishLevel) {
        onFinishLevel();
      }
    }
  };

  return (
    <div className="level2-body" onMouseUp={handleMouseUp}>
      <canvas
        ref={canvasRef}
        id="lineCanvas"
        style={{ pointerEvents: 'none' }}
        className={selectedIndices.length > 0 ? 'show' : ''}
      />

      <main className="game-container">
        <header className="top-bar">
          <h1>Level 2 - Menghubungkan Huruf</h1>

          <button
            type="button"
            className="home-btn-img"
            onClick={onBackToDashboard}
            aria-label="Kembali ke Dashboard"
          >
            <img
              src="/images/back3.PNG"
              alt="Tombol Kembali"
              className="back-img"
              loading="lazy"
            />
          </button>
        </header>

        <div className="game-content">
          {/* Panel Kiri (Grid Huruf) */}
          <div className="left-panel">
            <div
              className="grid-container"
              style={{ gridTemplateColumns: `repeat(${matrixData.cols}, minmax(60px, 1fr))` }}
            >
              {matrixData.matrix.map((char, idx) => {
                const isSelected = selectedIndices.includes(idx);
                return (
                  <button
                    key={idx}
                    ref={(el) => (letterRefs.current[idx] = el)}
                    type="button"
                    className={`letter ${isSelected ? 'active' : ''} ${isSelected && isWordCorrect ? 'correct' : ''}`}
                    onMouseDown={() => handleMouseDown(char, idx)}
                    onMouseEnter={() => handleMouseEnter(char, idx)}
                  >
                    {char}
                  </button>
                );
              })}
            </div>

            <div className={`feedback ${feedback.type}`}>
              {feedback.text}
            </div>
          </div>

          {/* Panel Kanan (Gambar Target & Status) */}
          <div className="right-panel">
            <div className="target-image">
              <img
                src={currentQuestion?.image}
                alt={currentQuestion?.label}
                loading="lazy"
              />
            </div>

            <div className="current-word">
              {getCurrentString() || currentQuestion?.label?.toUpperCase()}
            </div>

            <div className="controls">
              <button type="button" className="btn-action" onClick={handleReset}>
                Reset
              </button>
              {isWordCorrect && (
                <button
                  type="button"
                  className="btn-next-img"
                  onClick={handleNext}
                  aria-label={currentQuestionIdx + 1 < QUESTION_BANK.length ? 'Soal Berikutnya' : 'Ke Level 3'}
                >
                  <img
                    src="/images/next.PNG"
                    alt="Lanjut"
                    className="next-img"
                    loading="lazy"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* POP-UP TUTORIAL VIDEO LEVEL 2 */}
      {showTutorial && (
        <div className="notification-overlay">
          <div className="tutorial-modal">
            <h2>Cara Bermain Level 2</h2>
            <div className="tutorial-video-wrapper">
              <video 
                className="tutorial-video" 
                autoPlay 
                muted 
                playsInline
                onEnded={(e) => e.target.pause()}
              >
                <source src="/assets/gift/tutorial_lvl2.mp4" type="video/mp4" />
                <source src="/assets/gift/tutorial_lvl2.mov" type="video/quicktime" />
              </video>
            </div>
            <button 
              type="button" 
              className="btn-next-img tutorial-next-btn" 
              onClick={() => setShowTutorial(false)}
            >
              <img src="/images/next.PNG" alt="Mulai Soal" className="next-img" />
            </button>
          </div>
        </div>
      )}

      {/* Pop-up Video Notifikasi (Benar/Salah) */}
      {notification.show && (
        <div className="notification-overlay">
          <div className={`notification-box ${notification.isCorrect ? 'correct' : 'incorrect'}`}>
            <video className={notification.isCorrect ? "success-video" : "fail-video"} autoPlay muted playsInline>
              <source src={notification.isCorrect ? "/assets/gift/benar.mp4" : "/assets/gift/salah.mp4"} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </div>
  );
}