export enum MessageType {
  ACTIVATE = 'ACTIVATE',
  LOGIN = 'LOGIN',
  LOGGED_IN = 'LOGGED_IN',
}

export type Message = {
  type: MessageType;
};

export type Response = {
  message?: string;
};
