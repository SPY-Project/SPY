import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder = '', ariaLabel, className = '', ...rest }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    aria-label={ariaLabel}
    className={`px-4 py-3 border-2 border-gray-700 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-600 transition-all duration-200 placeholder-gray-400 text-gray-700 ${className}`}
    {...rest}
  />
);

export default Input; 