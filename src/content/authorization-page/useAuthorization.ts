import { Session } from '@inrupt/solid-client-authn-browser';
import { useEffect, useState } from 'react';
import { ExtensionUrl } from '../../chrome/urls';
import { MessageType } from '../../domain/messages';
import { useSolidApis } from '../../api/useSolidApis';
import { sendMessage } from '../../chrome/sendMessage';

export const useAuthorization = (
  session: Session,
  providerUrl: string,
  extensionUrl: ExtensionUrl
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
        .grantAccessTo(extensionUrl)
        .then(() => {
          setState((currentState) => ({
            ...currentState,
            loading: false,
            success: true,
            error: null,
          }));
        })
        .then(() => session.logout())
        .then(() => sendMessage({ type: MessageType.ACCESS_GRANTED }))
        .catch((error) => {
          setState((currentState) => ({
            ...currentState,
            loading: false,
            success: false,
            error,
          }));
          return session.logout();
        });
    }
  }, []);

  return state;
};
