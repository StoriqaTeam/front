// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';

import { UploadWrapper } from 'components/Upload';
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

  render() {
    const { activeItem, storeName, storeLogo, onLogoUpload } = this.props;
    return (
      <div styleName="menu">
        <div styleName="imgWrap">
          {onLogoUpload ? (
            <UploadWrapper
              id="new-store-id"
              onUpload={this.handleOnUpload}
              buttonHeight={26}
              buttonWidth={26}
              buttonIconType="upload"
              overPicture={storeLogo}
              dataTest="storeImgUploader"
            />
          ) : (
            <img src={storeLogo} alt="store logo" styleName="storeLogo" />
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
                  'isDisabled': item.disabled,
                })}
                onClick={() => {
                  this.props.switchMenu(item.id);
                }}
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

export default Menu;
