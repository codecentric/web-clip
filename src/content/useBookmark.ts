import { useState } from 'react';
import { useSolidApi } from '../api/apiContext';
import { PageMetaData } from './usePage';

interface AsyncState {
  loading: boolean;
  error: Error;
}

export const useBookmark = () => {
  const solidApi = useSolidApi();
  const [{ loading, error }, setState] = useState<AsyncState>({
    loading: false,
    error: null,
  });
  return {
    loading,
    error,
    addBookmark: async (page: PageMetaData) => {
      setState({ loading: true, error: null });
      try {
        await solidApi.bookmark(page);
        setState({ loading: false, error: null });
      } catch (error) {
        setState({ loading: false, error });
      }
    },
  };
};
