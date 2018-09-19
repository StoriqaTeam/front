// @flow

import React, { PureComponent } from 'react';
import { toUpper, pathOr } from 'ramda';

import { Dropdown } from 'components/Dropdown';
import { Icon } from 'components/Icon';

import { ProfileMenu } from 'components/UserDropdown';

import './UserDropdown.scss';

type PropsTypes = {
  user: {
    name: string,
    messagesCount?: number,
    shopsCount?: number,
    avatar?: string,
    lastName: string,
    firstName: string,
    email: string,
    myStore: ?{
      rawId: number,
    },
  },
};

class UserDropdown extends PureComponent<PropsTypes> {
  render() {
    const { user } = this.props;
    const {
      firstName,
      lastName,
      avatar,
      email,
      messagesCount,
      shopsCount,
    } = user;

    // $FlowIgnoreMe
    const myStoreId = pathOr(null, ['myStore', 'rawId'], user);

    return (
      <div styleName="container">
        <Dropdown withIcon dataTest="userDropdownButton">
          <trigger>
            <div styleName="user">
              <div styleName="avatar">
                {avatar ? (
                  <img styleName="avatarImg" src={avatar} alt="img" />
                ) : (
                  <Icon type="person" size={16} />
                )}
              </div>
              {(firstName || lastName) && (
                <div styleName="greeting">
                  {`Hi, ${firstName} ${toUpper(lastName.charAt(0))}.`}
                </div>
              )}
            </div>
          </trigger>
          <content>
            <ProfileMenu
              lastName={lastName}
              firstName={firstName}
              messagesCount={messagesCount}
              shopsCount={shopsCount}
              email={email}
              avatar={avatar}
              myStoreId={myStoreId}
            />
          </content>
        </Dropdown>
      </div>
    );
  }
}

export default UserDropdown;
