import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { Bookmark } from './Bookmark';
import { PageMetaData } from './PageMetaData';

export enum MessageType {
  ACTIVATE = 'ACTIVATE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGGED_IN = 'LOGGED_IN',
  LOAD_PROFILE = 'LOAD_PROFILE',
  LOAD_BOOKMARK = 'LOAD_BOOKMARK',
  ADD_BOOKMARK = 'ADD_BOOKMARK',
  IMPORT_PAGE_DATA = 'IMPORT_PAGE_DATA',
  OPEN_OPTIONS = 'OPEN_OPTIONS',
  ACCESS_GRANTED = 'ACCESS_GRANTED',
}

export type Message =
  | ActivateMessage
  | OpenOptionsMessage
  | LoginMessage
  | LogoutMessage
  | LoggedInMessage
  | LoadProfileMessage
  | LoadBookmarkMessage
  | AddBookmarkMessage
  | ImportPageDataMessage
  | AccessGranted;

export type ActivateMessage = {
  type: MessageType.ACTIVATE;
  payload: ISessionInfo & { providerUrl: string };
};

export type OpenOptionsMessage = {
  type: MessageType.OPEN_OPTIONS;
};

export type LoginMessage = {
  type: MessageType.LOGIN;
};

export type LogoutMessage = {
  type: MessageType.LOGOUT;
};

export type LoggedInMessage = {
  type: MessageType.LOGGED_IN;
  payload: ISessionInfo;
};

export type LoadProfileMessage = {
  type: MessageType.LOAD_PROFILE;
};

export type LoadBookmarkMessage = {
  type: MessageType.LOAD_BOOKMARK;
  payload: {
    page: PageMetaData;
  };
};

export type AddBookmarkMessage = {
  type: MessageType.ADD_BOOKMARK;
  payload: {
    page: PageMetaData;
    bookmark?: Bookmark;
  };
};

export type ImportPageDataMessage = {
  type: MessageType.IMPORT_PAGE_DATA;
  payload: {
    url: string;
  };
};

export type AccessGranted = {
  type: MessageType.ACCESS_GRANTED;
};

export type Response = {
  payload?: unknown;
  errorMessage?: string;
};
