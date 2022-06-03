import { act, renderHook } from '@testing-library/react-hooks';
import { when } from 'jest-when';
import { MessageType } from '../messages';
import { sendMessage } from './sendMessage';
import { useLogin } from './useLogin';

jest.mock('./sendMessage');

describe('useLogin', () => {
  it('returns loading false', () => {
    const { result } = renderHook(() => useLogin());
    expect(result.current).toMatchObject({
      loading: false,
    });
  });

  it('sends message to the background script on login', async () => {
    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.login();
    });
    expect(sendMessage).toHaveBeenCalledWith({ type: MessageType.LOGIN });
  });

  it('indicates loading and no error while logging in', async () => {
    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.login();
    });
    expect(result.all).toHaveLength(3);
    expect(result.all[0]).toMatchObject({
      loading: false,
      error: null,
    });
    expect(result.all[1]).toMatchObject({
      loading: true,
      error: null,
    });
    expect(result.all[2]).toMatchObject({
      loading: false,
      error: null,
    });
  });

  it('returns error and stops loading, when login failed', async () => {
    when(sendMessage)
      .calledWith({ type: MessageType.LOGIN })
      .mockRejectedValue(new Error('something went wrong'));
    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.login();
    });
    expect(result.all[0]).toMatchObject({
      loading: false,
      error: null,
    });
    expect(result.all[1]).toMatchObject({
      loading: true,
      error: null,
    });
    expect(result.all[2]).toMatchObject({
      loading: false,
      error: new Error('something went wrong'),
    });
  });
});
