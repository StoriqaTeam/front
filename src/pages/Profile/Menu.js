// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link, routerShape, withRouter } from 'found';
import classNames from 'classnames';

import { Collapse } from 'components/Collapse';
import { Icon } from 'components/Icon';
import { MobileUpload } from 'components/MobileUpload';
import { UploadWrapper } from 'components/Upload';

import { uploadFile, log, fromRelayError } from 'utils';

import { UpdateUserMutation } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/UpdateUserMutation';

import './Menu.scss';

type PropsType = {
  router: routerShape,
  menuItems: Array<{ id: string, title: string }>,
  activeItem: string,
  firstName: string,
  lastName: string,
  avatar: ?string,
  id: string,
  provider: ?string,
};

class Menu extends PureComponent<PropsType> {
  handleOnUpload = async (e: any) => {
    e.preventDefault();
    const file = e.target.files[0];
    const result = await uploadFile(file);
    if (result && result.url) {
      // this.props.onLogoUpload(result.url);
      this.handleUpdateUser(result.url);
    }
  };

  handleUpdateUser = (avatar: string) => {
    const { environment } = this.context;

    const params: MutationParamsType = {
      input: {
        clientMutationId: '',
        avatar,
        id: this.props.id,
        phone: null,
        firstName: null,
        lastName: null,
        birthdate: null,
        gender: null,
      },
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });
        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        // eslint-disable-next-line
        alert('Something going wrong :(');
      },
    };
    UpdateUserMutation.commit(params);
  };
  handleSelected = (item: { id: string, title: string }): void => {
    const {
      router: { push },
    } = this.props;
    push(`/profile/${item.id}`);
  };
  render() {
    const {
      activeItem,
      menuItems,
      firstName,
      lastName,
      avatar,
      provider,
    } = this.props;
    return (
      <sidebar styleName="container">
        <h3 styleName="offscreen">Profile Menu</h3>
        <div styleName="mobileMenu">
          <Collapse items={menuItems} onSelected={this.handleSelected} />
          <div style={{ margin: '1.05rem 0' }} />
          <MobileUpload
            avatar={avatar}
            id={this.props.id}
            onUpload={this.handleOnUpload}
          />
        </div>
        <div styleName="imageArea">
          <UploadWrapper
            id="new-store-id"
            onUpload={this.handleOnUpload}
            customUnit
            buttonHeight="26rem"
            buttonWidth="100%"
            buttonIconType="user"
            buttonIconSize={48}
            buttonLabel="Click to download avatar"
            overPicture={avatar}
            dataTest="storeImgUploader"
          />
          {avatar && (
            <div
              styleName="cross"
              onClick={() => {
                this.handleUpdateUser('');
              }}
              onKeyDown={() => {}}
              role="button"
              tabIndex="0"
            >
              <Icon type="cross" />
            </div>
          )}
        </div>
        <div styleName="title">{`${firstName} ${lastName}`}</div>
        <div styleName="items">
          {menuItems.map(item => {
            const isActive = item.id === activeItem;
            if (
              (item.id === 'security' && provider !== 'EMAIL') ||
              item.id === 'kyc'
            ) {
              return (
                <div key={item.id} styleName="item">
                  {item.title}
                </div>
              );
            }
            return (
              <Link
                key={item.id}
                to={`/profile/${item.id}`}
                styleName={classNames('item', { isActive })}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      </sidebar>
    );
  }
}

Menu.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default withRouter(Menu);
