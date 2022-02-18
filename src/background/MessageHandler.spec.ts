import { SolidApi } from '../api/SolidApi';
import { MessageType } from '../messages';
import { mockSolidApi, SolidApiMock } from '../test/solidApiMock';
import { MessageHandler } from './MessageHandler';

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
        {}
      );
      expect(solidApi.login).toHaveBeenCalledWith();
      expect(result).toEqual({});
    });
  });

  describe('handle type LOAD_PROFILE', () => {
    it('calls loadProfile and returns result', async () => {
      solidApi.loadProfile.mockResolvedValue({
        name: 'Jane Doe',
      });

      const result = await messageHandler.handleMessage(
        {
          type: MessageType.LOAD_PROFILE,
        },
        {}
      );
      expect(solidApi.loadProfile).toHaveBeenCalled();
      expect(result).toEqual({
        payload: {
          name: 'Jane Doe',
        },
      });
    });
  });
});
