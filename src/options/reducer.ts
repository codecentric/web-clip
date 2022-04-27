import { Options } from './optionsStorageApi';

export interface AsyncLoadingState<T> {
  loading: boolean;
  value?: T;
}

export enum ActionType {
  SET_PROVIDER_URL = 'SET_PROVIDER_URL',
  OPTIONS_LOADED = 'OPTIONS_LOADED',
}

type Action = OptionsLoaded | SetProviderUrl;

interface OptionsLoaded {
  type: ActionType.OPTIONS_LOADED;
  payload: Options;
}

interface SetProviderUrl {
  type: ActionType.SET_PROVIDER_URL;
  payload: string;
}

export default (
  state: AsyncLoadingState<Options>,
  action: Action
): AsyncLoadingState<Options> => {
  switch (action.type) {
    case ActionType.OPTIONS_LOADED:
      return {
        loading: false,
        value: action.payload,
      };
    case ActionType.SET_PROVIDER_URL:
      return {
        ...state,
        value: {
          providerUrl: action.payload,
        },
      };
    default:
      throw new Error();
  }
};
