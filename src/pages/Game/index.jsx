import React, { useState, useEffect } from 'react';

const Game = () => {
    const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [userGuess, setUserGuess] = useState('');
  const [message, setMessage] = useState('');

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

    // Llamar a la función para obtener los datos
    fetchCountries();
  }, []);

  useEffect(() => {
    // Función para seleccionar un país aleatorio
    const pickRandomCountry = () => {
      if (countries.length > 0) {
        const randomIndex = Math.floor(Math.random() * countries.length);
        setSelectedCountry(countries[randomIndex]);
      }
    };

    // Llamar a la función para seleccionar el país cuando los países estén disponibles
    pickRandomCountry();
  }, [countries]);

  // Función para manejar el cambio en el campo de entrada
  const handleInputChange = (e) => {
    setUserGuess(e.target.value);
  };

  // Función para manejar la verificación de la respuesta
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userGuess.toLowerCase() === selectedCountry.name.toLowerCase()) {
      setMessage('¡Correcto! Has adivinado el país.');
    } else {
      setMessage(`Incorrecto. La respuesta correcta es ${selectedCountry.name}.`);
    }
    // Limpiar el campo de entrada después de enviar
    setUserGuess('');
    // Seleccionar un nuevo país
    pickRandomCountry();
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
        <p>Cargando datos...</p>
      )}
    </div>
  );
}

export default Game;