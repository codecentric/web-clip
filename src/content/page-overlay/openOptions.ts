import { MessageType } from '../../domain/messages';
import { sendMessage } from '../messaging/sendMessage';

export const openOptions = () =>
  sendMessage({ type: MessageType.OPEN_OPTIONS });
