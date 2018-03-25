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
            <div styleName="navBlockItem">
              <Icon type="logo" />
              <div styleName="description">
                Storiqa is a global marketplace for any kind
                of legal goods supporting cryptocurrency payments
              </div>
            </div>
            <div styleName="navBlockItem">
              <div styleName="navHeader">
                <b>Storiqa market</b>
              </div>
              <a href="#" styleName="navItem">Распродажа</a>
              <a href="#" styleName="navItem">Рекумендуемое</a>
              <a href="#" styleName="navItem">Популярное</a>
              <a href="#" styleName="navItem">Обзоры</a>
            </div>
            <div styleName="navBlockItem">
              <div styleName="navHeader">
                <b>Разделы</b>
              </div>
              <a href="#" styleName="navItem">Витрина</a>
              <a href="#" styleName="navItem">Товары</a>
              <a href="#" styleName="navItem">Магазины</a>
              <a href="#" styleName="navItem">Storiqa Community</a>
            </div>
            <div styleName="navBlockItem">
              <div styleName="navHeader">
                <b>Сервисы</b>
              </div>
              <a href="#" styleName="navItem">Quality Assurance</a>
              <a href="#" styleName="navItem">Storiqa wallet</a>
            </div>
            <div styleName="navBlockItem">
              <Button onClick={() => {}}>
                Стать продавцом
              </Button>
            </div>
          </div>
          <div styleName="infoBlock">
            <div styleName="address">Storiqa Global Trades inc. Hong-Kong, Sunset Roadway 20 287</div>
            <a href="mailto:support@storiqa.com" styleName="email">support@storiqa.com</a>
            <div styleName="aboutNavBlock">
              <div styleName="aboutNavItem">
                <a href="#">About Storiqa</a>
              </div>
              <div styleName="aboutNavItem">
                <a href="#">Privacy Policy</a>
              </div>
              <div styleName="aboutNavItem">
                <a href="#">Help</a>
              </div>
              <div styleName="aboutNavItem">
                <a href="#">Conditions of use</a>
              </div>
            </div>
            <div styleName="icons">
              <Icon type="facebookG" size="32" />
              <Icon type="pinterestG" size="32" />
              <Icon type="twitterG" size="32" />
              <Icon type="instagramG" size="32" />
              <Icon type="vkG" size="32" />
            </div>
          </div>
          <div styleName="rightsBlock">© Storiqa Marketplace. All rights reserved. 2018</div>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
