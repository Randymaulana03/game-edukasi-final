import React, { useState, useEffect, useCallback, useRef } from 'react';
import { wordsLevel3 as QUESTION_BANK, buildLevel3Letters } from '../data/Word_Level3';
import { setInitialLetters, updateArrangement, getCurrentWord } from '../core/ArrangeManager';
import { playCorrectSound } from '../core/AudioManager';
import './GameLevel3.css';

export default function GameLevel3({ onFinishGame, onBackToDashboard }) {
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [currentOrder, setCurrentOrder] = useState([]);
    const [isWordCorrect, setIsWordCorrect] = useState(false);
    const [feedback, setFeedback] = useState({ text: '', type: '' });
    const [notification, setNotification] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // State & Ref
    const [showTutorial, setShowTutorial] = useState(true);
    const [draggedIdx, setDraggedIdx] = useState(null);

    const initialLettersRef = useRef([]);
    const activePointerIdRef = useRef(null);
    const dragStartIdxRef = useRef(null);
    const notificationTimerRef = useRef(null);

    const currentQuestion = QUESTION_BANK[currentQuestionIdx];

    // Cleanup Timer Notifikasi saat Komponen Unmount
    useEffect(() => {
        return () => {
            if (notificationTimerRef.current) {
                clearTimeout(notificationTimerRef.current);
            }
        };
    }, []);

    // Load Soal Berdasarkan Index
    const loadQuestion = useCallback((index) => {
        setIsWordCorrect(false);
        setFeedback({ text: '', type: '' });
        setNotification(false);

        const q = QUESTION_BANK[index];
        if (q) {
            const letters = buildLevel3Letters(q.answer);
            initialLettersRef.current = letters;
            setCurrentOrder(letters);
            setInitialLetters(letters);
        }
    }, []);

    useEffect(() => {
        loadQuestion(currentQuestionIdx);
    }, [currentQuestionIdx, loadQuestion]);

    // Trigger Pop-up Notifikasi & Suara Benar
    const triggerNotification = useCallback(() => {
        setNotification(true);
        try {
            playCorrectSound();
        } catch (err) {
            console.warn('Audio play blocked:', err);
        }

        if (notificationTimerRef.current) {
            clearTimeout(notificationTimerRef.current);
        }

        notificationTimerRef.current = setTimeout(() => {
            setNotification(false);
        }, 2500);
    }, []);

    // Swap Posisi Huruf
    const swapLetters = useCallback((fromIdx, toIdx) => {
        if (fromIdx === null || toIdx === null || fromIdx === toIdx) return;

        setCurrentOrder((prevOrder) => {
            const newOrder = [...prevOrder];
            const temp = newOrder[fromIdx];
            newOrder[fromIdx] = newOrder[toIdx];
            newOrder[toIdx] = temp;

            const isCorrect = updateArrangement(newOrder);
            if (isCorrect) {
                setIsWordCorrect(true);
                setFeedback({ text: `${getCurrentWord()}`, type: 'ok' });
                triggerNotification();
            }

            return newOrder;
        });
    }, [triggerNotification]);

    // Pointer Event Handlers untuk Drag and Drop / Touch
    const handlePointerDown = useCallback((e, index) => {
        if (e.button !== undefined && e.button !== 0) return;

        activePointerIdRef.current = e.pointerId;
        dragStartIdxRef.current = index;
        setDraggedIdx(index);

        if (e.target.setPointerCapture) {
            try {
                e.target.setPointerCapture(e.pointerId);
            } catch (err) {
                // Ignore capture errors
            }
        }
    }, []);

    const handlePointerUp = useCallback((e) => {
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
    }, [swapLetters]);

    // Action Handlers
    const handleReset = useCallback(() => {
        const letters = initialLettersRef.current;
        setCurrentOrder([...letters]);
        setIsWordCorrect(false);
        setFeedback({ text: '', type: '' });
        setInitialLetters(letters);
    }, []);

    const handleNext = useCallback(() => {
        if (currentQuestionIdx + 1 < QUESTION_BANK.length) {
            setCurrentQuestionIdx((prev) => prev + 1);
        } else {
            setIsFinished(true);
            if (onFinishGame) {
                onFinishGame();
            }
        }
    }, [currentQuestionIdx, onFinishGame]);

    const handleRestart = useCallback(() => {
        setCurrentQuestionIdx(0);
        setIsFinished(false);
    }, []);

    // 1. END SCREEN (GAMEPLAY SELESAI)
    if (isFinished) {
        return (
            <div className="level3-body end-screen-fullscreen">
                <img 
                    src="/images/endscreen.png" 
                    alt="Level Completed" 
                    className="end-banner-img-full" 
                />

                <div className="end-actions-full">
                    <button 
                        type="button" 
                        className="end-btn" 
                        onClick={onBackToDashboard}
                        aria-label="Kembali ke Dashboard"
                    >
                        <img src="/images/back.PNG" alt="Kembali" className="end-btn-icon" />
                    </button>

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

    // 2. TAMPILAN GAMEPLAY UTAMA
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
                            <img src={currentQuestion?.image} alt={currentQuestion?.label || 'Target'} />
                        </div>
                    </div>

                    <div className="right">
                        <div className="letters">
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