import React, { InputHTMLAttributes } from 'react';

export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
  const baseClasses =
    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline';
  const classNames =
    props['aria-invalid'] === true
      ? `border-red-500 ${baseClasses}`
      : baseClasses;
  return <input className={classNames} {...props} />;
};
