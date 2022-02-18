import { SolidApi } from './api/SolidApi';
import { activateWebClipForTab } from './background/activate';
import { MessageHandler } from './background/MessageHandler';
import { sendMessageToActiveTab } from './background/sendMessageToActiveTab';
import { MessageType } from './messages';
import { Session } from './solid-client-authn-chrome-ext/Session';
import { Store } from './store/Store';

const session = new Session();

function createMessageHandler() {
  const store = new Store();
  return new MessageHandler(
    new SolidApi(session, store, chrome.identity.getRedirectURL()),
    store
  );
}

let messageHandler = createMessageHandler();

chrome.browserAction.onClicked.addListener(function (tab) {
  activateWebClipForTab(tab, session.info);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  messageHandler.handleMessage(request, sender).then(sendResponse);
  return true; // indicate async response
});

session.onLogin(() => {
  messageHandler = createMessageHandler();

  sendMessageToActiveTab({
    type: MessageType.LOGGED_IN,
    payload: session.info,
  });
});

session.onLogout(() => {
  messageHandler = createMessageHandler();
});
