import { useCallback } from 'react';
import { MessageType } from '../messages';
import { sendMessage } from './sendMessage';

export const useLogin = () => {
  const login = useCallback(async () => {
    await sendMessage({ type: MessageType.LOGIN });
  }, []);
  return {
    login,
  };
};
