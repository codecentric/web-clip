import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import React from 'react';
import { ChromeMessageListener } from './ChromeMessageListener';

import { ChromeMessageListenerContext } from './chromeMessageListenerContext';
import { PageContent } from './PageContent';

interface Props {
  chromeMessageListener: ChromeMessageListener;
  sessionInfo: ISessionInfo;
  close: () => void;
}

export const WebClip = ({
  chromeMessageListener,
  sessionInfo,
  close,
}: Props) => {
  return (
    <ChromeMessageListenerContext.Provider value={chromeMessageListener}>
      <PageContent close={close} sessionInfo={sessionInfo} />
    </ChromeMessageListenerContext.Provider>
  );
};
