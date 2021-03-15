import { useState } from 'react';

import { useOptionsStorage } from './useOptionsStorage';

export const useOptions = () => {
  const { save } = useOptionsStorage();
  const [providerUrl, setProviderUrl] = useState('https://solidcommunity.net');
  return {
    providerUrl,
    setProviderUrl,
    save,
  };
};
