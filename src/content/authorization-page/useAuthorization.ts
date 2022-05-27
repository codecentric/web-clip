import { Session } from '@inrupt/solid-client-authn-browser';
import { useEffect, useState } from 'react';
import { useSolidApis } from '../../options/useSolidApis';

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

  const { profileApi } = useSolidApis(session);

  useEffect(() => {
    if (!session.info.isLoggedIn) {
      session
        .login({
          oidcIssuer: providerUrl,
        })
        .then(() => console.log('login via redirect'));
    } else {
      profileApi
        .grantAccessTo(`chrome-extension://${extensionId}`)
        .then(() => {
          setState((currentState) => ({
            ...currentState,
            loading: false,
            success: true,
            error: null,
          }));
        })
        .catch((error) => {
          setState((currentState) => ({
            ...currentState,
            loading: false,
            success: false,
            error,
          }));
        });
    }
  }, []);

  return state;
};
