"use client";

import React, { useState, useEffect } from 'react';
import Game from "../pages/Game";

export default function Home() {
  const [userNames, setUserNames] = useState([]);

  useEffect(() => {
    const fetchUserNames = () => {
      const retrievedScoresString = localStorage.getItem('tp-banderas');
      const retrievedScores = JSON.parse(retrievedScoresString);
      if (retrievedScores) {
        setUserNames(Object.keys(retrievedScores));
      }
    };

    fetchUserNames();
  }, []);

  return (
    <>
      <main>
        <Game existingUserNames={userNames} />
      </main>
    </>
  );
}




