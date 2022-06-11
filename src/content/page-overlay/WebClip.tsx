import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import React from 'react';
import { ChromeMessageListener } from '../messaging/ChromeMessageListener';

import { ChromeMessageListenerContext } from '../messaging/chromeMessageListenerContext';
import { PageContent } from './PageContent';

interface Props {
  chromeMessageListener: ChromeMessageListener;
  sessionInfo: ISessionInfo;
  providerUrl: string;
  close: () => void;
}

export const WebClip = ({
  chromeMessageListener,
  sessionInfo,
  providerUrl,
  close,
}: Props) => {
  return (
    <ChromeMessageListenerContext.Provider value={chromeMessageListener}>
      <PageContent
        close={close}
        sessionInfo={sessionInfo}
        providerUrl={providerUrl}
      />
    </ChromeMessageListenerContext.Provider>
  );
};
