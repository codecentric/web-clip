import { activateWebClipForTab } from './background/activate';
import { createMessageHandler } from './background/createMessageHandler';
import { MessageHandler } from './background/MessageHandler';
import { sendMessageToActiveTab } from './background/sendMessageToActiveTab';
import { MessageType, Response } from './domain/messages';
import { subscribeOption } from './options/optionsStorageApi';
import { Session } from './solid-client-authn-chrome-ext/Session';

const session = new Session();

let messageHandler: MessageHandler = null;
let providerUrl: string = null;

subscribeOption('providerUrl', (value: string) => {
  console.log('providerUrl changed from', providerUrl, 'to', value);
  providerUrl = value;
  return session.logout();
});

chrome.browserAction.onClicked.addListener(async function (tab) {
  if (session.isExpired()) {
    console.log('session expired, logging out');
    await session.logout();
  }
  activateWebClipForTab(tab, session.info, providerUrl);
});

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
  } else {
    return result;
  }
});

session.onLogin(() => {
  messageHandler = createMessageHandler(session, providerUrl);

  sendMessageToActiveTab({
    type: MessageType.LOGGED_IN,
    payload: session.info,
  });
});

session.onLogout(() => {
  messageHandler = createMessageHandler(session, providerUrl);
});
