import { SolidApi } from '../api/SolidApi';
import { MessageType } from '../messages';
import { mockSolidApi, SolidApiMock } from '../test/solidApiMock';
import { MessageHandler } from './MessageHandler';
import MessageSender = chrome.runtime.MessageSender;

describe('MessageHandler', () => {
  let messageHandler: MessageHandler;
  let solidApi: SolidApiMock;
  beforeEach(() => {
    solidApi = mockSolidApi();
    messageHandler = new MessageHandler(solidApi as unknown as SolidApi);
  });

  describe('handle type LOGIN', () => {
    it('calls login and returns undefined', async () => {
      const result = await messageHandler.handleMessage(
        {
          type: MessageType.LOGIN,
        },
        {} as MessageSender
      );
      expect(solidApi.login).toHaveBeenCalledWith();
      expect(result).toEqual({});
    });
  });
});
