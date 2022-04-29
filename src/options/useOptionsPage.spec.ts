import { act, renderHook, RenderResult } from '@testing-library/react-hooks';
import { when } from 'jest-when';
import { useAuthentication } from './auth/AuthenticationContext';
import { ActionType } from './reducer';
import { useOptionsPage } from './useOptionsPage';
import { save as saveOptions, load as loadOptions } from './optionsStorageApi';
import { checkAccessPermissions } from './checkAccessPermissions';

jest.mock('./optionsStorageApi');
jest.mock('./checkAccessPermissions');
jest.mock('./auth/AuthenticationContext');

describe('useOptionsPage', () => {
  let renderResult: RenderResult<ReturnType<typeof useOptionsPage>>;

  beforeEach(async () => {
    when(useAuthentication).mockReturnValue({
      session: {
        info: {
          isLoggedIn: false,
          sessionId: '1234',
        },
      },
      redirectUrl: '',
    });
    (saveOptions as jest.Mock).mockResolvedValue(undefined);
    (loadOptions as jest.Mock).mockResolvedValue({
      trustedApp: false,
      providerUrl: 'https://pod.provider.example',
    });
  });

  describe('on mount', () => {
    beforeEach(async () => {
      const render = renderHook(() => useOptionsPage());
      renderResult = render.result;
      await render.waitForNextUpdate();
    });

    it('indicates loading', async () => {
      expect(renderResult.all[0]).toMatchObject({
        state: { loading: true },
      });
    });

    it('returns loaded options', async () => {
      expect(renderResult.all[1]).toMatchObject({
        state: {
          loading: false,
          value: {
            providerUrl: 'https://pod.provider.example',
          },
        },
      });
    });
  });

  describe('after login', () => {
    it('checks access permissions and saves options', async () => {
      (saveOptions as jest.Mock).mockResolvedValue(null);

      // given access permissions are already granted
      (checkAccessPermissions as jest.Mock).mockResolvedValue(true);

      const { result, waitForNextUpdate, waitFor } = renderHook(() =>
        useOptionsPage()
      );

      await waitFor(() => !result.current.state.loading);

      expect(result.current.state.value.providerUrl).toBe(
        'https://pod.provider.example'
      );

      act(() => {
        result.current.dispatch({
          type: ActionType.SET_PROVIDER_URL,
          payload: 'https://new.provider.example',
        });
      });

      await waitFor(
        () =>
          result.current.state.value.providerUrl ===
          'https://new.provider.example'
      );

      expect(result.current.state.value.providerUrl).toBe(
        'https://new.provider.example'
      );
      expect(result.current.state.loading).toBe(false);

      act(() => {
        result.current.dispatch({
          type: ActionType.LOGGED_IN,
          payload: {
            sessionId: 'test-session',
            webId: 'https://alice.test#me',
            isLoggedIn: true,
          },
        });
      });

      await waitForNextUpdate();

      expect(result.current.state.saved).toBe(true);
      expect(result.current.state.value.trustedApp).toBe(true);
      expect(saveOptions).toHaveBeenCalledWith({
        trustedApp: true,
        providerUrl: 'https://new.provider.example',
      });
    });

    it('checks access permissions and saves without being trusted yet', async () => {
      (saveOptions as jest.Mock).mockResolvedValue(null);

      // given access permissions are missing
      (checkAccessPermissions as jest.Mock).mockResolvedValue(false);

      const { result, waitFor, waitForNextUpdate } = renderHook(() =>
        useOptionsPage()
      );

      await waitFor(() => !result.current.state.loading);

      result.current.dispatch({
        type: ActionType.SET_PROVIDER_URL,
        payload: 'https://new.provider.example',
      });

      await waitFor(
        () =>
          result.current.state.value.providerUrl ===
          'https://new.provider.example'
      );

      result.current.dispatch({
        type: ActionType.LOGGED_IN,
        payload: {
          sessionId: 'test-session',
          webId: 'https://alice.test#me',
          isLoggedIn: true,
        },
      });

      await waitForNextUpdate();

      expect(saveOptions).toHaveBeenCalledWith({
        trustedApp: false,
        providerUrl: 'https://new.provider.example',
      });
      expect(result.current.state.saved).toBe(true);
      expect(result.current.state.value.trustedApp).toBe(false);
    });
  });
});
