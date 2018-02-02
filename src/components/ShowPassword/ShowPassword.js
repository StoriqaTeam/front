import React from 'react';

import EyeOpenIcon from 'assets/svg/eye-open.svg';

import './ShowPassword.scss';

type PropTypes = {
  onClick: Function,
}

const ShowPassword = (props: PropTypes) => (
  <button
    type="button"
    styleName="container"
    onClick={props.onClick}
  >
    <EyeOpenIcon /> <small>Show</small>
  </button>
);

export default ShowPassword;
