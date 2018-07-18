// @flow

import React from 'react';
import { Link } from 'found';

import { Count } from 'components/Count';
import { Icon } from 'components/Icon';

import './UserDropdown.scss';

type PropsTypes = {
  lastName: ?string,
  firstName: ?string,
  messagesCount: number,
  email: string,
  avatar: string,
  storeId: number,
};

const ProfileMenu = ({
  lastName,
  firstName,
  messagesCount,
  email,
  avatar,
  storeId,
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
      <a href="/" styleName="item">
        <span>Messages</span>
        {Boolean(messagesCount) && (
          <div styleName="count">
            <Count tip amount={messagesCount} styles="blue" />
          </div>
        )}
      </a>
      <Link
        to="/profile"
        styleName="item"
        data-test="header-user-menu-profileLink"
      >
        Profile settings
      </Link>
      <a href="/" styleName="item">
        History
      </a>
      {(storeId && (
        <a href={`/manage/store/${storeId}`} styleName="item">
          <span>My shops</span>
        </a>
      )) || (
        <a href="/manage/wizard" styleName="item">
          <span>My shops</span>
        </a>
      )}
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
