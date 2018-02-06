import React from 'react';

import { Tooltip } from 'components/Tooltip';

import './CapsLockMessage.scss';

const CapsLockMessage = () => (
  <div styleName="container">
    <Tooltip text="CAPS LOCK is on" />
  </div>
);

export default CapsLockMessage;
