"use client";

import React, { useEffect, useRef } from 'react';
import { useScores } from '../../context/ScoresContext';

const HighScoresView = () => {
  const { scoresGlobal } = useScores();
  const scoresRef = useRef(null);

  // Ordenar la lista de puntuaciones de mayor a menor
  const sortedScores = scoresGlobal.slice().sort((a, b) => b - a);

  useEffect(() => {
    // Desplazar al inicio del componente cuando se actualiza la lista de puntuaciones
    if (scoresRef.current) {
      scoresRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [scoresGlobal]);

  return (
    <ul ref={scoresRef}>
      {sortedScores.map((score, index) => (
        <li key={index}>{score}</li>
      ))}
    </ul>
  );
};

export default HighScoresView;

