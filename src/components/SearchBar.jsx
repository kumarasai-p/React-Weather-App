import React, { useState } from 'react';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

export default function SearchBar({ onCitySelect }) {
    // ... exact same code as your SearchBar component ...
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const handleSearch = async (searchQuery) => {
        if (searchQuery.length < 3) {
            setResults([]);
            return;
        }
        try {
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=5&appid=${API_KEY}`;
            const response = await axios.get(geoUrl);
            setResults(response.data);
        } catch (error) {
            console.error("Failed to search for city:", error);
            setResults([]);
        }
    };

    const handleChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const newTimeout = setTimeout(() => {
            handleSearch(newQuery);
        }, 500);
        setDebounceTimeout(newTimeout);
    };

    const handleSelect = (city) => {
        setQuery('');
        setResults([]);
        onCitySelect(city.lat, city.lon);
    };

    return (
        <div className="relative w-full md:w-72">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search for a city..."
                className="w-full bg-white/20 placeholder-white/70 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            {results.length > 0 && (
                <ul className="absolute top-full left-0 right-0 mt-2 bg-black/50 backdrop-blur-md rounded-lg z-10 overflow-hidden">
                    {results.map((city, index) => (
                        <li
                            key={`${city.lat}-${city.lon}-${index}`}
                            onClick={() => handleSelect(city)}
                            className="px-4 py-2 cursor-pointer hover:bg-white/20"
                        >
                            {city.name}, {city.state ? `${city.state}, ` : ''}{city.country}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};