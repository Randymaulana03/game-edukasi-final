import React, { useState, useEffect, useCallback, useRef } from 'react';
import { wordsLevel3 as QUESTION_BANK, buildLevel3Letters } from '../data/Word_Level3';
import { setInitialLetters, updateArrangement, getCurrentWord } from '../core/ArrangeManager';
import { playCorrectSound } from '../core/AudioManager';
import './GameLevel3.css';

export default function GameLevel3({ onFinishGame, onBackToDashboard }) {
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [currentOrder, setCurrentOrder] = useState([]);
    const [initialLetters, setInitialLettersState] = useState([]);
    const [isWordCorrect, setIsWordCorrect] = useState(false);
    const [feedback, setFeedback] = useState({ text: '', type: '' });
    const [notification, setNotification] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // State untuk Pop-up Tutorial
    const [showTutorial, setShowTutorial] = useState(true);

    const [draggedIdx, setDraggedIdx] = useState(null);
    const activePointerIdRef = useRef(null);
    const dragStartIdxRef = useRef(null);

    const currentQuestion = QUESTION_BANK[currentQuestionIdx];

    const loadQuestion = useCallback((index) => {
        setIsWordCorrect(false);
        setFeedback({ text: '', type: '' });
        setNotification(false);

        const q = QUESTION_BANK[index];
        if (q) {
            const letters = buildLevel3Letters(q.answer);
            setInitialLettersState(letters);
            setCurrentOrder(letters);
            setInitialLetters(letters);
        }
    }, []);

    useEffect(() => {
        loadQuestion(currentQuestionIdx);
    }, [currentQuestionIdx, loadQuestion]);

    const triggerNotification = () => {
        setNotification(true);
        try {
            playCorrectSound();
        } catch (err) {
            console.log('Audio play blocked:', err);
        }

        setTimeout(() => {
            setNotification(false);
        }, 2500);
    };

    const swapLetters = (fromIdx, toIdx) => {
        if (fromIdx === null || toIdx === null || fromIdx === toIdx) return;

        const newOrder = [...currentOrder];
        const temp = newOrder[fromIdx];
        newOrder[fromIdx] = newOrder[toIdx];
        newOrder[toIdx] = temp;

        setCurrentOrder(newOrder);

        const isCorrect = updateArrangement(newOrder);
        if (isCorrect) {
            setIsWordCorrect(true);
            setFeedback({ text: `${getCurrentWord()}`, type: 'ok' });
            triggerNotification();
        }
    };

    const handlePointerDown = (e, index) => {
        if (e.button !== undefined && e.button !== 0) return;

        activePointerIdRef.current = e.pointerId;
        dragStartIdxRef.current = index;
        setDraggedIdx(index);

        if (e.target.setPointerCapture) {
            e.target.setPointerCapture(e.pointerId);
        }
    };

    const handlePointerUp = (e) => {
        if (dragStartIdxRef.current === null) return;

        const targetElement = document.elementFromPoint(e.clientX, e.clientY);
        const letterBtn = targetElement?.closest('.letter-btn');

        if (letterBtn) {
            const targetIdx = Number(letterBtn.getAttribute('data-index'));
            if (!isNaN(targetIdx)) {
                swapLetters(dragStartIdxRef.current, targetIdx);
            }
        }

        if (e.target.releasePointerCapture && activePointerIdRef.current !== null) {
            try {
                e.target.releasePointerCapture(activePointerIdRef.current);
            } catch (err) {
                // Ignore capture release errors
            }
        }

        dragStartIdxRef.current = null;
        activePointerIdRef.current = null;
        setDraggedIdx(null);
    };

    const handleReset = () => {
        setCurrentOrder([...initialLetters]);
        setIsWordCorrect(false);
        setFeedback({ text: '', type: '' });
        setInitialLetters(initialLetters);
    };

    const handleNext = () => {
  if (currentQuestionIdx + 1 < QUESTION_BANK.length) {
    // Jika masih ada kata berikutnya di Level 3
    setCurrentQuestionIdx((prev) => prev + 1);
  } else {
    // Jika kata di Level 3 sudah habis -> tampilkan end screen
    setIsFinished(true);
    
    // Opsi: Panggil callback jika App.jsx perlu tahu game sudah selesai
    if (onFinishGame) {
      onFinishGame();
    }
  }
};

    const handleRestart = () => {
        setCurrentQuestionIdx(0);
        setIsFinished(false);
    };

    // 1. JIKA GAME SELESAI -> TAMPILKAN END SCREEN
    // 1. JIKA GAME SELESAI -> TAMPILKAN END SCREEN FULL SCREEN
if (isFinished) {
    return (
        <div className="level3-body end-screen-fullscreen">
            {/* Gambar Banner End Screen Utama */}
            <img 
                src="/images/endscreen.png" 
                alt="Level Completed" 
                className="end-banner-img-full" 
            />

            {/* Tombol Aksi */}
            <div className="end-actions-full">
                {/* Tombol Back ke Dashboard */}
                <button 
                    type="button" 
                    className="end-btn" 
                    onClick={onBackToDashboard}
                    aria-label="Kembali ke Dashboard"
                >
                    <img src="/images/back.PNG" alt="Kembali" className="end-btn-icon" />
                </button>

                {/* Tombol Main Lagi */}
                <button 
                    type="button" 
                    className="end-btn" 
                    onClick={handleRestart}
                    aria-label="Main Lagi"
                >
                    <img src="/images/replay.png" alt="Main Lagi" className="end-btn-icon" />
                </button>
            </div>
        </div>
    );
}

    // 2. JIKA BELUM SELESAI -> TAMPILKAN GAMEPLAY UTAMA
    return (
        <div className="level3-body">
            <main className="game-shell">
                <header className="header">
                    <h1>Level 3 - Menyusun Huruf</h1>
                    <button 
                        type="button" 
                        className="home-btn-img" 
                        onClick={onBackToDashboard}
                        aria-label="Kembali ke Dashboard"
                    >
                        <img src="/images/back3.PNG" alt="Tombol Kembali" className="back-img" />
                    </button>
                </header>

                <section className="layout">
                    <div className="left">
                        <div className="target-image">
                            <img src={currentQuestion?.image} alt={currentQuestion?.label} />
                        </div>
                    </div>

                    <div className="right">
                        <div className="letters" >
                            {currentOrder.map((letter, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    data-index={idx}
                                    className={`letter-btn ${draggedIdx === idx ? 'dragging' : ''}`}
                                    onPointerDown={(e) => handlePointerDown(e, idx)}
                                    onPointerUp={handlePointerUp}
                                >
                                    {letter}
                                </button>
                            ))}
                        </div>

                        <div className={`feedback ${feedback.type}`}>{feedback.text}</div>

                        <div className="controls">
                            <button type="button" className="btn btn-large" onClick={handleReset}>
                                Reset
                            </button>

                            {isWordCorrect && (
                                <button type="button" className="btn-next-img" onClick={handleNext}>
                                    <img src="/images/next.PNG" alt="Lanjut" className="next-img" />
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* POP-UP TUTORIAL VIDEO LEVEL 3 */}
            {showTutorial && (
                <div className="notification-overlay">
                    <div className="tutorial-modal">
                        <h2>Cara Bermain Level 3</h2>
                        <div className="tutorial-video-wrapper">
                            <video 
                                className="tutorial-video" 
                                autoPlay 
                                muted 
                                playsInline
                                onEnded={(e) => e.target.pause()}
                            >
                                <source src="/assets/gift/tutorial_lvl3.mov" type="video/quicktime" />
                                <source src="/assets/gift/tutorial_lvl3.mp4" type="video/mp4" />
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

            {/* POP-UP NOTIFIKASI BENAR */}
            {notification && (
                <div className="notification-overlay">
                    <div className="notification-box correct">
                        <video className="success-video" autoPlay muted playsInline>
                            <source src="/assets/gift/benar.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            )}
        </div>
    );
}