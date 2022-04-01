import { activateWebClipForTab } from './background/activate';
import { createMessageHandler } from './background/createMessageHandler';
import { MessageHandler } from './background/MessageHandler';
import { sendMessageToActiveTab } from './background/sendMessageToActiveTab';
import { MessageType } from './messages';
import { subscribeOption } from './options/optionsStorageApi';
import { Session } from './solid-client-authn-chrome-ext/Session';

const session = new Session();

let messageHandler: MessageHandler = null;
let providerUrl: string = null;

subscribeOption('providerUrl', (value) => {
  console.log('providerUrl changed from', providerUrl, 'to', value);
  providerUrl = value;
  return session.logout();
});

chrome.browserAction.onClicked.addListener(function (tab) {
  activateWebClipForTab(tab, session.info);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  messageHandler.handleMessage(request, sender).then(sendResponse);
  return true; // indicate async response
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
