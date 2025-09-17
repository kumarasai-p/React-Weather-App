import React from 'react';

export default function StatusDisplay({ message, isLoading }) {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
            {isLoading && (
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            )}
            <p className="text-xl text-white/90 drop-shadow-md">{message}</p>
        </div>
    );
}