// @flow

import React, { Component } from 'react';
import { pathOr } from 'ramda';
import classNames from 'classnames';

import { Dropdown } from 'components/Dropdown';
import { Icon } from 'components/Icon';
import { Modal } from 'components/Modal';
import { Authorization } from 'components/Authorization';

import { ProfileMenu, LoginMenu } from 'components/UserDropdown';

import './UserDropdown.scss';

type PropsTypes = {
  user: {
    name: string,
    messagesCount: number,
    shopsCount: number,
    avatar: string,
    level: 'low' | 'high',
  },
};

type StateTypes = {
  showModal: boolean,
  isSignUp: ?boolean,
};

class UserDropdown extends Component<PropsTypes, StateTypes> {
  state = {
    showModal: false,
    isSignUp: false,
  }

  onOpenModal = (isSignUp: ?boolean) => {
    this.setState({
      showModal: true,
      isSignUp,
    });
  }

  onCloseModal = () => {
    this.setState({ showModal: false });
  }

  render() {
    const { user } = this.props;
    const { showModal, isSignUp } = this.state;
    const name = pathOr(null, ['name'], user);
    const messagesCount = pathOr(null, ['messagesCount'], user);
    const shopsCount = pathOr(null, ['shopsCount'], user);
    const avatar = pathOr(null, ['avatar'], user);
    const level = pathOr(null, ['level'], user);

    return (
      <div styleName="container">
        <Dropdown withIcon>
          <trigger>
            <div styleName={classNames('avatar', level, { 'is-avatar': avatar })}>
              {avatar ?
                <img
                  styleName="avatar-img"
                  src={user.avatar}
                  alt="img"
                /> :
                <div styleName="avatar-icon">
                  <Icon type="person" size="16" />
                </div>
              }
            </div>
          </trigger>
          <content>
            {user ?
              <ProfileMenu
                name={name}
                messagesCount={messagesCount}
                shopsCount={shopsCount}
              /> :
              <LoginMenu onClick={this.onOpenModal} />
            }
          </content>
        </Dropdown>
        <Modal
          showModal={showModal}
          onClose={this.onCloseModal}
        >
          <Authorization isSignUp={isSignUp} />
        </Modal>
      </div>
    );
  }
}

export default UserDropdown;
