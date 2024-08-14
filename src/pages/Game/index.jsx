"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useScores } from '../../context/ScoresContext';

const Game = () => {
    const router = useRouter();
    const { scoresGlobal, setScoresGlobal } = useScores();
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [userGuess, setUserGuess] = useState('');
    const [message, setMessage] = useState('');
    const [score, setScore] = useState(0);
    const timerRef = useRef(null); // Ref para manejar el temporizador

    useEffect(() => {
        // Función para recuperar los datos de la API
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images');
                const data = await response.json();
                setCountries(data.data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        fetchCountries();
    }, []);

    useEffect(() => {
        if (countries.length === 0) {
            setScoresGlobal([...scoresGlobal, score]); // Actualiza el estado global con el nuevo score
            router.push('/HighScores');
            return; // Asegurarse de no ejecutar más lógica cuando el array está vacío
        }

        // Seleccionar un nuevo país y configurar el temporizador
        pickCountry();
        
        // Limpiar el temporizador si el componente se desmonta
        return () => clearTimeout(timerRef.current);
    }, [countries]);

    const pickCountry = () => {
        if (countries.length > 0) {
            const randomIndex = Math.floor(Math.random() * countries.length);
            const newCountry = countries[randomIndex];
            setSelectedCountry(newCountry);
            setCountries(prevCountries => prevCountries.filter(country => country !== newCountry));

            // Reiniciar el temporizador de 10 segundos
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                pickCountry(); // Cambiar de país después de 10 segundos
            }, 10000); // Espera 10 segundos
        }
    };

    const handleInputChange = (e) => {
        setUserGuess(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userGuess.toLowerCase() === selectedCountry.name.toLowerCase()) {
            setScore(prevScore => prevScore + 10);
            setMessage('¡Correcto! Has adivinado el país.');
        } else {
            setScore(prevScore => prevScore - 1);
            setMessage(`Incorrecto. La respuesta correcta es ${selectedCountry.name}.`);
        }
        setUserGuess('');

        // Seleccionar un nuevo país inmediatamente cuando el usuario hace un intento
        pickCountry();
    };

    return (
        <div>
            <h1>Flag Quiz</h1>
            {selectedCountry ? (
                <div>
                    <h2>Adivina el país de esta bandera:</h2>
                    <img src={selectedCountry.flag} alt={`Flag of ${selectedCountry.name}`} width="200" />
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={userGuess}
                            onChange={handleInputChange}
                            placeholder="Escribe el nombre del país"
                        />
                        <button type="submit">Comprobar</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            ) : (
                <p>Cargando datos o no hay más países para mostrar...</p>
            )}
        </div>
    );
};

export default Game;
