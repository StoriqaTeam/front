// @flow

import React from 'react';

import { FooterResponsive } from 'components/App';
import { Button } from 'components/common/Button';
import { Container } from 'layout';

import { StartSellingHeader, StartSellingMarket, StartSellingForSellers } from './index';

import './StartSelling.scss';

const StartSelling = () => (
  <Container>
    <div styleName="container">
      <StartSellingHeader />
      <StartSellingMarket />
      <StartSellingForSellers />
      <FooterResponsive />
    </div>
  </Container>
);

export default StartSelling;
