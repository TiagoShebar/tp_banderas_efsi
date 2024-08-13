import React, { useEffect, useRef } from 'react';

const HighScores = ({ scoresList }) => {
  const scoresRef = useRef(null);

  // Ordenar la lista de puntuaciones de mayor a menor
  const sortedScores = scoresList.slice().sort((a, b) => b - a);

  useEffect(() => {
    // Desplazar al inicio del componente cuando se actualiza la lista de puntuaciones
    if (scoresRef.current) {
      scoresRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [scoresList]);

  return (
    <ul ref={scoresRef}>
      {sortedScores.map((score, index) => (
        <li key={index}>{score}</li>
      ))}
    </ul>
  );
};

export default HighScores;
