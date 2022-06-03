import { renderHook } from '@testing-library/react-hooks';
import { when } from 'jest-when';
import { ProfileApi } from '../api/ProfileApi';
import { useOptions } from '../OptionsContext';
import { ActionType } from '../reducer';
import { initialState } from '../useOptionsPage';
import { useCheckAccessPermissions } from './useCheckAccessPermissions';

jest.mock('../OptionsContext');

describe('useCheckAccessPermissions', () => {
  let profileApi: ProfileApi;

  beforeEach(async () => {
    profileApi = {
      canExtensionAccessPod: jest.fn(),
    } as unknown as ProfileApi;
  });

  describe('when logged in with already granted permissions', () => {
    let dispatch: () => void;
    beforeEach(async () => {
      dispatch = jest.fn();
      when(useOptions).mockReturnValue({
        state: {
          ...initialState,
          sessionInfo: {
            ...initialState.sessionInfo,
            isLoggedIn: true,
          },
        },
        dispatch,
      });
      // given access permissions are already granted
      when(profileApi.canExtensionAccessPod)
        .calledWith(
          'chrome-extension://extension-id',
          'https://extension-id.chromiumapp.org'
        )
        .mockResolvedValue(true);
    });

    it('indicates checking access permission while checking', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useCheckAccessPermissions(
          'chrome-extension://extension-id',
          'https://extension-id.chromiumapp.org',
          profileApi
        )
      );

      expect(result.all[0]).toMatchObject({
        checking: false,
      });

      expect(result.current).toMatchObject({
        checking: true,
      });

      await waitForNextUpdate();

      expect(result.current).toMatchObject({
        checking: false,
      });
      expect(result.all).toHaveLength(3);
    });

    it('checks access permissions and dispatched trusted app event', async () => {
      const { waitForNextUpdate } = renderHook(() =>
        useCheckAccessPermissions(
          'chrome-extension://extension-id',
          'https://extension-id.chromiumapp.org',
          profileApi
        )
      );

      await waitForNextUpdate();

      expect(profileApi.canExtensionAccessPod).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith({ type: ActionType.TRUSTED_APP });
    });
  });

  describe('when logged but not granted permissions yet', () => {
    let dispatch: () => void;
    beforeEach(async () => {
      dispatch = jest.fn();
      when(useOptions).mockReturnValue({
        state: {
          ...initialState,
          sessionInfo: {
            ...initialState.sessionInfo,
            isLoggedIn: true,
          },
        },
        dispatch,
      });
      // given access permissions are already granted
      when(profileApi.canExtensionAccessPod)
        .calledWith(
          'chrome-extension://extension-id',
          'https://extension-id.chromiumapp.org'
        )
        .mockResolvedValue(false);
    });

    it('checks access permissions and dispatched trusted app event', async () => {
      const { waitForNextUpdate } = renderHook(() =>
        useCheckAccessPermissions(
          'chrome-extension://extension-id',
          'https://extension-id.chromiumapp.org',
          profileApi
        )
      );

      await waitForNextUpdate();

      expect(profileApi.canExtensionAccessPod).toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe('when not logged in', () => {
    beforeEach(async () => {
      when(useOptions).mockReturnValue({
        state: {
          ...initialState,
          sessionInfo: {
            ...initialState.sessionInfo,
            isLoggedIn: false,
          },
        },
        dispatch: () => null,
      });
    });

    it('does not check access permissions', async () => {
      const { result } = renderHook(() =>
        useCheckAccessPermissions(
          'chrome-extension://extension-id',
          'https://extension-id.chromiumapp.org',
          profileApi
        )
      );
      expect(result.current.checking).toBe(false);
      expect(profileApi.canExtensionAccessPod).not.toHaveBeenCalled();
    });
  });
});
