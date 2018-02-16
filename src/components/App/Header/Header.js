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
          <Logo />
        </div>
        <SearchInput />
        <ProfileMenu />
        <CartButton />
        <Button
          wireframe
        >
          Start selling
        </Button>
      </div>
    );
  }
}

export default Header;
