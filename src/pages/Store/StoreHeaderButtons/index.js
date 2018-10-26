// @flow

import React from 'react';

import { Button } from 'components/common/Button';
import { Icon } from 'components/Icon';

import './StoreHeaderButtons.scss';

import t from './i18n';

const StoreHeaderButtons = () => (
  <div styleName="container">
    <Button disabled big>
      <span styleName="buttonText">
        <span styleName="buttonIcon email">
          <Icon type="email" size={20} />
        </span>
        {t.message} <span styleName="message">{t.toSeller}</span>
      </span>
    </Button>
    <Button disabled big wireframe onClick={() => {}}>
      <span styleName="buttonText">
        <span styleName="buttonIcon phone">
          <Icon type="phone" size={20} />
        </span>{' '}
        {t.callSeller}
      </span>
    </Button>
  </div>
);

export default StoreHeaderButtons;
