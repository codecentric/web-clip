import { closeTab } from '../../chrome/closeTab';
import { MessageType, Response } from '../../messages';
import { ActionType, Dispatch } from '../reducer';
import { MessageHandler } from './MessageHandler';

jest.mock('../../chrome/closeTab');

describe('MessageHandler', () => {
  describe('when ACCESS_GRANTED handled', () => {
    let dispatch: Dispatch;
    let result: Response;
    beforeEach(async () => {
      dispatch = jest.fn();
      const handler = new MessageHandler(dispatch);
      result = await handler.handleMessage(
        {
          type: MessageType.ACCESS_GRANTED,
        },
        {
          tab: {
            id: 123456,
          } as chrome.tabs.Tab,
        }
      );
    });

    it('it dispatches trusted app action', async () => {
      expect(dispatch).toHaveBeenCalledWith({
        type: ActionType.TRUSTED_APP,
      });
    });

    it('it returns nothing', async () => {
      expect(result).toEqual({});
    });

    it('it closes the sending tab', async () => {
      expect(closeTab).toHaveBeenCalledWith(123456);
    });
  });
});
