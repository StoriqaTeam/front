// @flow

import React, { PureComponent } from 'react';
import { Link } from 'found';
import classNames from 'classnames';

import { UploadWrapper } from 'components/Upload';
import { uploadFile } from 'utils';

import './Menu.scss';

type PropsType = {
  menuItems: Array<{ id: string, title: string }>,
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
    const { activeItem, storeName, storeLogo, menuItems } = this.props;

    return (
      <div styleName="menu">
        <div styleName="imgWrap">
          <UploadWrapper
            id="new-store-id"
            onUpload={this.handleOnUpload}
            buttonHeight={26}
            buttonWidth={26}
            buttonIconType="upload"
            overPicture={storeLogo}
            dataTest="storeImgUploader"
          />
        </div>
        {storeName && <div styleName="title">{storeName}</div>}
        <div styleName="items">
          {menuItems.map(item => {
            const isActive = item.id === activeItem;

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
      </div>
    );
  }
}

export default Menu;
