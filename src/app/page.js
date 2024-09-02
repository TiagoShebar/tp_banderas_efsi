"use client";

import React, { useState, useEffect } from 'react';
import Game from "../pages/Game"; // Asegúrate de que la ruta sea correcta
import { useScores } from "../context/ScoresContext";
import NavBar from '@/components/NavBar';

export default function Home() {
  const { scoresGlobal, setScoresGlobal } = useScores();
  const [userNames, setUserNames] = useState([]);

  useEffect(() => {
    const fetchUserNames = () => {
      const retrievedScoresString = localStorage.getItem('tp-banderas');
      const retrievedScores = JSON.parse(retrievedScoresString);
      if (retrievedScores) {
        // Extraer solo las claves (nombres de usuario)
        setUserNames(Object.keys(retrievedScores));
      }
    };

    fetchUserNames();
  }, []);

  return (
    <>
      <NavBar />
      <main>
        <Game existingUserNames={userNames} />
      </main>
    </>
  );
}




