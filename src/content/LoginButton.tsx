import React from 'react';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { prettifyUrl } from './prettifyUrl';
import { useLogin } from './useLogin';

interface Props {
  providerUrl: string;
}

export const LoginButton = ({ providerUrl }: Props) => {
  const { login, loading, error } = useLogin();
  return (
    <div className="grid">
      <Button loading={loading} loadingLabel="Signing in" onClick={login}>
        <p>Login</p>
      </Button>
      <p className="font-light text-gray-500 text-xs">
        {prettifyUrl(providerUrl)}
      </p>
      {error && <ErrorMessage error={error} />}
    </div>
  );
};
