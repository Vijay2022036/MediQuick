import React from 'react';

// Avatar container
function Avatar({ children, className = '' }) {
  return (
    <div className={`relative inline-block rounded-full overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

// Avatar image
function AvatarImage({ src, alt = '', className = '' }) {
  return (
    <img 
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      onError={(e) => {
        // Hide image on error
        e.target.style.display = 'none';
      }}
    />
  );
}

// Avatar fallback (displayed when image fails to load or isn't provided)
function AvatarFallback({ children, className = '' }) {
  return (
    <div className={`
      w-full h-full 
      flex items-center justify-center
      text-center font-medium
      ${className}
    `}>
      {children}
    </div>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
export default Avatar;