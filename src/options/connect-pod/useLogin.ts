import { useState } from 'react';
import { useAuthentication } from '../auth/AuthenticationContext';

export const useLogin = (oidcIssuer: string) => {
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
    },
  };
};
