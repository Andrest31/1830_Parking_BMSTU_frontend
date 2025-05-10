import React from 'react';
import './Loader.css'; // Импортируем стили

const Loader = () => {
  // Создаем массив из 20 элементов для span'ов
  const spans = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <section className="preloader-section">
      <div className="preloader">
        {spans.map((i) => (
          <span key={i} style={{ '--i': i } as React.CSSProperties}></span>
        ))}
      </div>
    </section>
  );
};

export default Loader;