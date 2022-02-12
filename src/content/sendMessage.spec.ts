import { when } from 'jest-when';
import { MessageType } from '../messages';
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
    it('promise resolves to callback response', async () => {
      when(chrome.runtime.sendMessage).mockImplementation(
        (message: unknown, callback?: (response: string) => void) => {
          callback('response data');
        }
      );
      const result = await sendMessage({ type: MessageType.LOGIN });
      expect(result).toEqual('response data');
    });
    it('promise rejects in case of an error', async () => {
      when(chrome.runtime.sendMessage).mockImplementation(
        (message: unknown, callback?: (response: string) => void) => {
          chrome.runtime.lastError = new Error('something went wrong');
          callback(undefined);
        }
      );
      const promise = sendMessage({ type: MessageType.LOGIN });
      await expect(promise).rejects.toEqual(new Error('something went wrong'));
    });
  });
});
