import React from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Award } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard({ onSelectLevel }) {
  return (
    <div className="dashboard-container">
      <motion.div 
        className="hero-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="game-subtitle">Pilih Level Permainan untuk Mulai Belajar!</p>

        <div className="level-menu">
          {/* Level 1 Button */}
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="level-btn level-1"
            onClick={() => onSelectLevel(1)}
          >
            <BookOpen size={32} />
            <div>
              <h3>Level 1</h3>
              <span>Mengenal Huruf A - Z</span>
            </div>
          </motion.button>

          {/* Level 2 Button */}
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="level-btn level-2"
            onClick={() => onSelectLevel(2)}
          >
            <Play size={32} />
            <div>
              <h3>Level 2</h3>
              <span>Menghubungkan Huruf</span>
            </div>
          </motion.button>

          {/* Level 3 Button */}
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="level-btn level-3"
            onClick={() => onSelectLevel(3)}
          >
            <Award size={32} />
            <div>
              <h3>Level 3</h3>
              <span>Menyusun Huruf</span>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}