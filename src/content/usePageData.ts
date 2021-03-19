import { useEffect, useState } from 'react';
import { useStore } from '../store/context';

export const usePageData = (url: string) => {
  const [loading, setLoading] = useState(true);
  const store = useStore();
  useEffect(() => {
    store.importFromUrl(url).then(() => {
      setLoading(false);
    });
  }, [url]);
  return {
    loading,
  };
};
