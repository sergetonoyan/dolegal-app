import React from 'react';

export const Logo: React.FC = () => (
  <div className="flex items-center space-x-2">
     <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <circle cx="16" cy="16" r="12" stroke="#4F46E5" strokeWidth="3"/>
    </svg>
    <span className="text-2xl font-bold text-gray-800 tracking-tight">DoLegal</span>
  </div>
);