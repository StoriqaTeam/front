// @flow

import React, { Component } from 'react';
import { pathOr } from 'ramda';

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
    lastName: string,
    firstName: string,
    email: string,
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
  };

  onOpenModal = (isSignUp: ?boolean) => {
    this.setState({
      showModal: true,
      isSignUp,
    });
  };

  onCloseModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { user } = this.props;
    const { showModal, isSignUp } = this.state;

    const {
      lastName,
      firstName,
      email,
      messagesCount,
      shopsCount,
      avatar,
    } = user;

    return (
      <div styleName="container">
        <Dropdown withIcon>
          <trigger>
            <div styleName="avatar">
              {avatar ? (
                <img styleName="avatarImg" src={user.avatar} alt="img" />
              ) : (
                <Icon type="person" size="16" />
              )}
            </div>
          </trigger>
          <content>
            {user ? (
              <ProfileMenu
                lastName={lastName}
                firstName={firstName}
                messagesCount={messagesCount}
                shopsCount={shopsCount}
                email={email}
                avatar={avatar}
              />
            ) : (
              <LoginMenu onClick={this.onOpenModal} />
            )}
          </content>
        </Dropdown>
        <Modal showModal={showModal} onClose={this.onCloseModal}>
          <Authorization isSignUp={isSignUp} />
        </Modal>
      </div>
    );
  }
}

export default UserDropdown;
