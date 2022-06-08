import { renderHook } from '@testing-library/react-hooks';
import { when } from 'jest-when';
import { SolidSession } from '../api/SolidSession';
import { useAuthentication } from '../auth/AuthenticationContext';
import { useOptions } from '../OptionsContext';
import { ActionType, Dispatch } from '../reducer';
import { initialState } from '../useOptionsPage';
import { useConnectionEstablished } from './useConnectionEstablished';

jest.mock('../OptionsContext');
jest.mock('../auth/AuthenticationContext');

describe('useConnectionEstablished', () => {
  let session: SolidSession;
  let dispatch: Dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
    session = {
      logout: jest.fn().mockResolvedValue(null),
    } as unknown as SolidSession;
    when(useAuthentication).mockReturnValue({
      session,
      redirectUrl: '',
    });
  });

  it('returns provider url', () => {
    when(useOptions).mockReturnValue({
      state: {
        ...initialState,
        value: {
          ...initialState.value,
          providerUrl: 'https://provider.test',
        },
      },
      dispatch,
    });
    const render = renderHook(() => useConnectionEstablished());
    expect(render.result.current).toMatchObject({
      providerUrl: 'https://provider.test',
    });
  });

  describe('on disconnect', () => {
    beforeEach(() => {
      when(useOptions).mockReturnValue({
        state: {
          ...initialState,
        },
        dispatch,
      });
      const render = renderHook(() => useConnectionEstablished());
      render.result.current.disconnect();
    });
    it('dispatches disconnected pod event', () => {
      expect(dispatch).toHaveBeenCalledWith({
        type: ActionType.DISCONNECTED_POD,
      });
    });

    it('logs out from current session', () => {
      expect(session.logout).toHaveBeenCalled();
    });
  });
});
