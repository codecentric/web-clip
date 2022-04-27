import { Options } from './optionsStorageApi';

export interface AsyncLoadingState<T> {
  loading: boolean;
  saved: boolean;
  value?: T;
}

export enum ActionType {
  OPTIONS_LOADED = 'OPTIONS_LOADED',
  SET_PROVIDER_URL = 'SET_PROVIDER_URL',
  OPTIONS_SAVED = 'OPTIONS_SAVED',
}

type Action = OptionsLoaded | SetProviderUrl | OptionsSaved;

interface OptionsLoaded {
  type: ActionType.OPTIONS_LOADED;
  payload: Options;
}

interface SetProviderUrl {
  type: ActionType.SET_PROVIDER_URL;
  payload: string;
}

interface OptionsSaved {
  type: ActionType.OPTIONS_SAVED;
}

export default (
  state: AsyncLoadingState<Options>,
  action: Action
): AsyncLoadingState<Options> => {
  switch (action.type) {
    case ActionType.OPTIONS_LOADED:
      return {
        ...state,
        loading: false,
        value: action.payload,
      };
    case ActionType.SET_PROVIDER_URL:
      return {
        ...state,
        value: {
          ...state.value,
          providerUrl: action.payload,
        },
      };
    case ActionType.OPTIONS_SAVED:
      return {
        ...state,
        saved: true,
      };
    default:
      throw new Error();
  }
};
