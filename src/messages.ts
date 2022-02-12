export enum MessageType {
  ACTIVATE = 'ACTIVATE',
  LOGIN = 'LOGIN',
}

export type Message = {
  type: MessageType;
};

export type Response = {
  message?: string;
};
