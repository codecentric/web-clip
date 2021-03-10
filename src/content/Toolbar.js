import React from 'react';
import * as PropTypes from 'prop-types';

export const Toolbar = ({ webId }) => (
  <>
    {webId}
    <button>Clip it</button>
  </>
);

Toolbar.propTypes = {
  webId: PropTypes.string,
};
