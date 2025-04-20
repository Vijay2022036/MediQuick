import React from 'react';

function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  className = '',
}) {
  const id = `field-${name}`;
  
  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-3 py-2 
          border rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
          ${error ? 'border-red-300' : 'border-gray-300'}
        `}
      />
      
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}

export default FormField;