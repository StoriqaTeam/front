// @flow strict

import React from 'react';

import { Icon } from 'components/Icon';

import './WalletCode.scss';

const WalletCode = () => (
  <div styleName="container">
    <div styleName="label">
      <strong>Android coming soon</strong>
    </div>
    <div styleName="left">
      <div styleName="logo">
        <Icon type="logo" size={32} />
      </div>
      <div styleName="title">
        <strong>Ture Wallet App</strong>
      </div>
      <div styleName="desc">
        Download Ture app and make your payments easier
      </div>
      <div styleName="buttons">
        <a
          href={process.env.REACT_APP_WALLET_APPLE_URL}
          target="_blank"
          styleName="appleButton"
        >
          <img
            src="https://s3.eu-west-2.amazonaws.com/storiqa/img-82bCkjF40pAC.png"
            alt="apple"
          />
        </a>
      </div>
    </div>
    <div styleName="right">
      <div styleName="qr">
        <img
          src="https://s3.eu-west-2.amazonaws.com/storiqa/img-OgQBzw5AvKkC-medium.png"
          alt="qr"
        />
      </div>
    </div>
  </div>
);

export default WalletCode;
