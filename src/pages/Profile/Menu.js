// @flow

import React, { PureComponent, Fragment } from 'react';
import { Link, routerShape, withRouter } from 'found';
import classNames from 'classnames';
import type { Environment } from 'relay-runtime';

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
  environment: Environment,
};

class Menu extends PureComponent<PropsType> {
  handleOnUpload = async (e: any): Promise<any> => {
    e.preventDefault();
    const file = e.target.files[0];
    const result = await uploadFile(file);
    if (result && result.url) {
      // this.props.onLogoUpload(result.url);
      this.handleUpdateUser(result.url);
    }
  };

  handleUpdateUser = (avatar: string): void => {
    const { environment } = this.props;

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
      onCompleted: (response: ?Object, errors: ?Array<any>): void => {
        log.debug({ response, errors });
        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
      },
      onError: (error: Error): void => {
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
      <aside styleName="container">
        <h3 styleName="offscreen">Profile Menu</h3>
        <div styleName="mobileMenu">
          <Collapse
            selected={activeItem}
            items={menuItems}
            onSelected={this.handleSelected}
          />
          <div style={{ margin: '1rem 0' }} />
          {activeItem === 'personal-data' ? (
            <Fragment>
              <MobileUpload
                img={avatar}
                iconType="user"
                id={this.props.id}
                onDelete={() => this.handleUpdateUser('')}
                onUpload={this.handleOnUpload}
              />
              <div style={{ margin: '1rem 0' }} />
            </Fragment>
          ) : null}
        </div>
        <div styleName="imageArea">
          <UploadWrapper
            id="new-store-id"
            onUpload={this.handleOnUpload}
            customUnit
            square
            buttonWidth="100%"
            buttonIconType="user"
            buttonIconSize={48}
            buttonLabel="Click to upload avatar"
            overPicture={avatar}
            dataTest="storeImgUploader"
          />
          {avatar && (
            <div
              styleName="trash"
              onClick={() => {
                this.handleUpdateUser('');
              }}
              onKeyDown={() => {}}
              role="button"
              tabIndex="0"
            >
              <Icon type="basket" size={28} />
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
              return null;
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
      </aside>
    );
  }
}

export default withRouter(Menu);
