// @flow strict

import React from 'react';

import { Footer } from 'components/App';

import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';
import { Container } from 'layout';

import './index.scss';

const PasswordResetDeny = () => (
  <Container>
    <div styleName="header">
      <Icon type="logo" />
    </div>
    <div styleName="body">
      <h1>Confirm Password Reset</h1>
      <div styleName="text">
        Sorry, but you must confirm the new password through the Ture mobile
        app.
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

export default PasswordResetDeny;
