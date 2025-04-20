import React from 'react';

function Button({ 
  children, 
  onClick, 
  className = '', 
  disabled = false, 
  type = 'button', 
  fullWidth = false 
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-md font-medium text-white 
        transition-colors duration-200 
        flex items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
        disabled:opacity-60 disabled:cursor-not-allowed
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;