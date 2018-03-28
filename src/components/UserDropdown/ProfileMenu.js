// @flow

import React from 'react';
import { Link } from 'found';

import { Count } from 'components/Count';

import './UserDropdown.scss';

type PropsTypes = {
  name: string,
  messagesCount: number,
  shopsCount: number,
};

const ProfileMenu = ({ name, messagesCount, shopsCount }: PropsTypes) => (
  <div styleName="menu">
    <div styleName="name">
      <strong>{name}</strong>
    </div>
    <div styleName="items">
      <a href="/" styleName="item">
        <span>Messages</span>
        {Boolean(messagesCount) &&
          <div styleName="count">
            <Count
              tip
              amount={messagesCount}
              styles="blue"
            />
          </div>
        }
      </a>
      <a href="/" styleName="item">Profile settings</a>
      <a href="/" styleName="item">History</a>
      <a href="/" styleName="item">
        <span>My shops</span>
        {Boolean(shopsCount) &&
          <div styleName="count">
            <Count
              amount={shopsCount}
              styles="green"
            />
          </div>
        }
      </a>
    </div>
    <Link
      styleName="logout"
      to="/logout"
    >
      Logout
    </Link>
  </div>
);

export default ProfileMenu;
