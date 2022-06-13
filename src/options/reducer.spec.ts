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
            trustedApp: false,
            providerUrl: '',
            containerUrl: '',
          },
        },
        {
          type: ActionType.OPTIONS_LOADED,
          payload: {
            trustedApp: true,
            providerUrl: 'https://pod.provider.test',
            containerUrl: 'https://pod.provider.test/alice/webclip',
          },
        }
      );
    });

    it('sets loading to false', () => {
      expect(newState.loading).toBe(false);
    });

    it('updates the option values', () => {
      expect(newState.value).toEqual({
        trustedApp: true,
        providerUrl: 'https://pod.provider.test',
        containerUrl: 'https://pod.provider.test/alice/webclip',
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
            trustedApp: true,
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

    it('resets the pod trust', () => {
      expect(newState.value.trustedApp).toBe(false);
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

    it('resets unsaved changes indication', () => {
      expect(newState.unsavedChanges).toBe(false);
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

    it('indicates unsaved changes', () => {
      expect(newState.unsavedChanges).toBe(true);
    });
  });
  describe('TRUSTED_APP', () => {
    beforeEach(() => {
      newState = reducer(
        {
          ...initialState,
          value: { ...initialState.value, trustedApp: false },
        },
        {
          type: ActionType.TRUSTED_APP,
        }
      );
    });

    it('sets session info', () => {
      expect(newState.value.trustedApp).toBe(true);
    });

    it('indicates unsaved changes', () => {
      expect(newState.unsavedChanges).toBe(true);
    });
  });

  describe('DISCONNECTED_POD', () => {
    beforeEach(() => {
      newState = reducer(
        {
          ...initialState,
          value: {
            ...initialState.value,
            trustedApp: true,
            providerUrl: 'https://old.provider.test',
          },
        },
        {
          type: ActionType.DISCONNECTED_POD,
        }
      );
    });

    it('clears provider url', () => {
      expect(newState.value.providerUrl).toBe('');
    });

    it('resets the pod trust', () => {
      expect(newState.value.trustedApp).toBe(false);
    });

    it('indicates unsaved changes', () => {
      expect(newState.unsavedChanges).toBe(true);
    });
  });
});
