import { act, renderHook, RenderResult } from '@testing-library/react-hooks';
import { when } from 'jest-when';
import { useAuthentication } from './auth/AuthenticationContext';
import { ActionType } from './reducer';
import { useOptionsPage } from './useOptionsPage';
import { save as saveOptions, load as loadOptions } from './optionsStorageApi';

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
      providerUrl: 'https://pod.provider.example',
    });
    const render = renderHook(() => useOptionsPage());
    renderResult = render.result;

    await render.waitForNextUpdate();
  });

  describe('on mount', () => {
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

  describe('save options', () => {
    it('saves the provider url after login', async () => {
      (saveOptions as jest.Mock).mockResolvedValue(null);
      const { result, waitForNextUpdate } = renderHook(() => useOptionsPage());

      act(() => {
        result.current.dispatch({
          type: ActionType.SET_PROVIDER_URL,
          payload: 'https://new.provider.example',
        });
      });

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

      expect(saveOptions).toHaveBeenCalledWith({
        providerUrl: 'https://new.provider.example',
      });
      expect(result.current.state.saved).toBe(true);
    });
  });
});
