// @flow

import React, { PureComponent } from 'react';
import { pathOr } from 'ramda';
import classNames from 'classnames';

import { Dropdown } from 'components/Dropdown';
import { Icon } from 'components/Icon';
import { Count } from 'components/Count';

import './ProfileMenu.scss';

type PropsTypes = {
  profile: {
    name: string,
    messagesCount: number,
    shopsCount: number,
    avatar: string,
    level: string,
  }
};

class ProfileMenu extends PureComponent<PropsTypes> {
  render() {
    const { profile } = this.props;
    const name = pathOr(null, ['name'], profile);
    const messagesCount = pathOr(null, ['messagesCount'], profile);
    const shopsCount = pathOr(null, ['shopsCount'], profile);
    const avatar = pathOr(null, ['avatar'], profile);
    const level = pathOr(null, ['level'], profile);

    return (
      <div styleName="container">
        <Dropdown round>
          <trigger>
            <div styleName={classNames('avatar', level && level, { 'is-avatar': avatar })}>
              {avatar ?
                <img
                  styleName="avatar-img"
                  src={profile.avatar}
                  alt="img"
                /> :
                <div styleName="avatar-icon">
                  <Icon type="person" size="16" />
                </div>
              }
            </div>
          </trigger>
          <content>
            <div styleName="menu">
              <div styleName="name">
                <strong>{name}</strong>
              </div>
              <a href="#" styleName="menu-item">
                <span>Messages</span>
                {messagesCount &&
                  <Count
                    amount={messagesCount}
                    styles="blue"
                  />
                }
              </a>
              <a href="#" styleName="menu-item">Profile settings</a>
              <a href="#" styleName="menu-item">History</a>
              <a href="#" styleName="menu-item">
                <span>My shops</span>
                {shopsCount &&
                  <Count
                    amount={shopsCount}
                    styles="green"
                  />
                }
              </a>
              <a href="#" styleName="logout">Logout</a>
            </div>
          </content>
        </Dropdown>
      </div>
    );
  }
}

export default ProfileMenu;
