import React from 'react';
import { useLogin } from './useLogin';

export const LoginButton = () => {
  const { login, error } = useLogin();
  return (
    <>
      <button className="primary" onClick={login}>Login</button>
      {error && <p>{error}</p>}
    </>
  );
};
