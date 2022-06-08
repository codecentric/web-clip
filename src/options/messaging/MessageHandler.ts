import { closeTab } from '../../chrome/closeTab';
import { Message, MessageType, Response } from '../../messages';
import { ActionType, Dispatch } from '../reducer';
import MessageSender = chrome.runtime.MessageSender;

export class MessageHandler {
  constructor(private readonly dispatch: Dispatch) {}

  /**
   * Handles the given request, if it is relevant for the option page and return and aysnc response.
   * Returns false synchronously, if the given request is not handled.
   *
   * @param request
   * @param sender
   */
  handleMessage(
    request: Message,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sender: MessageSender
  ): boolean | Promise<Response> {
    switch (request.type) {
      case MessageType.ACCESS_GRANTED:
        return closeTab(sender.tab.id).then(() => {
          this.dispatch({
            type: ActionType.TRUSTED_APP,
          });
          return {};
        });
    }
    return false;
  }
}
