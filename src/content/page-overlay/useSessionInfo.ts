import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { useEffect, useState } from 'react';
import { MessageType } from '../../domain/messages';
import { ChromeMessageListener } from '../messaging/ChromeMessageListener';
import { useChromeMessageListener } from '../messaging/chromeMessageListenerContext';

export function useSessionInfo(initial: ISessionInfo): ISessionInfo {
  const [sessionInfo, setSessionInfo] = useState<ISessionInfo>(initial);

  const chromeMessageListener: ChromeMessageListener =
    useChromeMessageListener();

  useEffect(() => {
    chromeMessageListener?.on(MessageType.LOGGED_IN, (info) => {
      setSessionInfo(info);
    });
  }, [chromeMessageListener]);

  return sessionInfo;
}
