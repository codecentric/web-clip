import { Session } from '@inrupt/solid-client-authn-browser';
import { useEffect, useState } from 'react';

export const useAuthorization = (
  session: Session,
  providerUrl: string,
  extensionId: string
) => {
  const [state, setState] = useState({
    loading: true,
    success: false,
    error: null,
  });

  useEffect(() => {
    if (!session.info.isLoggedIn) {
      session
        .login({
          oidcIssuer: providerUrl,
        })
        .then(() => console.log('login via redirect'));
    } else {
      setState((currentState) => ({
        ...currentState,
        loading: false,
        success: false,
        error: new Error('todo: grant permissions'),
      }));
    }
  }, []);

  return state;
};
