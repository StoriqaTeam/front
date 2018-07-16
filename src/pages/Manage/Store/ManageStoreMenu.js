// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { routerShape, withRouter, matchShape } from 'found';
import classNames from 'classnames';
import { isEmpty, isNil, pathOr } from 'ramda';
import { graphql } from 'react-relay';

import { UploadWrapper } from 'components/Upload';
import { Icon } from 'components/Icon';
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

import type { AddAlertInputType } from 'components/App/AlertContext';

import menuItems from './menuItems.json';

import './ManageStoreMenu.scss';

type MenuItemType = {
  id: string,
  title: string,
  link: string,
  disabled: boolean,
};

type PropsType = {
  activeItem: string,
  router: routerShape,
  match: matchShape,
  showAlert: (input: AddAlertInputType) => void,
};

type StateType = {
  storeData: ?{
    myStore: {
      id: string,
      rawId: number,
      name: {
        lang: string,
        text: string,
      },
      logo: string,
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
    }
  }
`;

class ManageStoreMenu extends PureComponent<PropsType, StateType> {
  state = {
    storeData: null,
  };

  componentWillMount() {
    const store = this.context.environment.getStore();
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

      const myStoreId = pathOr(null, ['myStore', 'rawId'], snapshotUser.data);
      // $FlowIgnoreMe
      const routeStoreId = pathOr(
        null,
        ['match', 'params', 'storeId'],
        this.props,
      );
      if (!myStoreId && !routeStoreId) {
        this.props.router.replace('/_');
      }
      if (myStoreId && myStoreId !== Number(routeStoreId)) {
        // $FlowIgnoreMe
        this.props.router.replace(`/manage/store/${myStoreId}`);
      }
    }
  }

  componentWillUnmount() {
    if (this.disposeUser) {
      this.disposeUser();
    }
  }

  disposeUser: () => void;

  handleOnUpload = async (e: any) => {
    e.preventDefault();
    const file = e.target.files[0];
    const result = await uploadFile(file);
    if (!result.url) return;
    this.handleLogoUpload(result.url);
  };

  handleLogoUpload = (url: string) => {
    const { environment } = this.context;
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['storeData', 'myStore', 'id'], this.state);

    if (!storeId) {
      this.props.showAlert({
        type: 'danger',
        text: 'Something going wrong.',
        link: { text: 'Close.' },
      });
      return;
    }
    const params: MutationParamsType = {
      input: {
        clientMutationId: '',
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
            link: { text: 'Close.' },
          });
          return;
        }

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Saved!',
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong.',
          link: { text: 'Close.' },
        });
      },
    };
    UpdateStoreMainMutation.commit(params);
  };

  handleClick = (item: MenuItemType): void => {
    const { link } = item;
    const {
      router,
      match: {
        params: { storeId },
      },
    } = this.props;
    if (!isEmpty(link)) {
      if (!isNil(storeId)) {
        const storePath = `/manage/store/${storeId}`;
        const path = link === '/' ? storePath : `${storePath}${link}`;
        router.replace(path);
      }
    }
  };

  deleteAvatar = () => {
    this.handleLogoUpload('');
  };

  render() {
    const { activeItem } = this.props;
    const { storeData } = this.state;
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
      <div styleName="menu">
        <div styleName="imgWrap">
          <UploadWrapper
            id="new-store-id"
            onUpload={this.handleOnUpload}
            buttonHeight={26}
            buttonWidth={26}
            buttonIconSize={48}
            buttonIconType="upload"
            buttonLabel="Click to upload logo"
            overPicture={convertSrc(storeLogo, 'medium') || null}
            dataTest="storeImgUploader"
          />
          {storeLogo && (
            <div
              styleName="cross"
              onClick={this.deleteAvatar}
              onKeyDown={() => {}}
              role="button"
              tabIndex="0"
            >
              <Icon type="cross" />
            </div>
          )}
        </div>
        <div styleName="title">{storeName || ''}</div>
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
              >
                {item.title}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

ManageStoreMenu.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default withRouter(ManageStoreMenu);
