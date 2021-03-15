import { useEffect, useState } from 'react';

import { useOptionsStorage } from './useOptionsStorage';

export const useOptions = () => {
  const { save, load } = useOptionsStorage();
  const [{ loading, value }, setState] = useState({
    loading: true,
    value: null,
  });
  useEffect(() => {
    load().then((options) => {
      setState({
        loading: false,
        value: options,
      });
    });
  }, []);
  const setProviderUrl = (url: string) => {
    setState((state) => ({
      ...state,
      value: {
        ...state.value,
        providerUrl: url,
      },
    }));
  };
  return {
    loading,
    ...value,
    setProviderUrl,
    save,
  };
};
