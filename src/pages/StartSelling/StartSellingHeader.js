// flow@

import React from 'react';
import { Link } from 'found';
import { Icon } from 'components/Icon';
import { Container, Row } from 'layout';

import './StartSellingHeader.scss';

type PropsType = {
  lang: string,
};

const StartSellingHeader = ({ lang }: PropsType) => (
  <Container>
    <Row>
      <header styleName="container">
        <div styleName="logo">
          <div styleName="logoIcon">
            <Link to="/" data-test="logoLink">
              <Icon type="logo" />
            </Link>
          </div>
          <div styleName="text">
            <strong>
              {lang === 'ru'
                ? 'Онлайн-маркетплейс'
                : 'Online crypto marketplace'}
            </strong>
          </div>
        </div>
      </header>
    </Row>
  </Container>
);

export default StartSellingHeader;
