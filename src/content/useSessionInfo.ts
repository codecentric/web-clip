import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { useEffect, useState } from 'react';
import { MessageType } from '../domain/messages';
import { useChromeMessageListener } from './chromeMessageListenerContext';

export function useSessionInfo(initial: ISessionInfo): ISessionInfo {
  const [sessionInfo, setSessionInfo] = useState<ISessionInfo>(initial);

  const chromeMessageListener = useChromeMessageListener();

  useEffect(() => {
    chromeMessageListener?.on(MessageType.LOGGED_IN, (info) => {
      setSessionInfo(info);
    });
  }, [chromeMessageListener]);

  return sessionInfo;
}
