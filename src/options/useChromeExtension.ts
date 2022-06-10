import { useEffect } from 'react';
import { getExtensionUrl } from '../chrome/urls';
import { Response } from '../domain/messages';
import { MessageHandler } from './messaging/MessageHandler';

export const useChromeExtension = (messageHandler: MessageHandler) => {
  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse: (response: Response) => void
    ) {
      const result = messageHandler.handleMessage(request, sender);

      if (result instanceof Promise) {
        result
          .then(sendResponse)
          .catch((error) => sendResponse({ errorMessage: error.toString() }));
        return true; // indicate async response
      }
      return result;
    });
  }, []);

  return {
    redirectUrl: new URL(chrome.identity.getRedirectURL()),
    extensionUrl: getExtensionUrl(),
  };
};
