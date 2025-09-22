const axios = require('axios');

const getWeatherData = async (lat, lon) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) throw new Error("Server is missing OpenWeather API key.");
    
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    try {
        const response = await axios.get(url);
        const data = response.data;
        return {
            city: data.name,
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        };
    } catch (error) {
        console.error("Error fetching weather by coords:", error.response?.data?.message || error.message);
        throw new Error("Could not fetch weather data.");
    }
};

const getNearbyCitiesWeather = async (lat, lon) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) throw new Error("OpenWeather API key is missing.");
    
    const url = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=5&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        return response.data.list.map(city => ({
            name: city.name,
            country: city.sys.country,
            lat: city.coord.lat,
            lon: city.coord.lon,
            temp: Math.round(city.main.temp),
            description: city.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${city.weather[0].icon}.png`,
        }));
    } catch (error) {
        console.error("Error fetching nearby cities weather:", error.response?.data?.message || error.message);
        throw new Error("Could not fetch nearby cities weather data.");
    }
};

const getWeatherByCityName = async (cityName) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) throw new Error("Server is missing OpenWeather API key.");

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`;
    try {
        const response = await axios.get(url);
        const data = response.data;
        // --- THIS IS THE CRITICAL CHANGE ---
        // We now include the 'coord' object in the response.
        return {
            city: data.name,
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            coord: data.coord, // Add the coordinates to the response
        };
    } catch (error) {
        console.error("Error fetching weather by city name:", error.response?.data?.message || error.message);
        throw new Error(`Could not find weather data for "${cityName}".`);
    }
};

module.exports = { 
    getWeatherData,
    getNearbyCitiesWeather,
    getWeatherByCityName,
};