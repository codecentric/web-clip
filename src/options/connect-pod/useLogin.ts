import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { useState } from 'react';
import { useAuthentication } from '../auth/AuthenticationContext';

export const useLogin = (
  oidcIssuer: string,
  onLogin: (sessionInfo: ISessionInfo) => void
) => {
  const [loading, setLoading] = useState(false);
  const { session, redirectUrl } = useAuthentication();
  return {
    loading,
    login: async () => {
      setLoading(true);
      await session.login({
        oidcIssuer,
        redirectUrl,
      });
      setLoading(false);
      await onLogin(session.info);
    },
  };
};
