// @flow

import React from 'react';

import { Container, Row, Col } from 'layout';
import { Icon } from 'components/Icon';

import './Footer.scss';

const Footer = () => (
  <footer styleName="container">
    <Container>
      <Row>
        <Col size={12}>
          <div styleName="navBlock">
            <div>
              Logo
              <div>
                Storiqa is a global marketplace for any kind
                of legal goods supporting cryptocurrency payments
              </div>
            </div>
            <div>
              <div className="navHeader">Storiqa market</div>
              <div className="navItem">Распродажа</div>
              <div className="navItem">Рекумендуемое</div>
              <div className="navItem">Популярное</div>
              <div className="navItem">Обзоры</div>
            </div>
            <div>
              <div className="navHeader">Разделы</div>
              <div className="navItem">Витрина</div>
              <div className="navItem">Товары</div>
              <div className="navItem">Магазины</div>
              <div className="navItem">Storiqa Community</div>
            </div>
            <div>
              <div className="navHeader">Сервисы</div>
              <div className="navItem">Quality Assurance</div>
              <div className="navItem">Storiqa wallet</div>
            </div>
            <div></div>
          </div>
          <div styleName="infoBlock">
            <div></div>
            <div></div>
            <div>
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
