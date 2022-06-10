import { SolidApi } from '../api/SolidApi';
import { Message, MessageType, Response } from '../domain/messages';
import { BookmarkStore } from '../store/BookmarkStore';
import { openOptionsPage } from './openOptionsPage';
import MessageSender = chrome.runtime.MessageSender;

export class MessageHandler {
  constructor(
    private readonly solidApi: SolidApi,
    private readonly store: BookmarkStore
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
        return this.solidApi.login().then(() => ({}));
      case MessageType.LOAD_PROFILE: {
        return this.solidApi.loadProfile().then((profile) => ({
          payload: profile,
        }));
      }
      case MessageType.LOAD_BOOKMARK: {
        return this.solidApi
          .loadBookmark(request.payload.page)
          .then((bookmark) => ({
            payload: bookmark,
          }));
      }
      case MessageType.ADD_BOOKMARK: {
        return this.solidApi
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
