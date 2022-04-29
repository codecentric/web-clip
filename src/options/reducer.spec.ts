import reducer, { ActionType, State } from './reducer';
import { initialState } from './useOptionsPage';

describe('options reducer', () => {
  let newState: State;

  describe('OPTIONS_LOADED', () => {
    beforeEach(() => {
      newState = reducer(
        {
          ...initialState,
          loading: true,
          value: {
            providerUrl: '',
          },
        },
        {
          type: ActionType.OPTIONS_LOADED,
          payload: {
            providerUrl: 'https://pod.provider.test',
          },
        }
      );
    });

    it('sets loading to false', () => {
      expect(newState.loading).toBe(false);
    });

    it('updates the option values', () => {
      expect(newState.value).toEqual({
        providerUrl: 'https://pod.provider.test',
      });
    });
  });

  describe('SET_PROVIDER_URL', () => {
    beforeEach(() => {
      newState = reducer(
        {
          ...initialState,
          value: {
            ...initialState.value,
            providerUrl: 'https://old.provider.test',
          },
        },
        {
          type: ActionType.SET_PROVIDER_URL,
          payload: 'https://new.provider.test',
        }
      );
    });

    it('sets the new provider url', () => {
      expect(newState.value.providerUrl).toBe('https://new.provider.test');
    });
  });

  describe('OPTIONS_SAVED', () => {
    beforeEach(() => {
      newState = reducer(
        { ...initialState, saved: false },
        {
          type: ActionType.OPTIONS_SAVED,
        }
      );
    });

    it('sets saved to true', () => {
      expect(newState.saved).toBe(true);
    });
  });

  describe('LOGGED_IN', () => {
    beforeEach(() => {
      newState = reducer(initialState, {
        type: ActionType.LOGGED_IN,
        payload: {
          sessionId: '1',
          webId: 'https://alice.test#me',
          isLoggedIn: true,
        },
      });
    });

    it('sets session info', () => {
      expect(newState.sessionInfo).toEqual({
        sessionId: '1',
        webId: 'https://alice.test#me',
        isLoggedIn: true,
      });
    });
  });
});
