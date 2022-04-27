import { Options } from './optionsStorageApi';
import reducer, { ActionType, AsyncLoadingState } from './reducer';

describe('options reducer', () => {
  let newState: AsyncLoadingState<Options>;

  describe('OPTIONS_LOADED', () => {
    beforeEach(() => {
      newState = reducer(
        {
          loading: true,
          saved: false,
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
          loading: false,
          saved: false,
          value: {
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
        {
          loading: false,
          saved: false,
        },
        {
          type: ActionType.OPTIONS_SAVED,
        }
      );
    });

    it('sets saved to true', () => {
      expect(newState.saved).toBe(true);
    });
  });
});
