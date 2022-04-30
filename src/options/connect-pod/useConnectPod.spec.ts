import { renderHook } from '@testing-library/react-hooks';
import { when } from 'jest-when';
import { useOptions } from '../OptionsContext';
import { ActionType } from '../reducer';
import { initialState } from '../useOptionsPage';
import { useConnectPod } from './useConnectPod';

jest.mock('../OptionsContext');

describe('useConnectPod', () => {
  it('returns provider url', () => {
    when(useOptions).mockReturnValue({
      state: {
        ...initialState,
        value: {
          ...initialState.value,
          providerUrl: 'https://provider.test',
        },
      },
      dispatch: () => null,
    });
    const render = renderHook(() => useConnectPod());
    expect(render.result.current).toMatchObject({
      providerUrl: 'https://provider.test',
    });
  });

  it('dispatches SET_PROVIDER_URL', () => {
    const dispatch = jest.fn();
    when(useOptions).mockReturnValue({
      state: {
        ...initialState,
      },
      dispatch,
    });
    const render = renderHook(() => useConnectPod());
    render.result.current.setProviderUrl('https://new.provider.test');
    expect(dispatch).toHaveBeenCalledWith({
      type: ActionType.SET_PROVIDER_URL,
      payload: 'https://new.provider.test',
    });
  });

  it('dispatches session info on login', () => {
    const dispatch = jest.fn();
    when(useOptions).mockReturnValue({
      state: {
        ...initialState,
      },
      dispatch,
    });
    const render = renderHook(() => useConnectPod());
    render.result.current.onLogin({
      isLoggedIn: true,
      webId: 'https://alice.test#me',
      sessionId: '1',
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionType.LOGGED_IN,
      payload: {
        isLoggedIn: true,
        webId: 'https://alice.test#me',
        sessionId: '1',
      },
    });
  });
});
