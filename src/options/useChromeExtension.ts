import { useEffect } from 'react';
import { Response } from '../messages';
import { MessageHandler } from './messaging/MessageHandler';

export const useChromeExtension = (messageHandler: MessageHandler) => {
  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse: (response: Response) => void
    ) {
      messageHandler
        .handleMessage(request, sender)
        .then(sendResponse)
        .catch((error) => sendResponse({ errorMessage: error.toString() }));
      return true; // indicate async response
    });
  }, []);

  return {
    redirectUrl: chrome.identity.getRedirectURL().slice(0, -1),
    extensionUrl: chrome.extension.getURL('').slice(0, -1),
  };
};
