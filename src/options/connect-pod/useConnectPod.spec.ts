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
          providerUrl: 'https://provider.test',
        },
      },
      save: () => null,
      dispatch: () => null,
    });
    const render = renderHook(() => useConnectPod());
    expect(render.result.current).toMatchObject({
      providerUrl: 'https://provider.test',
    });
  });

  it('returns saved true', () => {
    when(useOptions).mockReturnValue({
      state: {
        ...initialState,
        saved: true,
      },
      save: () => null,
      dispatch: () => null,
    });
    const render = renderHook(() => useConnectPod());
    expect(render.result.current).toMatchObject({
      saved: true,
    });
  });

  it('dispatches SET_PROVIDER_URL', () => {
    const dispatch = jest.fn();
    when(useOptions).mockReturnValue({
      state: {
        ...initialState,
      },
      save: () => null,
      dispatch,
    });
    const render = renderHook(() => useConnectPod());
    render.result.current.setProviderUrl('https://new.provider.test');
    expect(dispatch).toHaveBeenCalledWith({
      type: ActionType.SET_PROVIDER_URL,
      payload: 'https://new.provider.test',
    });
  });

  it('saves on login', () => {
    const save = jest.fn();
    when(useOptions).mockReturnValue({
      state: {
        ...initialState,
      },
      save,
      dispatch: () => null,
    });
    const render = renderHook(() => useConnectPod());
    render.result.current.onLogin();
    expect(save).toHaveBeenCalled();
  });
});
