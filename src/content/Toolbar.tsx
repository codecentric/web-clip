import React from 'react';
import * as PropTypes from 'prop-types';
import { bookmark } from '../api/solidApi';
import { usePage } from './usePage';

interface ToolbarProps {
  webId: string;
}

export const Toolbar = ({ webId }: ToolbarProps) => {
  const page = usePage();
  return (
    <>
      {webId}
      <button onClick={() => bookmark(page)}>Clip it!</button>
    </>
  );
};

Toolbar.propTypes = {
  webId: PropTypes.string,
};
