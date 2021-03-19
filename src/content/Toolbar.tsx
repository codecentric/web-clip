import * as PropTypes from 'prop-types';
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
  } = useBookmark();
  const page = usePage();
  return (
    <>
      <p>{profile.name}</p>
      <button disabled={addBookmarkLoading} onClick={() => addBookmark(page)}>
        {addBookmarkLoading ? 'Saving...' : 'Clip it!'}
      </button>
      {addBookmarkError && <p>{addBookmarkError.message}</p>}
    </>
  );
};

Toolbar.propTypes = {
  webId: PropTypes.string,
};
