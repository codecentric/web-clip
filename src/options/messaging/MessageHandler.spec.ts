import { MessageType } from '../../messages';
import { ActionType } from '../reducer';
import { MessageHandler } from './MessageHandler';

describe('MessageHandler', () => {
  describe('when ACCESS_GRANTED handled', () => {
    it('it dispatches trusted app action and returns nothing', async () => {
      const dispatch = jest.fn();
      const handler = new MessageHandler(dispatch);
      const result = await handler.handleMessage(
        {
          type: MessageType.ACCESS_GRANTED,
        },
        {}
      );
      expect(result).toEqual({});
      expect(dispatch).toHaveBeenCalledWith({
        type: ActionType.TRUSTED_APP,
      });
    });
  });
});
