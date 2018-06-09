// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { routerShape, withRouter, matchShape } from 'found';
import classNames from 'classnames';
import { isEmpty, isNil, pathOr } from 'ramda';

import { UploadWrapper } from 'components/Upload';
import { Icon } from 'components/Icon';
import { uploadFile, getNameText, log, fromRelayError } from 'utils';

import { UpdateStoreMainMutation } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/UpdateStoreMainMutation';

import type { AddAlertInputType } from 'components/App/AlertContext';

import menuItems from './menuItems.json';

import './Menu.scss';

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
  storeData: {
    name: Array<{
      text: string,
      lang: string,
    }>,
    logo: ?string,
  },
};

class Menu extends PureComponent<PropsType> {
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
    const storeId = pathOr(null, ['storeData', 'id'], this.props);
    if (!storeId) {
      this.props.showAlert({
        type: 'danger',
        text: 'Something going wrong.',
        link: { text: 'Close.' },
      });
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
    const {
      activeItem,
      storeData: store,
      match: {
        params: { storeId },
      },
    } = this.props;
    let storeName = '';
    let storeLogo = '';
    if (store) {
      storeName = getNameText(store.name, 'EN');
      storeLogo = store.logo;
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
            buttonLabel="Click to download logo"
            overPicture={storeLogo || null}
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
        {storeName && <div styleName="title">{storeName}</div>}
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
                onClick={() => this.handleClick(item)}
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

Menu.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default withRouter(Menu);
