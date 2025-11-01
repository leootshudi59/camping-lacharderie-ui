'use client';

import React from 'react';

interface FormFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  name?: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
}

export default function FormField({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  name,
  placeholder,
  autoComplete,
  className = '',
}: FormFieldProps) {
  const id = name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder || label}
        autoComplete={autoComplete}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-700 ${className}`}
      />
    </div>
  );
}