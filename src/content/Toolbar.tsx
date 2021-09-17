import React from 'react';
import { useBookmark } from './useBookmark';
import { usePage } from './usePage';

interface Props {
  profile: {
    name: string;
  };
}

export const Toolbar = ({ profile }: Props) => {
  const {
    addBookmark,
    loading: addBookmarkLoading,
    error: addBookmarkError,
    bookmark,
  } = useBookmark();
  const page = usePage();
  return (
    <>
      <p className="my-1">{profile.name}</p>
      <button
        className="my-1 px-4 py-2 bg-blue-400 rounded text-white hover:opacity-90 font-bold"
        disabled={addBookmarkLoading}
        onClick={() => addBookmark(page)}
      >
        {addBookmarkLoading ? 'Saving...' : 'Clip it!'}
      </button>
      {addBookmarkError && <p>{addBookmarkError.message}</p>}
      {bookmark && (
        <p className="my-1 text-blue-400 opacity-90 hover:opacity-100">
          <a href={bookmark.uri} target="_blank" rel="noreferrer">
            Show in pod
          </a>
        </p>
      )}
    </>
  );
};
