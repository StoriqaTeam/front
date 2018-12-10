// @flow strict

import React from 'react';

import { Footer } from 'components/App';

import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';
import { Container } from 'layout';

import './index.scss';

const EmailConfirmed = () => (
  <Container>
    <div styleName="header">
      <Icon type="logo" />
    </div>
    <div styleName="body">
      <h1>Registration complete</h1>
      <div styleName="text">
        Your journey to digital currencies starts here. TURE is crypto wallet
        powered by marketplace Storiqa.
        <br />
        Your registration is completed.This account is usable for both products
        TURE and Storiqa.
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

export default EmailConfirmed;
