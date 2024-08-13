import React, { useState, useEffect, useRef } from 'react';

const Game = () => {
  const [countries, setCountries] = useState([]);
  const [remainingCountries, setRemainingCountries] = useState([]);
  const [passedCountries, setPassedCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [userGuess, setUserGuess] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0); // Estado para el índice del país actual
  const timerRef = useRef(null); // Ref para manejar el temporizador

  useEffect(() => {
    // Función para recuperar los datos de la API
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images');
        const data = await response.json();
        setCountries(data.data);
        setRemainingCountries(data.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    // Llamar a la función para obtener los datos
    fetchCountries();
  }, []);

  useEffect(() => {
    // Función para seleccionar un país basado en el índice
    const pickCountry = () => {
      if (remainingCountries.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingCountries.length);
        const newCountry = remainingCountries[randomIndex];
        setSelectedCountry(newCountry);
        
        // Actualizar las listas
        setPassedCountries(prevPassedCountries => [...prevPassedCountries, newCountry]);
        setRemainingCountries(prevRemainingCountries => 
          prevRemainingCountries.filter(country => country !== newCountry)
        );
      }
    };

    // Función para cambiar el país después de un tiempo
    const changeCountryAfterDelay = () => {
      timerRef.current = setTimeout(() => {
        pickCountry();
      }, 2000); // Espera 2 segundos
    };

    // Iniciar el cambio de país si hay países disponibles
    if (remainingCountries.length > 0) {
      pickCountry();
      changeCountryAfterDelay();
    }

    // Limpiar el temporizador si el componente se desmonta
    return () => clearTimeout(timerRef.current);
  }, [remainingCountries]);

  useEffect(() => {
    // Verificar si todos los países han sido mostrados
    if (passedCountries.length === countries.length) {
      // Realizar una acción cuando todos los países hayan sido mostrados
      setMessage('¡Todos los países han sido mostrados!');
    }
  }, [passedCountries, countries]);

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

    // Cambiar al siguiente país cuando el formulario es enviado
    const nextIndex = (currentIndex + 1) % remainingCountries.length;
    setCurrentIndex(nextIndex);
    if (remainingCountries.length > 0) {
      pickCountry(); // Seleccionar un nuevo país
    }

    // Reiniciar el temporizador
    clearTimeout(timerRef.current);
    changeCountryAfterDelay();
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
}

export default Game;
