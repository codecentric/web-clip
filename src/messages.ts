export enum MessageType {
  ACTIVATE = 'ACTIVATE',
  LOGIN = 'LOGIN',
}

export type Message = {
  type: MessageType;
};
