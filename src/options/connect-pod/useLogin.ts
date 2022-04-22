import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { useState } from 'react';
import { useAuthentication } from '../auth/AuthenticationContext';

export const useLogin = (
  oidcIssuer: string,
  onLogin: (sessionInfo: ISessionInfo) => Promise<void>
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
      await onLogin(session.info);
      setLoading(false);
    },
  };
};
