import { useCallback, useState } from 'react';
import { MessageType } from '../messages';
import { sendMessage } from './sendMessage';

export const useLogin = () => {
  const [error, setError] = useState(null);

  const login = useCallback(async () => {
    try {
      await sendMessage({ type: MessageType.LOGIN });
    } catch (error) {
      setError(error);
    }
  }, []);
  return {
    login,
    error,
  };
};
