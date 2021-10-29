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
  const [{ loading: saving, error, result }, setSavingState] = useState<
    AsyncState<Bookmark>
  >({
    loading: false,
    error: null,
  });
  const [{ loading }, setLoadBookmarkState] = useState<AsyncState<Bookmark>>({
    loading: true,
    error: null,
  });

  useEffect(() => {
    solidApi.loadBookmark(page).then(() => {
      setLoadBookmarkState({ loading: false, error: null, result: null });
    });
  }, [solidApi]);

  return {
    loading,
    saving,
    error,
    bookmark: result,
    addBookmark: async () => {
      setSavingState({ loading: true, error: null });
      try {
        const bookmark = await solidApi.bookmark(page);
        setSavingState({ loading: false, error: null, result: bookmark });
      } catch (error) {
        setSavingState({ loading: false, error });
      }
    },
  };
};
