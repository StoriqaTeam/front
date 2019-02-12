// @flow

import React, { PureComponent } from 'react';
import { pathOr } from 'ramda';

import { convertSrc } from 'utils';

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
    wizardStore: {
      completed: boolean,
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
    // $FlowIgnoreMe
    const isWizardComplete = pathOr(false, ['wizardStore', 'completed'], user);

    return (
      <div styleName="container">
        <Dropdown withIcon dataTest="userDropdownButton">
          <trigger>
            <div styleName="user">
              <div styleName="avatar">
                {avatar ? (
                  <img
                    styleName="avatarImg"
                    src={convertSrc(avatar, 'small')}
                    alt="img"
                  />
                ) : (
                  <Icon type="person" size={16} />
                )}
              </div>
              {(firstName || lastName) && (
                <div styleName="greeting">{`Hi, ${firstName} `}</div>
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
              isWizardComplete={isWizardComplete}
            />
          </content>
        </Dropdown>
      </div>
    );
  }
}

export default UserDropdown;
