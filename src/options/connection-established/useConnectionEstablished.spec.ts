import { renderHook } from '@testing-library/react-hooks';
import { when } from 'jest-when';
import { useConnectPod } from '../connect-pod/useConnectPod';
import { useOptions } from '../OptionsContext';
import { ActionType } from '../reducer';
import { initialState } from '../useOptionsPage';
import { useConnectionEstablished } from './useConnectionEstablished';

jest.mock('../OptionsContext');

describe('useConnectionEstablished', () => {
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
    const render = renderHook(() => useConnectionEstablished());
    expect(render.result.current).toMatchObject({
      providerUrl: 'https://provider.test',
    });
  });

  it('dispatches disconnected pod event on disconnect', () => {
    const dispatch = jest.fn();
    when(useOptions).mockReturnValue({
      state: {
        ...initialState,
      },
      dispatch,
    });
    const render = renderHook(() => useConnectionEstablished());
    render.result.current.disconnect();
    expect(dispatch).toHaveBeenCalledWith({
      type: ActionType.DISCONNECTED_POD,
    });
  });
});
