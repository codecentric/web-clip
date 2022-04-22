import React from 'react';
import { Button } from '../../components/Button';
import { useLogin } from './useLogin';

export const LoginButton = () => {
  const { login, loading } = useLogin();

  return (
    <Button loading={loading} onClick={login} loadingLabel="Signing in">
      Login
    </Button>
  );
};
