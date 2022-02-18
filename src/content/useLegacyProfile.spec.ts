import { act, renderHook } from '@testing-library/react-hooks';
import { useLegacyProfile } from './useLegacyProfile';
import { mockSolidApi } from '../test/solidApiMock';

jest.mock('../api/apiContext');

describe('useLegcayProfile', () => {
  it('it returns a loading status while the profile is loading', () => {
    const solidApi = mockSolidApi();

    solidApi.loadProfile.mockReturnValue(new Promise(() => null));

    const { result } = renderHook(() => useLegacyProfile());

    act(() => {
      expect(solidApi.loadProfile).toHaveBeenCalled();
      expect(result.all[0]).toEqual({
        loading: true,
      });
      expect(result.all).toHaveLength(1);
    });
  });

  it('returns the profile once it has been loaded', async () => {
    const solidApi = mockSolidApi();

    solidApi.loadProfile.mockResolvedValue({
      name: 'Jane Doe',
    });

    const { result, waitForNextUpdate } = renderHook(() => useLegacyProfile());

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
