import React from 'react';

interface Props {
  error: Error;
}

export const ErrorMessage = ({ error }: Props) => {
  return (
    <p
      style={{ maxWidth: 'fit-content' }}
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
    >
      {error.message}
    </p>
  );
};
