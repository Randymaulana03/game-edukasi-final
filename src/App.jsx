import React, { useState } from 'react';
import Hero from './pages/Hero';
import Dashboard from './pages/Dashboard';
import Transition from './pages/Transition';
import GameLevel1 from './pages/GameLevel1';
import GameLevel2 from './pages/GameLevel2';
import GameLevel3 from './pages/GameLevel3'; 

export default function App() {
  const [currentPage, setCurrentPage] = useState('hero');
  const [selectedLevel, setSelectedLevel] = useState(1);

  const handleStart = () => {
    setCurrentPage('dashboard');
  };

  const handleSelectLevel = (levelNumber) => {
    setSelectedLevel(levelNumber);
    setCurrentPage('transition');
  };

  const handleFinishTransition = () => {
    setCurrentPage('game');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  // Fungsi untuk naik ke level berikutnya + masuk halaman Transisi
  const handleNextLevel = () => {
    const nextLvl = selectedLevel + 1;
    if (nextLvl <= 3) {
      setSelectedLevel(nextLvl);
      setCurrentPage('transition'); // Tampilkan halaman transisi level berikutnya
    } else {
      setCurrentPage('dashboard'); // Jika sudah tamat Level 3, kembali ke dashboard
    }
  };

  // Helper untuk menentukan komponen game mana yang tampil
  const renderGameLevel = () => {
    switch (selectedLevel) {
      case 1:
        return (
          <GameLevel1 
            onBackToDashboard={handleBackToDashboard} 
            onFinishLevel={handleNextLevel} 
          />
        );
      case 2:
        return (
          <GameLevel2 
            onBackToDashboard={handleBackToDashboard} 
            onFinishLevel={handleNextLevel} 
          />
        );
      case 3:
        return (
          <GameLevel3 
            onBackToDashboard={handleBackToDashboard} 
          />
        );
      default:
        return <GameLevel1 onBackToDashboard={handleBackToDashboard} />;
    }
  };

  return (
    <div className="app-container">
      {currentPage === 'hero' && (
        <Hero onStart={handleStart} />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard onSelectLevel={handleSelectLevel} />
      )}

      {currentPage === 'transition' && (
        <Transition 
          level={selectedLevel} 
          onFinish={handleFinishTransition} 
        />
      )}

      {currentPage === 'game' && renderGameLevel()}
    </div>
  );
}