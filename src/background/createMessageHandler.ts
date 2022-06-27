import { AuthenticationApi } from '../api/AuthenticationApi';
import { BookmarkApi } from '../api/BookmarkApi';
import { OptionsStorage } from '../options/OptionsStorage';
import { Session } from '../solid-client-authn-chrome-ext/Session';
import { BookmarkStore } from '../store/BookmarkStore';
import { MessageHandler } from './MessageHandler';

export function createMessageHandler(
  session: Session,
  optionsStorage: OptionsStorage
) {
  const store = new BookmarkStore();
  return new MessageHandler(
    session,
    new BookmarkApi(session, store, optionsStorage),
    store,
    new AuthenticationApi(
      session,
      optionsStorage,
      chrome.identity.getRedirectURL()
    )
  );
}
