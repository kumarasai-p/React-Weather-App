import React from 'react';

export default function ForecastDay({ day, icon, maxTemp, minTemp }) {
    return (
        <div className="flex flex-col items-center p-4 bg-white/10 rounded-xl shadow-lg text-center hover:bg-white/20 transition-colors duration-300 transform hover:-translate-y-1">
            <p className="font-bold text-lg">{day}</p>
            <div className="text-6xl my-2">{icon}</div>
            <div className="flex gap-2">
                <p className="font-semibold text-xl">{maxTemp}°</p>
                <p className="opacity-70 text-lg">{minTemp}°</p>
            </div>
        </div>
    );
}