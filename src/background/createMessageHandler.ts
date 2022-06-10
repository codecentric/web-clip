import { SolidApi } from '../api/SolidApi';
import { Session } from '../solid-client-authn-chrome-ext/Session';
import { BookmarkStore } from '../store/BookmarkStore';
import { MessageHandler } from './MessageHandler';

export function createMessageHandler(session: Session, providerUrl: string) {
  const store = new BookmarkStore();
  return new MessageHandler(
    new SolidApi(session, store, providerUrl, chrome.identity.getRedirectURL()),
    store
  );
}
