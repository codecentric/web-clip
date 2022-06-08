import { when } from 'jest-when';
import { closeTab } from '../../chrome/closeTab';
import { MessageType, Response } from '../../messages';
import { ActionType, Dispatch } from '../reducer';
import { MessageHandler } from './MessageHandler';

jest.mock('../../chrome/closeTab');

describe('MessageHandler', () => {
  let dispatch: Dispatch;
  let result: Promise<Response> | boolean;
  let handler: MessageHandler;

  beforeEach(() => {
    dispatch = jest.fn();
    handler = new MessageHandler(dispatch);
  });

  describe('when message is not relevant', () => {
    beforeEach(() => {
      result = handler.handleMessage(
        {
          type: MessageType.LOGIN,
        },
        {
          tab: {
            id: 123456,
          } as chrome.tabs.Tab,
        }
      );
    });

    it('returns false synchronously', () => {
      expect(result).toBe(false);
    });
  });

  describe('when ACCESS_GRANTED handled', () => {
    beforeEach(async () => {
      when(closeTab).mockResolvedValue(null);
      const handler = new MessageHandler(dispatch);
      result = handler.handleMessage(
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

    it('it resolves to empty response', async () => {
      await expect(result).resolves.toEqual({});
    });

    it('it closes the sending tab', async () => {
      expect(closeTab).toHaveBeenCalledWith(123456);
    });
  });
});
