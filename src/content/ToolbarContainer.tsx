import * as PropTypes from 'prop-types';
import React from 'react';
import { Toolbar } from './Toolbar';
import { useProfile } from './useProfile';

export const ToolbarContainer = () => {
  const { loading: profileLoading, profile } = useProfile();
  return profileLoading ? <p>Loading...</p> : <Toolbar profile={profile} />;
};

ToolbarContainer.propTypes = {
  webId: PropTypes.string,
};
