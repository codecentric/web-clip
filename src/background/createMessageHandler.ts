import { BookmarkApi } from '../api/BookmarkApi';
import { Session } from '../solid-client-authn-chrome-ext/Session';
import { BookmarkStore } from '../store/BookmarkStore';
import { MessageHandler } from './MessageHandler';

export function createMessageHandler(session: Session, providerUrl: string) {
  const store = new BookmarkStore();
  return new MessageHandler(
    new BookmarkApi(
      session,
      store,
      providerUrl,
      chrome.identity.getRedirectURL()
    ),
    store
  );
}
