import { ISessionInfo, Session } from '@inrupt/solid-client-authn-browser';
import { useEffect, useState } from 'react';
import { MessageType } from '../messages';
import { useChromeMessageListener } from './useChromeMessageListener';

export function useSessionInfo(legacySession: Session) {
  const [sessionInfo, setSessionInfo] = useState<ISessionInfo>(
    legacySession.info
  );

  const chromeMessageListener = useChromeMessageListener();

  useEffect(() => {
    chromeMessageListener.on(MessageType.LOGGED_IN, (info) => {
      setSessionInfo(info);
    });
  }, []);

  return { sessionInfo };
}
