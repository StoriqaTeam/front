// @flow

import React from 'react';
import { Link } from 'found';

import { convertSrc } from 'utils';

import { Icon } from 'components/Icon';

import '../UserDropdown.scss';

import t from './i18n';

type PropsTypes = {
  lastName: ?string,
  firstName: ?string,
  email: string,
  avatar: string,
  myStoreId: ?number,
  isWizardComplete: boolean,
};

// TODO: need back & refactor
const getStoreLink = (myStoreId: ?number) => {
  if (myStoreId) {
    return `/manage/store/${myStoreId}`;
  }
  return '/start-selling';
};

const ProfileMenu = ({
  lastName,
  firstName,
  // messagesCount,
  email,
  avatar,
  myStoreId,
  isWizardComplete,
}: PropsTypes) => (
  <div styleName="menu">
    <div styleName="top">
      <div styleName="icon">
        {avatar ? (
          <img styleName="topImg" src={convertSrc(avatar, 'small')} alt="img" />
        ) : (
          <Icon type="person" size={32} />
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
        {t.orders}
      </Link>
      <Link
        to="/profile"
        styleName="item"
        data-test="header-user-menu-profileLink"
      >
        {t.profileSettings}
      </Link>
      <Link
        to={getStoreLink(isWizardComplete && myStoreId ? myStoreId : null)}
        styleName="item"
        data-test="header-user-menu-myShops"
      >
        <span>{isWizardComplete ? t.myShop : t.startSelling}</span>
      </Link>
    </div>
    <Link
      styleName="logout"
      to="/logout"
      data-test="header-user-menu-logoutLink"
    >
      <Icon inline type="logout" size={24} />
      <span styleName="logoutText">{t.logout}</span>
    </Link>
  </div>
);

export default ProfileMenu;
