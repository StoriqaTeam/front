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
  onLogoUpload: (url: ?string) => void,
  firstName: string,
  lastName: string,
};

class Menu extends PureComponent<PropsType> {
  handleOnUpload = async (e: any) => {
    e.preventDefault();
    const file = e.target.files[0];
    const result = await uploadFile(file);
    if (result && result.url && this.props.onLogoUpload) {
      this.props.onLogoUpload(result.url);
    }
  };

  render() {
    const { activeItem, menuItems, firstName, lastName } = this.props;

    return (
      <div styleName="menu">
        <div styleName="imgWrap">
          <UploadWrapper
            id="new-store-id"
            onUpload={this.handleOnUpload}
            buttonHeight={26}
            buttonWidth={26}
            buttonIconType="upload"
            overPicture=""
            dataTest="storeImgUploader"
          />
        </div>
        <div styleName="title">{`${firstName} ${lastName}`}</div>
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
