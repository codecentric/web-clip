import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import React from 'react';
import { Button } from '../../components/Button';
import { useLogin } from './useLogin';

interface Props {
  oidcIssuer: string;
  onLogin: (sessionInfo: ISessionInfo) => void;
}
export const ConnectPodButton = ({ oidcIssuer, onLogin }: Props) => {
  const { login, loading } = useLogin(oidcIssuer, onLogin);

  return (
    <Button loading={loading} onClick={login} loadingLabel="Signing in">
      Connect Pod
    </Button>
  );
};
