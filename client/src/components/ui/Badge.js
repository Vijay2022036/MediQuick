import React from 'react';

function Badge({ children, className = '', variant = 'default' }) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-orange-100 text-orange-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };
  
  const finalClassName = `${baseStyles} ${className || variantStyles[variant] || variantStyles.default}`;
  
  return (
    <span className={finalClassName}>
      {children}
    </span>
  );
}

export {Badge};
export default Badge;