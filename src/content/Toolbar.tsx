import React from 'react';
import * as PropTypes from 'prop-types';
import { useSolidApi } from '../api/apiContext';
import { usePage } from './usePage';
import { useProfile } from './useProfile';

export const Toolbar = () => {
  const solidApi = useSolidApi();
  const page = usePage();
  const { loading, profile } = useProfile();
  return loading ? (
    <p>Loading...</p>
  ) : (
    <>
      <p>{profile.name}</p>
      <button onClick={() => solidApi.bookmark(page)}>Clip it!</button>
    </>
  );
};

Toolbar.propTypes = {
  webId: PropTypes.string,
};
