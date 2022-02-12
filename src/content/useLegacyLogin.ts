import { useCallback, useState } from 'react';
import { useSolidApi } from '../api/apiContext';

export const useLegacyLogin = () => {
  const solidApi = useSolidApi();
  const [error, setError] = useState(null);

  const login = useCallback(async () => {
    try {
      await solidApi.login();
    } catch (err) {
      setError(err.message);
    }
  }, [solidApi]);

  return {
    login,
    error,
  };
};
