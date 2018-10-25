// @flow

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'components/Icon';
import { UploadWrapper } from 'components/Upload';
import { uploadFile, convertSrc } from 'utils';

import './Photos.scss';

type PropsType = {
  onAddMainPhoto: (url: string) => void,
  onAddPhoto: (url: string) => void,
  onRemovePhoto: (url: string) => void,
  mainPhoto: ?string,
  photos: ?Array<string>,
  isMainVariant?: boolean,
};

class Photos extends PureComponent<PropsType> {
  handleOnUploadMainPhoto = async (e: any) => {
    e.preventDefault();
    const file = e.target.files[0];
    const result = await uploadFile(file);
    if (!result.url) return;
    this.props.onAddMainPhoto(result.url);
  };

  handleOnUploadPhoto = async (e: any) => {
    e.preventDefault();
    const file = e.target.files[0];
    const result = await uploadFile(file);
    if (!result.url) return;
    this.props.onAddPhoto(result.url);
  };

  render() {
    const {
      mainPhoto,
      photos: items,
      onRemovePhoto,
      isMainVariant,
    } = this.props;
    return (
      <div styleName="container">
        <div styleName="mainPhoto">
          <div styleName="title">
            <strong>Product photos</strong>
          </div>
          <div styleName="upload mainPhotoUpload">
            <UploadWrapper
              id={`${isMainVariant ? 'main-variant' : ''}main-photo`}
              onUpload={this.handleOnUploadMainPhoto}
              buttonHeight={15}
              buttonWidth={15}
              buttonIconType="camera"
              buttonLabel="Add main photo"
              dataTest="productPhotosUploader"
            />
          </div>
          {mainPhoto && (
            <div styleName="item mainPhotoItem">
              <div styleName="mainPhotoItemWrap">
                <img src={convertSrc(mainPhoto, 'small')} alt="img" />
              </div>
              <div
                styleName="remove"
                onClick={() => {
                  onRemovePhoto(mainPhoto);
                }}
                onKeyDown={() => {}}
                role="button"
                tabIndex="0"
              >
                <Icon type="basket" size={32} />
              </div>
            </div>
          )}
        </div>
        <div styleName="additionalPhotos">
          <div styleName="upload">
            <UploadWrapper
              id={`${isMainVariant ? 'main-variant' : ''}additional-photos`}
              onUpload={this.handleOnUploadPhoto}
              buttonHeight={10}
              buttonWidth={10}
              buttonIconType="camera"
              buttonLabel="Add photo"
              dataTest="productPhotosUploader"
            />
          </div>
          {items &&
            items.length > 0 && (
              <Fragment>
                {items.map(item => (
                  <div key={item} styleName="item">
                    <div styleName="itemWrap">
                      <img src={convertSrc(item, 'small')} alt="img" />
                    </div>
                    <div
                      styleName="remove"
                      onClick={() => {
                        onRemovePhoto(item);
                      }}
                      onKeyDown={() => {}}
                      role="button"
                      tabIndex="0"
                    >
                      <Icon type="basket" size={32} />
                    </div>
                  </div>
                ))}
              </Fragment>
            )}
        </div>
      </div>
    );
  }
}

Photos.contextTypes = {
  directories: PropTypes.object,
};

export default Photos;
