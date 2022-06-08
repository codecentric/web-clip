import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { useState } from 'react';
import { useAuthentication } from '../auth/AuthenticationContext';

export const useLogin = (
  oidcIssuer: string,
  onLogin: (sessionInfo: ISessionInfo) => void
) => {
  const [state, setState] = useState({
    loading: false,
    error: null,
  });
  const { session, redirectUrl } = useAuthentication();

  const login = async () => {
    setState({
      loading: true,
      error: null,
    });
    try {
      await session.login({
        oidcIssuer,
        redirectUrl,
      });
      setState({
        loading: false,
        error: null,
      });
      await onLogin(session.info);
    } catch (error) {
      setState({
        loading: false,
        error,
      });
    }
  };

  return {
    ...state,
    login,
  };
};
