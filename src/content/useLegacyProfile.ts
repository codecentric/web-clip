import { useSolidApi } from '../api/apiContext';
import { useEffect, useState } from 'react';
import { Profile } from '../api/SolidApi';

interface AsyncState<T> {
  loading: boolean;
  value?: T;
}

export const useLegacyProfile = () => {
  const solidApi = useSolidApi();
  const [{ loading, value }, setState] = useState<AsyncState<Profile>>({
    loading: true,
  });

  useEffect(() => {
    solidApi.loadProfile().then((profile) => {
      setState({
        loading: false,
        value: profile,
      });
    });
  }, [solidApi]);

  return { loading, profile: value };
};
