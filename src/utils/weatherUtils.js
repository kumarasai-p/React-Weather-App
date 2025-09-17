// src/utils/weatherUtils.js

export const getWeatherIcon = (weatherMain) => {
    // ... same code as before ...
    switch (weatherMain) {
        case 'Clear': return '☀️';
        case 'Clouds': return '☁️';
        case 'Rain': return '🌧️';
        case 'Drizzle': return '🌦️';
        case 'Thunderstorm': return '⛈️';
        case 'Snow': return '❄️';
        case 'Mist':
        case 'Smoke':
        case 'Haze':
        case 'Fog':
            return '🌫️';
        default: return '🌍';
    }
};

export const getBackgroundImage = (weatherMain) => {
    // ... same code as before ...
    switch (weatherMain) {
        case 'Clear': return 'from-yellow-300 via-orange-400 to-red-500';
        case 'Clouds': return 'from-gray-400 via-gray-500 to-blue-gray-600';
        case 'Rain':
        case 'Drizzle':
        case 'Thunderstorm': return 'from-blue-800 via-slate-700 to-gray-900';
        case 'Snow': return 'from-sky-300 via-cyan-400 to-blue-500';
        default: return 'from-blue-400 to-indigo-600';
    }
};

export const formatTime = (timestamp, timezone) => {
    if (timestamp == null || timezone == null) return '--:--';
    return new Date((timestamp + timezone) * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC', hour12: true });
};