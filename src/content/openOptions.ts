import { MessageType } from '../messages';
import { sendMessage } from './sendMessage';

export const openOptions = () =>
  sendMessage({ type: MessageType.OPEN_OPTIONS });
