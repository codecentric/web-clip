import * as PropTypes from 'prop-types';
import React from 'react';
import { useBookmark } from './useBookmark';
import { usePage } from './usePage';
import { useProfile } from './useProfile';

export const Toolbar = () => {
  const { addBookmark } = useBookmark();
  const page = usePage();
  const { loading, profile } = useProfile();
  return loading ? (
    <p>Loading...</p>
  ) : (
    <>
      <p>{profile.name}</p>
      <button onClick={() => addBookmark(page)}>Clip it!</button>
    </>
  );
};

Toolbar.propTypes = {
  webId: PropTypes.string,
};
