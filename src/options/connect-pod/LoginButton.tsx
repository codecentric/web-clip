import React from 'react';
import { Button } from '../../components/Button';
import { useLogin } from './useLogin';

interface Props {
  oidcIssuer: string;
}
export const LoginButton = ({ oidcIssuer }: Props) => {
  const { login, loading } = useLogin(oidcIssuer);

  return (
    <Button loading={loading} onClick={login} loadingLabel="Signing in">
      Login
    </Button>
  );
};
