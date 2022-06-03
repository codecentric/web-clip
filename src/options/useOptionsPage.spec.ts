import { act, renderHook, RenderResult } from '@testing-library/react-hooks';

import { when } from 'jest-when';
import { useAuthentication } from './auth/AuthenticationContext';
import { load as loadOptions, save as saveOptions } from './optionsStorageApi';
import { ActionType } from './reducer';
import { useOptionsPage } from './useOptionsPage';

jest.mock('./optionsStorageApi');
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

  describe('auto saves', () => {
    it('when provider url changes, it saves after login', async () => {
      (saveOptions as jest.Mock).mockResolvedValue(null);

      const { result, waitFor, waitForNextUpdate } = renderHook(() =>
        useOptionsPage()
      );

      await waitFor(() => !result.current.state.loading);

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

      expect(result.current.state.loading).toBe(false);

      expect(result.current.state.saved).toBe(false);
      expect(saveOptions).not.toHaveBeenCalled();

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
      expect(saveOptions).toHaveBeenCalledWith({
        trustedApp: false,
        providerUrl: 'https://new.provider.example',
      });
    });

    it('when app is trusted', async () => {
      (saveOptions as jest.Mock).mockResolvedValue(null);

      const { result, waitFor } = renderHook(() => useOptionsPage());

      await waitFor(() => !result.current.state.loading);

      act(() => {
        result.current.dispatch({
          type: ActionType.TRUSTED_APP,
        });
      });

      await waitFor(() => result.current.state.value.trustedApp === true);

      expect(result.current.state.loading).toBe(false);

      expect(result.current.state.saved).toBe(true);
      expect(saveOptions).toHaveBeenCalledWith({
        trustedApp: true,
        providerUrl: 'https://pod.provider.example',
      });
    });
  });
});
