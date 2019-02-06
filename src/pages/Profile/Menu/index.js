// @flow

import React, { Component, Fragment } from 'react';
import { Link, routerShape, withRouter } from 'found';
import classNames from 'classnames';
import type { Environment } from 'relay-runtime';
import uuidv4 from 'uuid/v4';

import { Collapse } from 'components/Collapse';
import { Icon } from 'components/Icon';
import { MobileUpload } from 'components/MobileUpload';
import { UploadWrapper } from 'components/Upload';
import { withShowAlert } from 'components/Alerts/AlertContext';

import { uploadFile, log, fromRelayError, convertSrc } from 'utils';

import { UpdateUserMutation } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/UpdateUserMutation';
import type { AddAlertInputType } from 'components/Alerts/AlertContext';

import type { CollapseItemType } from 'types';

import './Menu.scss';

import t from './i18n';

type PropsType = {
  activeItem: string,
  avatar: ?string,
  environment: Environment,
  firstName: string,
  id: string,
  lastName: string,
  menuItems: Array<CollapseItemType>,
  provider: ?string,
  router: routerShape,
  showAlert: (input: AddAlertInputType) => void,
};

type StateType = {
  isMainPhotoUploading: boolean,
};

class Menu extends Component<PropsType, StateType> {
  state = { isMainPhotoUploading: false };

  handleOnUpload = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.setState({ isMainPhotoUploading: true });
    uploadFile(e.target.files[0])
      .then(result => {
        if (!result || result.url == null) {
          log.error(result);
          alert('Error :('); // eslint-disable-line
        }
        this.handleUpdateUser(result.url || '');
        return true;
      })
      .finally(() => {
        this.setState({ isMainPhotoUploading: false });
      })
      .catch(error => {
        this.props.showAlert({
          type: 'danger',
          text: error.message,
          link: { text: 'Close.' },
        });
      });
  };

  handleUpdateUser = (avatar: string): void => {
    const { environment } = this.props;

    const params: MutationParamsType = {
      input: {
        clientMutationId: uuidv4(),
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
        alert(t.somethingWentWrong);
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
      avatar,
      firstName,
      lastName,
      menuItems,
      provider,
    } = this.props;
    return (
      <aside styleName="container">
        <h3 styleName="offscreen">{t.offscreenProfileMenu}</h3>
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
                img={convertSrc(avatar, 'small')}
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
            buttonLabel={t.clickToUploadAvatar}
            overPicture={convertSrc(avatar, 'medium')}
            dataTest="storeImgUploader"
            buttonHeight="100%"
            loading={this.state.isMainPhotoUploading}
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
                data-test={item.title}
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

export default withRouter(withShowAlert(Menu));
