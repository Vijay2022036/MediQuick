import React from 'react';

function Skeleton({ className = '' }) {
  return (
    <div 
      className={`
        animate-pulse bg-gray-200 rounded-md 
        ${className}
      `}
    />
  );
}

export {Skeleton};
export default Skeleton;