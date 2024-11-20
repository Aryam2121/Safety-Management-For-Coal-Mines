import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSun, FaCloud, FaCloudRain, FaTemperatureHigh, FaTemperatureLow, FaWind } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MoonLoader } from "react-spinners"; // For loading spinner

// Function to get current weather based on the user's location
const WeatherAlerts = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null);
    const [city, setCity] = useState("");  // User input for city search
    const [unit, setUnit] = useState("metric");  // Celsius by default, Fahrenheit if "imperial"

    // OpenWeatherMap API key
    const API_KEY = "1274d7780f57033ed9118ea96db99182";  // Replace with your actual API key

    // Get the user's current location using Geolocation API
    useEffect(() => {
        if (navigator.geolocation && !city) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                },
                (err) => {
                    setError(`Failed to get location: ${err.message}`);
                    setLoading(false);
                }
            );
        }
    }, [city]);

    // Fetch weather data after location or city is available
    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            try {
                let url = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=${unit}`;
                if (location) {
                    url += `&lat=${location.latitude}&lon=${location.longitude}`;
                } else if (city) {
                    url += `&q=${city}`;
                }
                const res = await axios.get(url);
                setWeather(res.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch weather data. Please try again later.");
                setLoading(false);
            }
        };

        if (location || city) {
            fetchWeather();
        }
    }, [location, city, unit]);

    // Render weather icons based on condition
    const renderWeatherIcon = (condition) => {
        switch (condition) {
            case "Clear":
                return <FaSun className="text-yellow-500" />;
            case "Clouds":
                return <FaCloud className="text-gray-500" />;
            case "Rain":
                return <FaCloudRain className="text-blue-500" />;
            default:
                return <FaCloud className="text-gray-400" />;
        }
    };

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    const handleUnitChange = (e) => {
        setUnit(e.target.value);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <MoonLoader size={80} color="#1e40af" />
            </div>
        );
    }

    if (error) {
        return <div className="error-message p-4">{error}</div>;
    }

    return (
        <div className="weather-alerts p-6 border rounded-lg shadow-lg bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 max-w-lg mx-auto transition-all duration-500 ease-in-out transform hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-800">Weather Forecast</h2>

            {/* Search Bar */}
            <div className="mb-4 flex justify-center items-center">
                <input
                    type="text"
                    value={city}
                    onChange={handleCityChange}
                    placeholder="Search by city..."
                    className="border-2 rounded-lg p-2 text-lg"
                />
                <button
                    onClick={() => setCity(city)}
                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Search
                </button>
            </div>

            {weather && (
                <>
                    <div className="text-center mb-4">
                        <h3 className="text-3xl font-bold text-blue-800">{weather.name}, {weather.sys.country}</h3>
                        <p className="text-lg text-gray-600">
                            {weather.weather[0].description}
                        </p>
                    </div>

                    <div className="flex justify-center mb-4">
                        {renderWeatherIcon(weather.weather[0].main)}
                    </div>

                    <div className="weather-details text-center space-y-4">
                        <p className="text-xl font-semibold">
                            Temp: {Math.round(weather.main.temp)}°{unit === "metric" ? "C" : "F"}
                        </p>
                        <div className="flex justify-between">
                            <p className="flex items-center">
                                <FaTemperatureHigh className="mr-2 text-red-500" />
                                High: {Math.round(weather.main.temp_max)}°{unit === "metric" ? "C" : "F"}
                            </p>
                            <p className="flex items-center">
                                <FaTemperatureLow className="mr-2 text-blue-500" />
                                Low: {Math.round(weather.main.temp_min)}°{unit === "metric" ? "C" : "F"}
                            </p>
                        </div>
                        <p className="flex items-center justify-center">
                            <FaWind className="mr-2 text-green-500" />
                            Wind Speed: {weather.wind.speed} m/s
                        </p>
                        <p>Humidity: {weather.main.humidity}%</p>
                        <p>Pressure: {weather.main.pressure} hPa</p>
                        <p>Visibility: {weather.visibility / 1000} km</p>
                        <p>Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
                        <p>Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
                    </div>
                </>
            )}

            {/* Toggle Unit */}
            <div className="mt-4 flex justify-center">
                <label htmlFor="unit-toggle" className="mr-4 text-lg">Unit: </label>
                <select
                    id="unit-toggle"
                    value={unit}
                    onChange={handleUnitChange}
                    className="border rounded-lg p-2 text-lg"
                >
                    <option value="metric">Celsius (°C)</option>
                    <option value="imperial">Fahrenheit (°F)</option>
                </select>
            </div>
        </div>
    );
};

export default WeatherAlerts;
