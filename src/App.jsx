// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Import components and utils
import SearchBar from './components/SearchBar';
import StatusDisplay from './components/StatusDisplay';
import WeatherDetail from './components/WeatherDetail';
import ForecastDay from './components/ForecastDay';
import { getWeatherIcon, getBackgroundImage, formatTime } from './utils/weatherUtils';

// Vite uses import.meta.env for environment variables
const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

export default function App() {
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [unit, setUnit] = useState('metric');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchWeatherData = useCallback(async (lat, lon) => {
        setLoading(true);
        setError(null);
        try {
            const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            // CORRECTED: The typo "2.semg" is now "2.5"
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            
            const [currentWeatherRes, forecastRes] = await axios.all([
                axios.get(currentWeatherUrl),
                axios.get(forecastUrl)
            ]);
            
            setWeatherData(currentWeatherRes.data);
            
            const dailyData = {};
            if (forecastRes.data && forecastRes.data.list) {
                forecastRes.data.list.forEach(item => {
                    const day = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
                    if (!dailyData[day]) {
                        dailyData[day] = { temps: [], weathers: [] };
                    }
                    dailyData[day].temps.push(item.main.temp);
                    dailyData[day].weathers.push(item.weather[0].main);
                });
            }

            const processedForecast = Object.entries(dailyData).slice(0, 5).map(([day, data]) => {
                const maxTemp = Math.max(...data.temps);
                const minTemp = Math.min(...data.temps);
                const mostCommonWeather = data.weathers.sort((a,b) =>
                    data.weathers.filter(v => v===a).length - data.weathers.filter(v => v===b).length
                ).pop();
                return { day, maxTemp, minTemp, weather: mostCommonWeather };
            });

            setForecastData(processedForecast);
        } catch (err) {
            setError('Failed to fetch weather data. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWeatherData(28.6139, 77.2090); // Default to Delhi, India
    }, [fetchWeatherData]);

    const toggleUnit = () => setUnit(prev => prev === 'metric' ? 'imperial' : 'metric');

    const convertTemp = (celsius) => {
        if (celsius == null) return '--';
        if (unit === 'imperial') return Math.round((celsius * 9/5) + 32);
        return Math.round(celsius);
    };

    const convertSpeed = (mps) => {
        if (mps == null) return '--';
        if (unit === 'imperial') return `${(mps * 2.237).toFixed(1)} mph`;
        return `${mps.toFixed(1)} m/s`;
    };
    
    const backgroundClass = weatherData?.weather?.[0]?.main 
        ? getBackgroundImage(weatherData.weather[0].main) 
        : 'from-gray-700 to-gray-900';

    return (
        <div className={`min-h-screen text-white p-4 sm:p-6 lg:p-8 font-sans transition-all duration-1000 bg-gradient-to-br ${backgroundClass}`}>
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-wider">Weather App</h1>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <SearchBar onCitySelect={fetchWeatherData} />
                        <button onClick={toggleUnit} className="px-4 py-2 bg-white/20 rounded-lg text-lg font-semibold hover:bg-white/30 transition-colors flex-shrink-0">
                            °{unit === 'metric' ? 'C' : 'F'}
                        </button>
                    </div>
                </header>

                <main>
                    {loading && <StatusDisplay message="Fetching weather data..." isLoading={true} />}
                    {error && !loading && <StatusDisplay message={error} isLoading={false} />}
                    
                    {weatherData && !loading && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                            {/* Current Weather Section */}
                            <div className="lg:col-span-3 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-center md:text-left">
                                    <h2 className="text-4xl md:text-5xl font-bold">{weatherData?.name}, {weatherData?.sys?.country}</h2>
                                    <p className="text-lg opacity-80 mt-1">{new Date().toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                    <p className="text-2xl capitalize mt-4">{weatherData?.weather?.[0]?.description}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-7xl md:text-8xl drop-shadow-lg">{getWeatherIcon(weatherData?.weather?.[0]?.main)}</span>
                                    <p className="text-7xl md:text-8xl font-extrabold">
                                        {convertTemp(weatherData?.main?.temp)}°
                                    </p>
                                </div>
                            </div>
                            
                            {/* Additional Details Section */}
                            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-5 gap-4">
                               <WeatherDetail 
                                    icon="🌡️"
                                    label="Feels Like"
                                    value={`${convertTemp(weatherData?.main?.feels_like)}°`}
                                />
                                <WeatherDetail 
                                    icon="💧"
                                    label="Humidity"
                                    value={weatherData?.main?.humidity != null ? `${weatherData.main.humidity}%` : '--'}
                                />
                                <WeatherDetail 
                                    icon="🌬️"
                                    label="Wind Speed"
                                    value={convertSpeed(weatherData?.wind?.speed)}
                                />
                                <WeatherDetail 
                                    icon="☀️"
                                    label="Sunrise"
                                    value={formatTime(weatherData?.sys?.sunrise, weatherData?.timezone)}
                                />
                                <WeatherDetail 
                                    icon="🌇"
                                    label="Sunset"
                                    value={formatTime(weatherData?.sys?.sunset, weatherData?.timezone)}
                                />
                            </div>

                            {/* 5-Day Forecast Section */}
                            <div className="lg:col-span-3 mt-4">
                                <h3 className="text-2xl font-bold mb-4">5-Day Forecast</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                    {forecastData.map(day => (
                                        <ForecastDay 
                                            key={day.day}
                                            day={day.day}
                                            icon={getWeatherIcon(day.weather)}
                                            maxTemp={convertTemp(day.maxTemp)}
                                            minTemp={convertTemp(day.minTemp)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}