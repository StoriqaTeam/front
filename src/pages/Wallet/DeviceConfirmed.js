// @flow strict

import React from 'react';

import { Footer } from 'components/App';

import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';
import { Container } from 'layout';

import './index.scss';

const DeviceConfirmed = () => (
  <Container>
    <div styleName="header">
      <Icon type="logo" />
    </div>
    <div styleName="body">
      <h1>Your device is confirmed</h1>
      <div styleName="text">
        Thank you, your device has been successfully added to the allowed list.
        <br />
        Your journey to digital currencies starts here. TURE is crypto wallet
        powered by marketplace Storiqa.
      </div>
      <div styleName="btn">
        <Button
          onClick={() => {
            window.location = '/';
          }}
        >
          Go to marketplace
        </Button>
      </div>
    </div>
    <Footer isShopCreated />
  </Container>
);

export default DeviceConfirmed;
