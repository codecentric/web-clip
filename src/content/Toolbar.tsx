import React from 'react';
import * as PropTypes from 'prop-types';
import { useSolidApi } from '../api/apiContext';
import { usePage } from './usePage';

export const Toolbar = () => {
  const solidApi = useSolidApi();
  const page = usePage();
  const { name } = solidApi.getProfile();
  return (
    <>
      <p>{name}</p>
      <button onClick={() => solidApi.bookmark(page)}>Clip it!</button>
    </>
  );
};

Toolbar.propTypes = {
  webId: PropTypes.string,
};
