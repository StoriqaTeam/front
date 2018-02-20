// @flow

import React, { PureComponent } from 'react';

import { SearchInput } from 'components/SearchInput';
import { ProfileMenu } from 'components/ProfileMenu';
import { CartButton } from 'components/CartButton';
import { Button } from 'components/Button';

import './Header.scss';

import Logo from './svg/logo.svg';

type PropsType = {
  //
};

class Header extends PureComponent<PropsType> {
  render() {
    return (
      <div styleName="container">
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
    );
  }
}

export default Header;
