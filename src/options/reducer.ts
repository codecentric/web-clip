import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { Options } from './optionsStorageApi';

interface PageState<T> {
  loading: boolean;
  saved: boolean;
  unsavedChanges: boolean;
  sessionInfo: ISessionInfo;
  value?: T;
}

export enum ActionType {
  OPTIONS_LOADED = 'OPTIONS_LOADED',
  SET_PROVIDER_URL = 'SET_PROVIDER_URL',
  OPTIONS_SAVED = 'OPTIONS_SAVED',
  LOGGED_IN = 'LOGGED_IN',
  TRUSTED_APP = 'TRUSTED_APP',
  DISCONNECTED_POD = 'DISCONNECTED_POD',
  SELECTED_STORAGE_CONTAINER = 'SELECTED_STORAGE_CONTAINER',
}

export type State = PageState<Options>;
export type Action =
  | OptionsLoaded
  | SetProviderUrl
  | OptionsSaved
  | LoggedIn
  | TrustedApp
  | SelectedStorage
  | DisconnectedPod;
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

interface TrustedApp {
  type: ActionType.TRUSTED_APP;
}

interface SelectedStorage {
  type: ActionType.SELECTED_STORAGE_CONTAINER;
  payload: string;
}

interface DisconnectedPod {
  type: ActionType.DISCONNECTED_POD;
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
          trustedApp: false,
          providerUrl: action.payload,
        },
      };
    case ActionType.OPTIONS_SAVED:
      return {
        ...state,
        unsavedChanges: false,
        saved: true,
      };
    case ActionType.LOGGED_IN:
      return {
        ...state,
        unsavedChanges: true, // assume a new provider url needs to be saved
        sessionInfo: action.payload,
      };
    case ActionType.TRUSTED_APP:
      return {
        ...state,
        unsavedChanges: true,
        value: {
          ...state.value,
          trustedApp: true,
        },
      };
    case ActionType.SELECTED_STORAGE_CONTAINER:
      return {
        ...state,
        value: {
          ...state.value,
          containerUrl: action.payload,
        },
        unsavedChanges: true,
      };
    case ActionType.DISCONNECTED_POD:
      return {
        ...state,
        unsavedChanges: true,
        value: {
          ...state.value,
          providerUrl: '',
          containerUrl: '',
          trustedApp: false,
        },
      };
  }
};
