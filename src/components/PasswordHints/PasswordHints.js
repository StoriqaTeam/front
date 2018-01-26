import React from 'react';
// import PropTypes from 'prop-types';

import './PasswordHints.scss';

const PasswordHints = () => (
  <aside styleName="passwordHints">
    <ul>
      <li>One lower case character</li>
      <li>One upper case character</li>
      <li>One number</li>
      <li>One upper special character</li>
      <li>8 characters minimum</li>
    </ul>
  </aside>
);

PasswordHints.propTypes = {
};

export default PasswordHints;
