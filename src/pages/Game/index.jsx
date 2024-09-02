"use client";
import "./styleGame.css";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const Game = ({ existingUserNames }) => {
    const router = useRouter();

    const [userName, setUserName] = useState('');
    const [gameScore, setGameScore] = useState(0);
    const [countries, setCountries] = useState([]);
    const [countriesIndexPassed, setCountriesIndexPassed] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [userGuess, setUserGuess] = useState('');
    const [message, setMessage] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(10);
    const [isNameTaken, setIsNameTaken] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
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
        if (countries.length && gameStarted) {
            nextFlag();
        }
    }, [countries, gameStarted]);

    useEffect(() => {
        if (gameStarted) {
            if (timeRemaining <= 0) {
                nextFlag();
            } else {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
                timerRef.current = setInterval(() => {
                    setTimeRemaining((prevTime) => prevTime - 1);
                }, 1000);
            }

            return () => {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
            };
        }
    }, [timeRemaining, gameStarted]);

    const handleInputChange = (event) => {
        setUserGuess(event.target.value);
    };

    const handleUserNameChange = (event) => {
        setUserName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (existingUserNames.includes(userName)) {
            setIsNameTaken(true);
        } else {
            setIsNameTaken(false);
            setGameStarted(true);
        }
    };

    const checkAnswer = () => {
        if (userGuess.toLowerCase() === selectedCountry.name.toLowerCase()) {
            setMessage('¡Correcto!');
            setGameScore((prevScore) => prevScore + 10 + timeRemaining);
        } else {
            setMessage('¡Incorrecto!');
            setGameScore((prevScore) => prevScore - 1);
        }
        
        nextFlag();
    };

    const nextFlag = () => {
        console.log(countriesIndexPassed);
        let randomNum;
        do {
            randomNum = Math.floor(Math.random() * countries.length);
        } while (countriesIndexPassed.includes(randomNum));
        setCountriesIndexPassed((prev) => [...prev, randomNum]);
        setSelectedCountry(countries[randomNum]);
        setUserGuess('');
        setMessage('');
        setTimeRemaining(15);
    };

    const handleEndGame = () => {
        if (userName) {
            let ownScore = { [userName]: gameScore };
            const scoresString = localStorage.getItem('tp-banderas');
            const scores = scoresString ? JSON.parse(scoresString) : {};
            Object.assign(scores, ownScore);
            localStorage.setItem('tp-banderas', JSON.stringify(scores));

            
            router.push('/HighScores');
        }
    };

    return (
        <div>
            {!gameStarted ? (
                <form onSubmit={handleSubmit}>
                    <label>
                        Nombre de Usuario:
                        <input
                            type="text"
                            value={userName}
                            onChange={handleUserNameChange}
                            required
                        />
                    </label>
                    <button type="submit">Iniciar Juego</button>
                    {isNameTaken && <p>Este nombre de usuario ya está en uso. Por favor elige otro.</p>}
                </form>
            ) : (
                <>
                    <div>Tiempo Restante: {timeRemaining}s</div>
                    <div>Puntaje: {gameScore}</div>
                    {selectedCountry && (
                        <div>
                            <h2>Adivina el país de esta bandera:</h2>
                            <img src={selectedCountry.flag} alt={`Flag of ${selectedCountry.name}`} width="200" />
                            <form onSubmit={(event) => {
                                event.preventDefault();
                                checkAnswer();
                            }}>
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
                    )}
                    <button onClick={handleEndGame}>Finalizar Juego</button>
                </>
            )}
        </div>
    );
};

export default Game;

/*Si el temporizador termina antes de que el usuario adivine, los segundos
restantes suman puntos.??

Por las dudas aclaro que lo entendí como que era al reves, es decir: si el usuario adivina antes de que el temporizador termine entonces los segundos restantes suman como puntos. 
Porque de la otra forma no tendría logica porque no hay segundos restantes si el temporizador terminó.

*/
