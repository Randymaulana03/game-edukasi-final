import React, { useEffect, useState } from 'react';
import './Transition.css';

export default function Transition({ level, onFinish }) {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onFinish]);

  return (
    /* Pasang class level di container utama agar variabel warna shadow otomatis dipakai seluruh pill */
    <main className={`stage level-${level}`}>
      <section className="pill level">
        LEVEL {level}
      </section>

      <section className="pill topic">
        {level === 1 ? 'Mengenal Huruf' : level === 2 ? 'Menghubungkan Huruf' : 'Menyusun Huruf'}
      </section>
      
      <p className="hint">
        Bersiap... permainan dimulai dalam <strong>{timeLeft}</strong> detik
      </p>
    </main>
  );
}