"use client";

import React, { useState, useEffect } from 'react';

const HighScores = () => {
    const [highScores, setHighScores] = useState([]);

    useEffect(() => {
        const fetchHighScores = () => {
            const scoresString = localStorage.getItem('tp-banderas');
            const scores = scoresString ? JSON.parse(scoresString) : {};

            // Convertir el objeto a un array de [nombre, puntaje] y ordenar por puntaje
            const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

            setHighScores(sortedScores);
        };

        fetchHighScores();
    }, []);

    return (
        <div>
            <h1>High Scores</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nombre de Usuario</th>
                        <th>Puntaje</th>
                    </tr>
                </thead>
                <tbody>
                    {highScores.map(([name, score]) => (
                        <tr key={name}>
                            <td>{name}</td>
                            <td>{score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HighScores;


