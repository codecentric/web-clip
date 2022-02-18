export enum MessageType {
  ACTIVATE = 'ACTIVATE',
  LOGIN = 'LOGIN',
  LOGGED_IN = 'LOGGED_IN',
}

export type Message = {
  type: MessageType;
  payload?: unknown;
};

export type Response = {
  message?: string;
};
