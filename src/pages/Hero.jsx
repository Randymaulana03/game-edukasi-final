import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

export default function Hero({ onStart }) {
  return (
    <header className="hero-container">
      {/* Gambar Hero Utama */}
      <img 
        src="/images/cover.JPG.jpeg" 
        alt="Hero Image" 
        className="hero-image" 
        loading="lazy"
      />

      {/* Tombol Start dengan Koordinat Centering Framer Motion */}
      <motion.img 
        src="/images/start.jpg.jpeg" 
        alt="Start Button" 
        className="start-button"
        loading="lazy"
        initial={{ x: "-50%", y: "-50%", scale: 1 }}
        whileHover={{ x: "-50%", y: "-50%", scale: 1.08, filter: 'brightness(1.15)' }}
        whileTap={{ x: "-50%", y: "-50%", scale: 0.95 }}
        onClick={onStart}
      />
    </header>
  );
}