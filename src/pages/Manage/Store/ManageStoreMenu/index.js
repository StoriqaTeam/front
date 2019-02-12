// @flow

import React, { Component } from 'react';
import { routerShape, withRouter, matchShape } from 'found';
import classNames from 'classnames';
import { isEmpty, isNil, pathOr } from 'ramda';
import type { Environment } from 'relay-runtime';
import { graphql } from 'react-relay';
import uuidv4 from 'uuid/v4';

import { withShowAlert } from 'components/Alerts/AlertContext';
import { UploadWrapper } from 'components/Upload';
import { Icon } from 'components/Icon';
import { Collapse } from 'components/Collapse';
import { MobileUpload } from 'components/MobileUpload';

import {
  uploadFile,
  getNameText,
  log,
  fromRelayError,
  convertSrc,
  setWindowTag,
} from 'utils';

import { UpdateStoreMainMutation } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/UpdateStoreMainMutation';
import type { AddAlertInputType } from 'components/Alerts/AlertContext';
import type { TranslationType } from 'types';

import menuItems from './menuItems.json';

import './ManageStoreMenu.scss';

import t from './i18n';

type MenuItemType = {
  id: string,
  title: string,
  link?: string,
  disabled: boolean,
  dataTest: string,
};

type PropsType = {
  activeItem: string,
  router: routerShape,
  match: matchShape,
  showAlert: (input: AddAlertInputType) => void,
  environment: Environment,
  newStoreLogo: ?string,
  newStoreName: ?string,
  handleOnUpload: () => void,
  deleteAvatar: () => void,
};

type StateType = {
  isMainPhotoUploading: boolean,
  storeData: ?{
    myStore: {
      id: string,
      rawId: number,
      name: TranslationType,
      logo: string,
      status: string,
    },
  },
};

const MANAGE_STORE_MENU_FRAGMENT = graphql`
  fragment ManageStoreMenu_me on User {
    myStore {
      id
      rawId
      name {
        lang
        text
      }
      logo
      status
    }
  }
`;

class ManageStoreMenu extends Component<PropsType, StateType> {
  state = {
    storeData: null,
    isMainPhotoUploading: false,
  };

  componentWillMount() {
    const store = this.props.environment.getStore();
    const meId = pathOr(
      null,
      ['me', '__ref'],
      store.getSource().get('client:root'),
    );

    if (meId) {
      const queryUser = MANAGE_STORE_MENU_FRAGMENT.me();
      const snapshotUser = store.lookup({
        dataID: meId,
        node: queryUser,
      });
      const { dispose: disposeUser } = store.subscribe(snapshotUser, s => {
        this.setState({ storeData: s.data });
        // tmp code
        setWindowTag('user', s.data);
        // end tmp code
      });
      this.disposeUser = disposeUser;
      this.setState({ storeData: snapshotUser.data });
      // tmp code
      setWindowTag('user', snapshotUser.data);
      // end tmp code
    }
  }

  componentWillUnmount() {
    if (this.disposeUser) {
      this.disposeUser();
    }
  }

  disposeUser: () => void;

  handleOnUpload = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { storeData } = this.state;
    if (storeData && storeData.myStore.status === 'MODERATION') {
      this.props.showAlert({
        type: 'danger',
        text: `${t.error}${t.statusModerationCannotBeChanged}`,
        link: { text: t.close },
      });
      return;
    }

