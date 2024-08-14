"use client";

import React from 'react';
import Game from "../pages/Game"; // Asegúrate de que la ruta sea correcta
import { useScores } from "../context/ScoresContext";

export default function Home() {
  const { scoresGlobal, setScoresGlobal } = useScores();

  return (
    <main>
      <Game setScoresGlobal={setScoresGlobal} />
    </main>
  );
}



