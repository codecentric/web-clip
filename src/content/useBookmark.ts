import { useState } from 'react';
import { useSolidApi } from '../api/apiContext';
import { PageMetaData } from './usePage';

export const useBookmark = () => {
  const solidApi = useSolidApi();
  const [loading, setLoading] = useState(false);
  return {
    loading: loading,
    addBookmark: async (page: PageMetaData) => {
      setLoading(true);
      await solidApi.bookmark(page);
      setLoading(false);
    },
  };
};
