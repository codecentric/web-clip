import { act, renderHook } from '@testing-library/react-hooks';
import { when } from 'jest-when';
import { MessageType } from '../../domain/messages';
import { sendMessage } from '../../chrome/sendMessage';
import { useProfile } from './useProfile';

jest.mock('../../chrome/sendMessage');

describe('useProfile', () => {
  it('it returns a loading status while the profile is loading', () => {
    when(sendMessage)
      .calledWith({
        type: MessageType.LOAD_PROFILE,
      })
      .mockReturnValue(new Promise(() => null));

    const { result } = renderHook(() => useProfile());

    act(() => {
      expect(sendMessage).toHaveBeenCalledWith({
        type: MessageType.LOAD_PROFILE,
      });
      expect(result.all[0]).toEqual({
        loading: true,
      });
      expect(result.all).toHaveLength(1);
    });
  });

  it('returns the profile once it has been loaded', async () => {
    when(sendMessage)
      .calledWith({
        type: MessageType.LOAD_PROFILE,
      })
      .mockResolvedValue({
        name: 'Jane Doe',
      });

    const { result, waitForNextUpdate } = renderHook(() => useProfile());

    await waitForNextUpdate();

    act(() => {
      expect(result.all).toHaveLength(2);
      expect(result.all[0]).toEqual({
        loading: true,
      });
      expect(result.all[1]).toEqual({
        loading: false,
        profile: { name: 'Jane Doe' },
      });
    });
  });
});
