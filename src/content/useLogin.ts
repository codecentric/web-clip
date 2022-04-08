import { useCallback, useState } from 'react';
import { MessageType } from '../messages';
import { sendMessage } from './sendMessage';

export const useLogin = () => {
  const [state, setState] = useState({
    loading: false,
    error: null,
  });

  const login = useCallback(async () => {
    try {
      setState({ loading: true, error: null });
      await sendMessage({ type: MessageType.LOGIN });
      setState({ loading: false, error: null });
    } catch (error) {
      setState({
        loading: false,
        error,
      });
    }
  }, []);
  return {
    login,
    ...state,
  };
};
