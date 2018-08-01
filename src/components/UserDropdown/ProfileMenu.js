// @flow

import React from 'react';
import { Link } from 'found';

import { Icon } from 'components/Icon';

import './UserDropdown.scss';

type PropsTypes = {
  lastName: ?string,
  firstName: ?string,
  email: string,
  avatar: string,
  myStoreId: ?number,
};

// TODO: need back & refactor
const getStoreLink = (myStoreId: ?number) => {
  if (myStoreId) {
    return `/manage/store/${myStoreId}`;
  }
  return '/manage/wizard';
};

const ProfileMenu = ({
  lastName,
  firstName,
  // messagesCount,
  email,
  avatar,
  myStoreId,
}: PropsTypes) => (
  <div styleName="menu">
    <div styleName="top">
      <div styleName="icon">
        {avatar ? (
          <img styleName="topImg" src={avatar} alt="img" />
        ) : (
          <Icon type="person" size="32" />
        )}
      </div>
      <div styleName="personalData">
        <div styleName="name">
          <span>{firstName || '\u00A0'}</span>
          <br />
          <span>{lastName || '\u00A0'}</span>
        </div>
        <div styleName="email">{email}</div>
      </div>
    </div>
    <div styleName="items">
      <Link
        to="/profile/orders"
        styleName="item"
        data-test="header-user-menu-profileOrdersLink"
      >
        Orders
      </Link>
      <Link
        to="/profile"
        styleName="item"
        data-test="header-user-menu-profileLink"
      >
        Profile settings
      </Link>
      <Link to={getStoreLink(myStoreId)} styleName="item">
        <span>{myStoreId ? 'My shop' : 'Start selling'}</span>
      </Link>
    </div>
    <Link
      styleName="logout"
      to="/logout"
      data-test="header-user-menu-logoutLink"
    >
      <Icon inline type="logout" size="24" />
      <span styleName="logoutText">Logout</span>
    </Link>
  </div>
);

export default ProfileMenu;
