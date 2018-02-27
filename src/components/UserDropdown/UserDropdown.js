// @flow

import React, { Component } from 'react';
import { pathOr } from 'ramda';
import classNames from 'classnames';

import { Dropdown } from 'components/Dropdown';
import { Icon } from 'components/Icon';
import { Modal } from 'components/Modal';
import { Authorization } from 'components/Authorization';

import { ProfileMenu, LoginMenu } from 'components/UserDropdown';

import { log } from 'utils';

import './UserDropdown.scss';

type PropsTypes = {
  profile: {
    name: string,
    messagesCount: number,
    shopsCount: number,
    avatar: string,
    level: 'low' | 'high',
  },
  notLogged: ?boolean,
};

type StateTypes = {
  isOpenModal: boolean,
  isSignUp: ?boolean,
};

class UserDropdown extends Component<PropsTypes, StateTypes> {
  state = {
    isSignUp: false,
  }

  onOpenModal = (isSignUp) => {
    this.setState({
      showModal: true,
      isSignUp,
    });
  }

  onCloseModal = () => {
    this.setState({ showModal: false });
  }

  render() {
    const { profile, notLogged } = this.props;
    const { showModal, isSignUp } = this.state;
    const name = pathOr(null, ['name'], profile);
    const messagesCount = pathOr(null, ['messagesCount'], profile);
    const shopsCount = pathOr(null, ['shopsCount'], profile);
    const avatar = pathOr(null, ['avatar'], profile);
    const level = pathOr(null, ['level'], profile);

    return (
      <div styleName="container">
        <Dropdown round>
          <trigger>
            <div styleName={classNames('avatar', level, { 'is-avatar': avatar })}>
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
            {notLogged ?
              <LoginMenu onClick={this.onOpenModal} /> :
              <ProfileMenu
                name={name}
                messagesCount={messagesCount}
                shopsCount={shopsCount}
              />
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
