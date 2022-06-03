import { closeTab } from '../../chrome/closeTab';
import { Message, MessageType, Response } from '../../messages';
import { ActionType, Dispatch } from '../reducer';
import MessageSender = chrome.runtime.MessageSender;

export class MessageHandler {
  constructor(private readonly dispatch: Dispatch) {}

  async handleMessage(
    request: Message,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sender: MessageSender
  ): Promise<Response> {
    switch (request.type) {
      case MessageType.ACCESS_GRANTED:
        await closeTab(sender.tab.id);
        this.dispatch({
          type: ActionType.TRUSTED_APP,
        });
        return {};
    }
  }
}
