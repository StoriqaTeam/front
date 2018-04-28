import React from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import './ShowPassword.scss';

type PropTypes = {
  show: boolean,
  onClick: Function,
  onMouseDown: Function,
  onMouseUp: Function,
  onMouseOut: Function,
};

const ShowPassword = (props: PropTypes) => {
  const { show, onClick, onMouseDown, onMouseUp, onMouseOut } = props;
  const iconType = show ? 'eyeBlue' : 'eye';
  return (
    <button
      type="button"
      styleName="container"
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseOut={onMouseOut}
      onBlur={() => {}}
    >
      <Icon type={iconType} />{' '}
      <small styleName={classNames({ show })}>Show</small>
    </button>
  );
};

export default ShowPassword;
