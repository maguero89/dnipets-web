import React from 'react';

export const DniPetsHorizontalLogo = ({ className = "w-full h-auto", textColor = "#0D0F35" }: { className?: string, textColor?: string }) => (
    <svg viewBox="0 0 420 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap');`}</style>
        </defs>
        <g transform="translate(10, 10)">
            <ellipse cx="20" cy="38" rx="10" ry="15" transform="rotate(-25 20 38)" fill="#00D1C6" />
            <ellipse cx="42" cy="22" rx="10" ry="15" transform="rotate(-8 42 22)" fill="#00D1C6" />
            <ellipse cx="68" cy="25" rx="10" ry="15" transform="rotate(10 68 25)" fill="#00D1C6" />
            <ellipse cx="88" cy="45" rx="10" ry="15" transform="rotate(30 88 45)" fill="#00D1C6" />
            <path d="M28 62 C 28 62, 40 45, 55 45 C 70 45, 82 62, 82 62 C 82 62, 85 85, 55 92 C 25 85, 28 62, 28 62 Z" fill="#00D1C6" />
            <path d="M40 65 Q 55 55 70 65" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <path d="M36 72 Q 55 60 74 72" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <path d="M42 80 Q 55 72 68 80" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <path d="M50 86 L 50 88" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        </g>
        <text x="120" y="82" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="65" fill={textColor} letterSpacing="-3">DNIPETS</text>
    </svg>
);
