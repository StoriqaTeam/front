import React from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import './ShowPassword.scss';

type PropTypes = {
  show: boolean,
  onClick: Function,
}

const ShowPassword = (props: PropTypes) => {
  const { show, onClick } = props;
  return (
    <button
      type="button"
      styleName="container"
      onClick={onClick}
    >
      <Icon type={show ? 'eyeBlue' : 'eye'} /> <small styleName={classNames({ show })}>Show</small>
    </button>
  );
};

export default ShowPassword;
