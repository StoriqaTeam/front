// @flow

import React, { PureComponent } from 'react';

import { SearchInput } from 'components/SearchInput';
import { ProfileMenu } from 'components/ProfileMenu';
import { CartButton } from 'components/CartButton';
import { Button } from 'components/Button';

import { Container, Row, Col } from 'layout';

import './Header.scss';

import Logo from './svg/logo.svg';

type PropsType = {
  user: ?{},
};

class Header extends PureComponent<PropsType> {
  render() {
    return (
      <header styleName="container">
        <Container>
          <Row>
            <Col size={12}>
              <div styleName="wrap">
                <div styleName="logo">
                  <Logo styleName="logo" />
                </div>
                <div styleName="searchInput">
                  <SearchInput
                    searchCategories={[
                      { id: 0, label: 'Shops' },
                      { id: 1, label: 'Products' },
                      { id: 2, label: 'All' },
                    ]}
                  />
                </div>
                <div styleName="profileIcon">
                  <ProfileMenu />
                </div>
                <div styleName="cartIcon">
                  <CartButton />
                </div>
                <div styleName="buttonWrapper">
                  <Button
                    wireframe
                  >
                    Start selling
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </header>
    );
  }
}

export default Header;
