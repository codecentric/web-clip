import { useEffect, useState } from 'react';
import { Bookmark } from '../api/SolidApi';
import { MessageType } from '../messages';
import { sendMessage } from './sendMessage';
import { PageMetaData } from './usePage';

interface AsyncState<T> {
  loading: boolean;
  saving: boolean;
  error: Error;
  result?: T;
}

export const useBookmark = (page: PageMetaData) => {
  const [{ loading, saving, error, result: bookmark }, setState] = useState<
    AsyncState<Bookmark>
  >({
    loading: true,
    saving: false,
    error: null,
  });

  useEffect(() => {
    sendMessage({
      type: MessageType.LOAD_BOOKMARK,
      payload: page,
    })
      .then((bookmark: Bookmark) => {
        setState((state) => ({
          ...state,
          loading: false,
          error: null,
          result: bookmark,
        }));
      })
      .catch((error) => {
        setState((state) => ({
          ...state,
          loading: false,
          error,
        }));
      });
  }, []);

  return {
    loading,
    saving,
    error,
    bookmark,
    addBookmark: async () => {
      setState((state) => ({ ...state, saving: true }));
      try {
        const saved = (await sendMessage({
          type: MessageType.ADD_BOOKMARK,
          payload: {
            page,
            bookmark,
          },
        })) as Bookmark;
        setState((state) => ({
          ...state,
          saving: false,
          error: null,
          result: saved,
        }));
      } catch (error) {
        setState((state) => ({ ...state, saving: false, error }));
      }
    },
  };
};
