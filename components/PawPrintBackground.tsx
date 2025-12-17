import React from 'react';

export const PawPrintBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden opacity-[0.05]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="paws" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M27.6,22.6c-1.2-2.5-4.3-2.9-6.8-1s-3.5,5.3-2.3,7.8c1.2,2.5,4.3,2.9,6.8,1S28.8,25.1,27.6,22.6z
			 M46,22.6c1.2-2.5,4.3-2.9,6.8-1s3.5,5.3,2.3,7.8c-1.2,2.5-4.3,2.9-6.8,1S44.8,25.1,46,22.6z
			 M17.1,44.2c-0.7-3.9-5.3-5.3-8.4-2.4c-3.1,2.9-3.9,8.7-1.9,12.1c1.9,3.3,7.3,5.4,10.3,3C20.1,54.5,17.8,48.1,17.1,44.2z
			 M56.5,44.2c0.7-3.9,5.3-5.3,8.4-2.4c3.1,2.9,3.9,8.7,1.9,12.1c-1.9,3.3-7.3,5.4-10.3,3C53.5,54.5,55.8,48.1,56.5,44.2z
			 M36.8,34.5c-6.9,0-12.8,4-14.6,9.4c-1.1,3.3-0.4,7.1,2.6,10.2c3,3.1,7.4,4.3,12,4.3s9-1.2,12-4.3c3-3.1,3.7-6.9,2.6-10.2
			C49.6,38.5,43.7,34.5,36.8,34.5z" fill="#00D1C6"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#paws)" />
      </svg>
    </div>
  );
};