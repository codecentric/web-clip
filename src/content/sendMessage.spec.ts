import { when } from 'jest-when';
import { MessageType, Response } from '../messages';
import { sendMessage } from './sendMessage';

describe('messages', () => {
  describe('sendMessage', () => {
    it('sends message via chrome runtime', async () => {
      sendMessage({ type: MessageType.LOGIN }).then();
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(
        { type: MessageType.LOGIN },
        expect.any(Function)
      );
    });
    it('promise rejects if response is null', async () => {
      when(chrome.runtime.sendMessage).mockImplementation(
        (message: unknown, callback?: (response: Response) => void) => {
          callback(null);
        }
      );
      const promise = sendMessage({ type: MessageType.LOGIN });
      await expect(promise).rejects.toEqual(
        new Error('response to LOGIN message was null')
      );
    });
    it('promise resolves to callback response', async () => {
      when(chrome.runtime.sendMessage).mockImplementation(
        (message: unknown, callback?: (response: Response) => void) => {
          callback({
            payload: 'response data',
          });
        }
      );
      const result = await sendMessage({ type: MessageType.LOGIN });
      expect(result).toEqual('response data');
    });
    it('promise rejects in case of a runtime error', async () => {
      when(chrome.runtime.sendMessage).mockImplementation(
        (message: unknown, callback?: (response: Response) => void) => {
          chrome.runtime.lastError = new Error('something went wrong');
          callback(undefined);
        }
      );
      const promise = sendMessage({ type: MessageType.LOGIN });
      await expect(promise).rejects.toEqual(new Error('something went wrong'));
    });
    it('promise rejects in case of an error response', async () => {
      when(chrome.runtime.sendMessage).mockImplementation(
        (message: unknown, callback?: (response: Response) => void) => {
          callback({ errorMessage: 'something went wrong' });
        }
      );
      const promise = sendMessage({ type: MessageType.LOGIN });
      await expect(promise).rejects.toEqual(new Error('something went wrong'));
    });
  });
});
