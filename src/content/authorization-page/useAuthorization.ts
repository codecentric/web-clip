import { Session } from '@inrupt/solid-client-authn-browser';
import { useEffect, useState } from 'react';
import { MessageType } from '../../messages';
import { useSolidApis } from '../../options/useSolidApis';
import { sendMessage } from '../sendMessage';

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
        .then(() => null);
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
          return sendMessage({ type: MessageType.ACCESS_GRANTED });
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
