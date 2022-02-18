import { SolidApi } from '../api/SolidApi';
import { Message, MessageType, Response } from '../messages';
import MessageSender = chrome.runtime.MessageSender;

export class MessageHandler {
  constructor(private readonly solidApi: SolidApi) {}

  async handleMessage(
    request: Message,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sender: MessageSender
  ): Promise<Response> {
    switch (request.type) {
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
    }
  }
}
