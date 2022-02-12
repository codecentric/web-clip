import { useCallback, useState } from 'react';
import { useSolidApi } from '../api/apiContext';
import { MessageType } from '../messages';

function backgroundLogin() {
  chrome.runtime.sendMessage({ type: MessageType.LOGIN }, function (response) {
    console.log('login response', response);
  });
}

export const useLegacyLogin = () => {
  const solidApi = useSolidApi();
  const [error, setError] = useState(null);

  const login = useCallback(async () => {
    try {
      await solidApi.login();
      // await backgroundLogin();
    } catch (err) {
      setError(err.message);
    }
  }, [solidApi]);

  return {
    login,
    error,
  };
};
