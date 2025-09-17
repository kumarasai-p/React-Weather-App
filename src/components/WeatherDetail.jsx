import React from 'react';

export default function WeatherDetail({ icon, label, value }) {
    return (
        <div className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-xl shadow-lg text-center h-full">
            <div className="text-3xl mb-2">{icon}</div>
            <p className="text-sm uppercase tracking-wider text-white/80">{label}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    );
}