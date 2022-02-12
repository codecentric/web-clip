import { renderHook } from '@testing-library/react-hooks';
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
});