    e.preventDefault();
    this.setState({ isMainPhotoUploading: true });
    uploadFile(e.target.files[0])
      .then(result => {
        if (!result || result.url == null) {
          log.error(result);
          alert('Error :('); // eslint-disable-line
        }
        this.handleLogoUpload(result.url || '');
        return true;
      })
      .finally(() => {
        this.setState({ isMainPhotoUploading: false });
      })
      .catch(error => {
        this.props.showAlert({
          type: 'danger',
          text: error.message,
          link: { text: t.close },
        });
      });
  };

  handleLogoUpload = (url: string) => {
    const { environment } = this.props;
    // $FlowIgnoreMe
    const storeId: ?string = pathOr(
      null,
      ['storeData', 'myStore', 'id'],
      this.state,
    );

    if (!storeId) {
      this.props.showAlert({
        type: 'danger',
        text: t.somethingGoingWrong,
        link: { text: t.close },
      });
      return;
    }
    const params: MutationParamsType = {
      input: {
        clientMutationId: uuidv4(),
        id: storeId,
        logo: url,
        name: null,
        longDescription: null,
        shortDescription: null,
        defaultLanguage: null,
        slug: null,
        slogan: null,
        addressFull: {},
      },
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        // $FlowIgnoreMe
        const statusError: string = pathOr({}, ['100', 'status'], relayErrors);
        if (!isEmpty(statusError)) {
          this.props.showAlert({
            type: 'danger',
            text: `Error: "${statusError}"`,
            link: { text: t.close },
          });
          return;
        }
        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: t.saved,
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: t.somethingGoingWrong,
          link: { text: t.close },
        });
      },
    };
    UpdateStoreMainMutation.commit(params);
  };

  handleClick = (item: { link?: string }): void => {
    const { link } = item;
    const {
      router: { replace },
      match: {
        params: { storeId },
      },
    } = this.props;
    if (!isEmpty(link)) {
      if (!isNil(storeId)) {
        const storePath = `/manage/store/${storeId}`;
        const path =
          link === '/' ? storePath : `${storePath}${!isNil(link) ? link : ''}`;
        replace(path);
      }
    }
  };

  deleteAvatar = (): void => {
    const { storeData } = this.state;
    if (storeData && storeData.myStore.status === 'MODERATION') {
      this.props.showAlert({
        type: 'danger',
        text: `${t.error}${t.statusModerationCannotBeChanged}`,
        link: { text: t.close },
      });
      return;
    }
    this.handleLogoUpload('');
  };

  render() {
    const { activeItem } = this.props;
    const { storeData } = this.state;
    const {
      newStoreName,
      newStoreLogo,
      handleOnUpload,
      deleteAvatar,
    } = this.props;
    if (!storeData) {
      return <div />;
    }
    const { myStore } = storeData;
    let storeId = '';
    let storeName = '';
    let storeLogo = '';
    if (myStore) {
      storeName = getNameText(myStore.name, 'EN');
      storeLogo = myStore.logo;
      storeId = myStore.rawId;
    }
    return (
      <aside styleName="container">
        <h2 styleName="offscreen">{t.manage}</h2>
        <div styleName="mobileMenu">
          <Collapse
            selected={activeItem}
            items={menuItems}
            onSelected={this.handleClick}
            isDisabled={isNil(storeId)}
          />
          <div style={{ margin: '1.05rem 0' }} />
          {activeItem === 'settings' ? (
            <MobileUpload
              img={convertSrc(storeLogo, 'small')}
              iconType="upload"
              id="some"
              onUpload={this.handleOnUpload}
              onDelete={this.deleteAvatar}
            />
          ) : null}
        </div>
        <div styleName="imgWrap">
          <UploadWrapper
            id="new-store-id"
            onUpload={myStore ? this.handleOnUpload : handleOnUpload}
            customUnit
            square
            buttonWidth="100%"
            buttonIconSize={48}
            buttonIconType="upload"
            buttonLabel={t.buttonLabel}
            overPicture={
              myStore ? convertSrc(storeLogo, 'medium') || null : newStoreLogo
            }
            dataTest="storeImgUploader"
            loading={this.state.isMainPhotoUploading}
            buttonHeight="100%"
          />
          {((myStore && storeLogo) || (!myStore && newStoreLogo)) && (
            <div
              styleName="trash"
              onClick={myStore ? this.deleteAvatar : deleteAvatar}
              onKeyDown={() => {}}
              role="button"
              tabIndex="0"
            >
              <Icon type="basket" size={28} />
            </div>
          )}
        </div>
        <div styleName="title">{myStore ? storeName || '' : newStoreName}</div>
        <div styleName="items">
          {menuItems.map((item: MenuItemType) => {
            const isActive = item.id === activeItem;
            return (
              <div
                key={item.id}
                styleName={classNames('item', {
                  isActive,
                  isDisabled:
                    item.disabled || (!storeId && item.id !== 'settings'),
                })}
                onClick={item.disabled ? null : () => this.handleClick(item)}
                onKeyDown={() => {}}
                role="button"
                tabIndex="0"
                data-test={item.title}
              >
                {item.title}
              </div>
            );
          })}
        </div>
      </aside>
    );
  }
}

export default withRouter(withShowAlert(ManageStoreMenu));
