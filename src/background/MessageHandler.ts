import { AuthenticationApi } from '../api/AuthenticationApi';
import { BookmarkApi } from '../api/BookmarkApi';
import { SolidSession } from '../api/SolidSession';
import { Message, MessageType, Response } from '../domain/messages';
import { BookmarkStore } from '../store/BookmarkStore';
import { openOptionsPage } from './openOptionsPage';
import MessageSender = chrome.runtime.MessageSender;

export class MessageHandler {
  constructor(
    private readonly session: SolidSession,
    private readonly bookmarkApi: BookmarkApi,
    private readonly store: BookmarkStore,
    private readonly authenticationApi: AuthenticationApi
  ) {}

  handleMessage(
    request: Message,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sender: MessageSender
  ): boolean | Promise<Response> {
    switch (request.type) {
      case MessageType.OPEN_OPTIONS:
        openOptionsPage();
        return Promise.resolve({});
      case MessageType.LOGIN:
        return this.authenticationApi.login().then(() => ({}));
      case MessageType.LOGOUT:
        return this.authenticationApi.logout().then(() => ({}));
      case MessageType.LOAD_PROFILE: {
        return this.bookmarkApi.loadProfile().then((profile) => ({
          payload: profile,
        }));
      }
      case MessageType.LOAD_BOOKMARK: {
        return this.bookmarkApi
          .loadBookmark(request.payload.page)
          .then((bookmark) => ({
            payload: bookmark,
          }));
      }
      case MessageType.ADD_BOOKMARK: {
        return this.bookmarkApi
          .bookmark(request.payload.page, request.payload.bookmark)
          .then((result) => ({
            payload: result,
          }));
      }
      case MessageType.IMPORT_PAGE_DATA: {
        return this.store.importFromUrl(request.payload.url).then(() => ({}));
      }
      default: {
        return false;
      }
    }
  }
}
