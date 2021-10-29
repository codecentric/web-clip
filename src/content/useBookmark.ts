import { useEffect, useState } from 'react';
import { useSolidApi } from '../api/apiContext';
import { Bookmark } from '../api/SolidApi';
import { PageMetaData } from './usePage';

interface AsyncState<T> {
  loading: boolean;
  saving: boolean;
  error: Error;
  result?: T;
}

export const useBookmark = (page: PageMetaData) => {
  const solidApi = useSolidApi();
  const [{ loading, saving, error, result: bookmark }, setState] = useState<
    AsyncState<Bookmark>
  >({
    loading: true,
    saving: false,
    error: null,
  });

  useEffect(() => {
    solidApi.loadBookmark(page).then((bookmark) => {
      setState((state) => ({
        ...state,
        loading: false,
        error: null,
        result: bookmark,
      }));
    });
  }, [solidApi]);

  return {
    loading,
    saving,
    error,
    bookmark,
    addBookmark: async () => {
      setState((state) => ({ ...state, saving: true }));
      try {
        const bookmark = await solidApi.bookmark(page);
        setState((state) => ({
          ...state,
          saving: false,
          error: null,
          result: bookmark,
        }));
      } catch (error) {
        setState((state) => ({ ...state, saving: false, error }));
      }
    },
  };
};
