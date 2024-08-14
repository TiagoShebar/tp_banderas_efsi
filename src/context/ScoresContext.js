"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const ScoresContext = createContext();

// Crear el proveedor del contexto
export const ScoresProvider = ({ children }) => {
  // Inicializar el estado desde localStorage
  const initialScores = JSON.parse(localStorage.getItem("HighScores")) || [];
  const [scoresGlobal, setScoresGlobal] = useState(initialScores);

  useEffect(() => {
    // Guardar `scoresGlobal` en el localStorage cada vez que cambie
    localStorage.setItem("HighScores", JSON.stringify(scoresGlobal));
  }, [scoresGlobal]);

  return (
    <ScoresContext.Provider value={{ scoresGlobal, setScoresGlobal }}>
      {children}
    </ScoresContext.Provider>
  );
};

// Hook para usar el contexto
export const useScores = () => useContext(ScoresContext);
