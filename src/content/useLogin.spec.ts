import { act, renderHook } from '@testing-library/react-hooks';
import { when } from 'jest-when';
import { MessageType } from '../messages';
import { sendMessage } from './sendMessage';
import { useLogin } from './useLogin';

jest.mock('./sendMessage');

describe('useLogin', () => {
  it('sends message to the background script on login', async () => {
    const { result } = renderHook(() => useLogin());
    await result.current.login();
    expect(sendMessage).toHaveBeenCalledWith({ type: MessageType.LOGIN });
  });
  it('returns error, when login failed', async () => {
    when(sendMessage)
      .calledWith({ type: MessageType.LOGIN })
      .mockRejectedValue(new Error('something went wrong'));
    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.login();
    });
    expect(result.all[1]).toMatchObject({
      error: 'something went wrong',
    });
  });
});
