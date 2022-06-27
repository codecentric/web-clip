import { activateWebClipForTab } from './background/activate';
import { createMessageHandler } from './background/createMessageHandler';
import { MessageHandler } from './background/MessageHandler';
import { sendMessageToActiveTab } from './background/sendMessageToActiveTab';
import { MessageType, Response } from './domain/messages';
import { OptionsStorage } from './options/OptionsStorage';
import { Session } from './solid-client-authn-chrome-ext/Session';

const session = new Session();

let messageHandler: MessageHandler = null;

const optionsStorage = new OptionsStorage();

optionsStorage.init().then(() => {
  const { providerUrl } = optionsStorage.getOptions();

  optionsStorage.on('providerUrl', async () => {
    console.log('logging out, because provider URL changed');
    await session.logout();
  });

  messageHandler = createMessageHandler(session, providerUrl);

  chrome.browserAction.onClicked.addListener(async function (tab) {
    const { providerUrl } = optionsStorage.getOptions();
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
    const { providerUrl } = optionsStorage.getOptions();
    messageHandler = createMessageHandler(session, providerUrl);

    sendMessageToActiveTab({
      type: MessageType.LOGGED_IN,
      payload: session.info,
    });
  });

  session.onLogout(() => {
    const { providerUrl } = optionsStorage.getOptions();
    messageHandler = createMessageHandler(session, providerUrl);
  });
});
