import * as PropTypes from 'prop-types';
import React from 'react';
import { useBookmark } from './useBookmark';
import { usePage } from './usePage';
import { useProfile } from './useProfile';

export const Toolbar = () => {
  const {
    addBookmark,
    loading: addBookmarkLoading,
    error: addBookmarkError,
  } = useBookmark();
  const page = usePage();
  const { loading: profileLoading, profile } = useProfile();
  return profileLoading ? (
    <p>Loading...</p>
  ) : (
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
