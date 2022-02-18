export enum MessageType {
  ACTIVATE = 'ACTIVATE',
  LOGIN = 'LOGIN',
  LOGGED_IN = 'LOGGED_IN',
  LOAD_PROFILE = 'LOAD_PROFILE',
}

export type Message = {
  type: MessageType;
  payload?: unknown;
};

export type Response = {
  payload?: unknown;
};
