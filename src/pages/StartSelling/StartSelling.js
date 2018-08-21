// @flow

import React from 'react';

import { HeaderResponsive, FooterResponsive, AppContext } from 'components/App';
import { Button } from 'components/common/Button';
import { Container, Col, Row } from 'layout';

import './StartSelling.scss';

const StartSelling = () => (
  <AppContext.Consumer>
    {({ environment }) => (
      <div>
        {/* <HeaderResponsive environment={environment} withoutCategories /> */}
        <div styleName="container">
          <div styleName="block-1">
            <div styleName="left">
              <div styleName="halfBlock">
                <div styleName="title">Millions of shoppers are waiting</div>
                <div styleName="titleSeparator" />
                <div styleName="subtitle">
                  Start selling now with Storiqa and see how it’s easy to trade
                  globally
                </div>
                <div styleName="button">Start selling</div>
              </div>
            </div>
            <div styleName="right">
              <img
                // eslint-disable-next-line
                src={require('./img/main.png')}
                alt="main"
              />
            </div>
          </div>
          <div styleName="block-2">
            <h2>STORIQA IS YOUR DOOR TO GLOBAL MARKET</h2>
          </div>
        </div>
        <FooterResponsive />
      </div>
    )}
  </AppContext.Consumer>
);

export default StartSelling;
