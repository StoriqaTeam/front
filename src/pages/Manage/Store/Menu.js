// @flow

import React, { PureComponent } from 'react';
import { routerShape, withRouter, matchShape } from 'found';
import classNames from 'classnames';
import { isEmpty, isNil } from 'ramda';

import { UploadWrapper } from 'components/Upload';
import { Icon } from 'components/Icon';
import { uploadFile } from 'utils';

import type { MenuItemType } from './types';

import menuItems from './menuItems.json';

import './Menu.scss';

type PropsType = {
  activeItem: string,
  switchMenu: (id: any) => void,
  storeName?: string,
  storeLogo?: string,
  onLogoUpload?: Function,
  router: routerShape,
  match: matchShape,
};

type StateType = {
  //
};

class Menu extends PureComponent<PropsType, StateType> {
  handleOnUpload = async (e: any) => {
    e.preventDefault();
    const file = e.target.files[0];
    const result = await uploadFile(file);
    if (!result.url) return;
    if (this.props.onLogoUpload) {
      this.props.onLogoUpload(result.url);
    }
  };
  handleClick = ({ link }: MenuItemType): void => {
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
    // if (!disabled) {
    //   switchMenu(id);
    // }
  };

  deleteAvatar = () => {
    if (this.props.onLogoUpload) {
      this.props.onLogoUpload('');
    }
  };

  render() {
    const { activeItem, storeName, storeLogo, onLogoUpload } = this.props;
    return (
      <div styleName="menu">
        <div styleName="imgWrap">
          {/* eslint-disable no-nested-ternary */}
          {onLogoUpload ? (
            <UploadWrapper
              id="new-store-id"
              onUpload={this.handleOnUpload}
              buttonHeight={26}
              buttonWidth={26}
              buttonIconSize={48}
              buttonIconType="upload"
              buttonLabel="Click to download logo"
              overPicture={storeLogo}
              dataTest="storeImgUploader"
            />
          ) : (
            <img src={storeLogo} alt="store logo" />
          )}
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
                  isDisabled: item.disabled,
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

export default withRouter(Menu);
