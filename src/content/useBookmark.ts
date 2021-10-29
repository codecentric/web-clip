import { useEffect, useState } from 'react';
import { useSolidApi } from '../api/apiContext';
import { Bookmark } from '../api/SolidApi';
import { PageMetaData } from './usePage';

interface AsyncState<T> {
  loading: boolean;
  error: Error;
  result?: T;
}

export const useBookmark = (page: PageMetaData) => {
  const solidApi = useSolidApi();
  const [{ loading: saving, error, result }, setState] = useState<
    AsyncState<Bookmark>
  >({
    loading: false,
    error: null,
  });
  const [{ loading }, loadBookmarkResult] = useState<AsyncState<Bookmark>>({
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetch = async () => {
      loadBookmarkResult({ loading: false, error: null, result: null });
    };
    fetch();
  }, []);
  return {
    loading,
    saving,
    error,
    bookmark: result,
    addBookmark: async () => {
      setState({ loading: true, error: null });
      try {
        const bookmark = await solidApi.bookmark(page);
        setState({ loading: false, error: null, result: bookmark });
      } catch (error) {
        setState({ loading: false, error });
      }
    },
  };
};
