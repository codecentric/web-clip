import { act, renderHook } from '@testing-library/react-hooks';
import { useProfile } from './useProfile';
import { mockSolidApi } from '../test/solidApiMock';

jest.mock('../api/apiContext');

describe('useProfile', () => {
  it('it returns a loading status while the profile is loading', () => {
    const solidApi = mockSolidApi();

    solidApi.loadProfile.mockReturnValue(new Promise(() => null));

    const { result } = renderHook(() => useProfile());

    act(() => {
      expect(solidApi.loadProfile).toHaveBeenCalled();
      expect(result.current.loading).toBe(true);
      expect(result.current.profile).toBe(null);
    });
  });

  it('returns the profile once it has been loaded', async () => {
    const solidApi = mockSolidApi();

    solidApi.loadProfile.mockResolvedValue({
      name: 'Jane Doe',
    });

    const { result, waitForNextUpdate } = renderHook(() => useProfile());

    await waitForNextUpdate();

    act(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.profile).toEqual({ name: 'Jane Doe' });
    });
  });
});
