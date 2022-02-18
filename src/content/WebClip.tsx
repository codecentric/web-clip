import { Session } from '@inrupt/solid-client-authn-browser';
import React from 'react';
import { ChromeMessageListener } from './ChromeMessageListener';

import { ChromeMessageListenerContext } from './chromeMessageListenerContext';
import { PageContent } from './PageContent';

interface Props {
  chromeMessageListener: ChromeMessageListener;
  legacySession: Session;
  close: () => void;
}

export const WebClip = ({
  chromeMessageListener,
  legacySession,
  close,
}: Props) => {
  return (
    <ChromeMessageListenerContext.Provider value={chromeMessageListener}>
      <PageContent close={close} legacySession={legacySession} />
    </ChromeMessageListenerContext.Provider>
  );
};
