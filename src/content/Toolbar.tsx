import React from 'react';
import * as PropTypes from 'prop-types';
import { useSolidApi } from '../api/apiContext';
import { usePage } from './usePage';

interface ToolbarProps {
  webId: string;
}

export const Toolbar = ({ webId }: ToolbarProps) => {
  const solidApi = useSolidApi();
  const page = usePage();
  return (
    <>
      {webId}
      <button onClick={() => solidApi.bookmark(page)}>Clip it!</button>
    </>
  );
};

Toolbar.propTypes = {
  webId: PropTypes.string,
};
