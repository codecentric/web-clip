import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { Options } from './optionsStorageApi';

interface PageState<T> {
  loading: boolean;
  saved: boolean;
  sessionInfo: ISessionInfo;
  value?: T;
}

export enum ActionType {
  OPTIONS_LOADED = 'OPTIONS_LOADED',
  SET_PROVIDER_URL = 'SET_PROVIDER_URL',
  OPTIONS_SAVED = 'OPTIONS_SAVED',
  LOGGED_IN = 'LOGGED_IN',
}

export type State = PageState<Options>;
export type Action = OptionsLoaded | SetProviderUrl | OptionsSaved | LoggedIn;
export type Dispatch = (action: Action) => void;

interface OptionsLoaded {
  type: ActionType.OPTIONS_LOADED;
  payload: Options;
}

interface SetProviderUrl {
  type: ActionType.SET_PROVIDER_URL;
  payload: string;
}

interface LoggedIn {
  type: ActionType.LOGGED_IN;
  payload: ISessionInfo;
}

interface OptionsSaved {
  type: ActionType.OPTIONS_SAVED;
}

export default (
  state: PageState<Options>,
  action: Action
): PageState<Options> => {
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
    case ActionType.LOGGED_IN:
      return {
        ...state,
        sessionInfo: action.payload,
      };
  }
};
