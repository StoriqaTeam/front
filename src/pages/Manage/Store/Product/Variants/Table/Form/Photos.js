// @flow

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import { UploadWrapper } from 'components/Upload';
import { uploadFile } from 'utils';

import './Photos.scss';

type PropsType = {
  onAddPhoto: Function,
  photos: Array<string>,
};

class Photos extends PureComponent<PropsType> {
  handleOnUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const result = await uploadFile(file);
    if (!result.url) return;
    this.props.onAddPhoto(result.url);
  };

  render() {
    const { photos: items } = this.props;
    return (
      <Fragment>
        <span styleName="labelSmall">Фото товара</span>
        <div styleName="container">
          <div styleName="upload">
            <UploadWrapper
              id="foods_foto"
              onUpload={this.handleOnUpload}
              buttonHeight={120}
              buttonWidth={120}
              buttonIconType="camera"
              buttonLabel="Добавить фото"
            />
          </div>
          {items && items.length > 0 &&
          <Fragment>
            {items.map(item => (
              <div
                key={item}
                styleName="item"
              >
                <div styleName="itemWrap">
                  <img
                    src={item}
                    alt="img"
                  />
                </div>
              </div>
            ))}
          </Fragment>
          }
        </div>
      </Fragment>
    );
  }
}

Photos.contextTypes = {
  directories: PropTypes.object,
};

export default Photos;
