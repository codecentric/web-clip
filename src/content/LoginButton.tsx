import React from 'react';
import { useLegacyLogin } from './useLegacyLogin';

export const LoginButton = () => {
  const { login, error } = useLegacyLogin();
  return (
    <>
      <button
        className="my-1 px-4 py-2 bg-blue-400 rounded text-white hover:opacity-90 font-bold"
        onClick={login}
      >
        Login
      </button>
      {error && <p>{error}</p>}
    </>
  );
};
