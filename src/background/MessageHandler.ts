import { SolidApi } from '../api/SolidApi';
import { Message, MessageType, Response } from '../messages';
import MessageSender = chrome.runtime.MessageSender;

export class MessageHandler {
  constructor(private readonly solidApi: SolidApi) {}

  async handleMessage(
    request: Message,
    sender: MessageSender
  ): Promise<Response> {
    switch (request.type) {
      case MessageType.LOGIN:
        await this.solidApi.login();
        return {};
    }
  }
}
