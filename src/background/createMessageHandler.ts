import { SolidApi } from '../api/SolidApi';
import { Session } from '../solid-client-authn-chrome-ext/Session';
import { Store } from '../store/Store';
import { MessageHandler } from './MessageHandler';

export function createMessageHandler(session: Session) {
  const store = new Store();
  return new MessageHandler(
    new SolidApi(session, store, chrome.identity.getRedirectURL()),
    store
  );
}
