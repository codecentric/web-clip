import React from 'react';

interface Props {
  error: Error;
}

export const ErrorDetails = ({ error }: Props) => {
  return (
    <div className="m-4 border-2 p-4 rounded-sm border-red-500">
      <h2 className="text-lg">Unfortunately something went wrong:</h2>
      <div className="font-bold my-2">{error.message}</div>
      <details>
        <pre>{error.stack}</pre>
      </details>
    </div>
  );
};
