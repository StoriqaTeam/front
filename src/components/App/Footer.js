// @flow

import React from 'react';

import { Container, Row, Col } from 'layout';
import { Icon } from 'components/Icon';
import { Button } from 'components/Button';

import './Footer.scss';

const Footer = () => (
  <footer styleName="container">
    <Container>
      <Row>
        <Col size={12}>
          <div styleName="navBlock">
            <div styleName="navBlockLogo">
              <Icon type="logo" />
              <div styleName="description">
                Storiqa is a global marketplace for any kind
                of legal goods supporting cryptocurrency payments
              </div>
            </div>
            <div styleName="navBlockItem market">
              <div styleName="navHeader">
                <b>Storiqa market</b>
              </div>
              <a href="/" styleName="navItem">Sale</a>
              <a href="/" styleName="navItem">Recommended</a>
              <a href="/" styleName="navItem">Popular</a>
              <a href="/" styleName="navItem">Reviews</a>
            </div>
            <div styleName="navBlockItem sections">
              <div styleName="navHeader">
                <b>Sections</b>
              </div>
              <a href="/" styleName="navItem">Showcase</a>
              <a href="/" styleName="navItem">Goods</a>
              <a href="/" styleName="navItem">Shops</a>
              <a href="/" styleName="navItem">Storiqa Community</a>
            </div>
            <div styleName="navBlockItem services">
              <div styleName="navHeader">
                <b>Services</b>
              </div>
              <a href="/" styleName="navItem">Quality Assurance</a>
              <a href="/" styleName="navItem">Storiqa wallet</a>
            </div>
            <div styleName="navBlockButton">
              <Button href={process.env.REACT_APP_HOST ? `${process.env.REACT_APP_HOST}/manage/store/new` : '/'}>
                Start selling
              </Button>
            </div>
          </div>
          <div styleName="infoBlock">
            <div styleName="address">Storiqa Global Trades inc. Hong-Kong, Sunset Roadway 20 287</div>
            <a href="mailto:support@storiqa.com" styleName="email">support@storiqa.com</a>
            <div styleName="aboutNavBlock">
              <div styleName="aboutNavItem">
                <a href="/">About Storiqa</a>
              </div>
              <div styleName="aboutNavItem">
                <a href="/">Privacy Policy</a>
              </div>
              <div styleName="aboutNavItem">
                <a href="/">Help</a>
              </div>
              <div styleName="aboutNavItem">
                <a href="/">Conditions of use</a>
              </div>
            </div>
            <div styleName="icons">
              <Icon type="facebookGray" size="32" />
              <Icon type="pinterestGray" size="32" />
              <Icon type="twitterGray" size="32" />
              <Icon type="instagramGray" size="32" />
              <Icon type="vkGray" size="32" />
            </div>
          </div>
          <div styleName="rightsBlock">© Storiqa Marketplace. All rights reserved. 2018</div>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
