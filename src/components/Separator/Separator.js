import React from 'react';
import PropTypes from 'prop-types';

const Separator = ({ text = '' }) => (
  <hr className="separator" text={text} />
);

Separator.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Separator;
