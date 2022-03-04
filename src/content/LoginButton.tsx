import React from 'react';
import { useLogin } from './useLogin';

export const LoginButton = () => {
  const { login, error } = useLogin();
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
