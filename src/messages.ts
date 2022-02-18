import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { Bookmark } from './api/SolidApi';
import { PageMetaData } from './content/usePage';

export enum MessageType {
  ACTIVATE = 'ACTIVATE',
  LOGIN = 'LOGIN',
  LOGGED_IN = 'LOGGED_IN',
  LOAD_PROFILE = 'LOAD_PROFILE',
  LOAD_BOOKMARK = 'LOAD_BOOKMARK',
  ADD_BOOKMARK = 'ADD_BOOKMARK',
}

export type Message =
  | ActivateMessage
  | LoginMessage
  | LoggedInMessage
  | LoadProfileMessage
  | LoadBookmarkMessage
  | AddBookmarkMessage;

export type ActivateMessage = {
  type: MessageType.ACTIVATE;
};

export type LoginMessage = {
  type: MessageType.LOGIN;
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

export type Response = {
  payload?: unknown;
};
