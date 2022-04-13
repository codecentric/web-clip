import { SolidApi } from '../api/SolidApi';
import { Message, MessageType, Response } from '../messages';
import { Store } from '../store/Store';
import { openOptionsPage } from './openOptionsPage';
import MessageSender = chrome.runtime.MessageSender;

export class MessageHandler {
  constructor(
    private readonly solidApi: SolidApi,
    private readonly store: Store
  ) {}

  async handleMessage(
    request: Message,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sender: MessageSender
  ): Promise<Response> {
    switch (request.type) {
      case MessageType.OPEN_OPTIONS:
        openOptionsPage();
        return {};
      case MessageType.LOGIN:
        await this.solidApi.login();
        return {};
      case MessageType.LOAD_PROFILE: {
        const profile = await this.solidApi.loadProfile();
        return {
          payload: profile,
        };
      }
      case MessageType.LOAD_BOOKMARK: {
        const bookmark = await this.solidApi.loadBookmark(request.payload.page);
        return {
          payload: bookmark,
        };
      }
      case MessageType.ADD_BOOKMARK: {
        const result = await this.solidApi.bookmark(
          request.payload.page,
          request.payload.bookmark
        );
        return {
          payload: result,
        };
      }
      case MessageType.IMPORT_PAGE_DATA: {
        await this.store.importFromUrl(request.payload.url);
        return {};
      }
    }
  }
}
