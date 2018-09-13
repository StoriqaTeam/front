// @flow

import React from 'react';

import { Button } from 'components/common/Button';
import { Icon } from 'components/Icon';

import './StoreHeaderButtons.scss';

const StoreHeaderButtons = () => (
  <div styleName="container">
    <Button disabled big onClick={() => {}}>
      <span styleName="buttonText">
        <span styleName="buttonIcon email">
          <Icon type="email" size={20} />
        </span>
        Message <span styleName="message">to seller</span>
      </span>
    </Button>
    <Button disabled big wireframe onClick={() => {}}>
      <span styleName="buttonText">
        <span styleName="buttonIcon phone">
          <Icon type="phone" size={20} />
        </span>{' '}
        Call seller
      </span>
    </Button>
  </div>
);

export default StoreHeaderButtons;
