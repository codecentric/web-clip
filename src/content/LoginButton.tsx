import React from 'react';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { useLogin } from './useLogin';

export const LoginButton = () => {
  const { login, loading, error } = useLogin();
  return (
    <>
      <Button loading={loading} loadingLabel="Signing in" onClick={login}>
        Login
      </Button>
      {error && <ErrorMessage error={error} />}
    </>
  );
};
