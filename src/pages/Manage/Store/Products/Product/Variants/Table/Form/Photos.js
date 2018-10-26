// @flow strict

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'components/Icon';
import { UploadWrapper } from 'components/Upload';
import { uploadFile, convertSrc, log } from 'utils';

import './Photos.scss';

type PropsType = {
  onAddMainPhoto: (url: string) => void,
  onAddPhoto: (url: string) => void,
  onRemovePhoto: (url: string) => void,
  mainPhoto: ?string,
  photos: ?Array<string>,
};

type StateType = {
  isMainPhotoUploading: boolean,
  isAdditionalPhotoUploading: boolean,
};

class Photos extends Component<PropsType, StateType> {
  state = {
    isMainPhotoUploading: false,
    isAdditionalPhotoUploading: false,
  };

  handleOnUploadMainPhoto = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.setState({ isMainPhotoUploading: true });
    uploadFile(e.target.files[0])
      .then(result => {
        if (!result || result.url == null) {
          log.error(result);
          alert('Error :('); // eslint-disable-line
        }
        this.props.onAddMainPhoto(result.url || '');
      })
      .catch(alert)
      .finally(() => {
        this.setState({ isMainPhotoUploading: false });
      });
  };

  handleOnUploadPhoto = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ isAdditionalPhotoUploading: true });
    e.preventDefault();
    uploadFile(e.target.files[0])
      .then(result => {
        if (!result || result.url == null) {
          log.error(result);
          alert('Error :('); // eslint-disable-line
        }
        this.props.onAddPhoto(result.url || '');
      })
      .catch(alert)
      .finally(() => {
        this.setState({ isAdditionalPhotoUploading: false });
      });
  };

  render() {
    log.info(this.state);
    const { mainPhoto, photos: items, onRemovePhoto } = this.props;
    return (
      <div styleName="container">
        <div styleName="mainPhoto">
          <div styleName="title">
            <strong>Main photo</strong>
          </div>
          <div styleName="upload">
            <UploadWrapper
              id="main-photo"
              onUpload={this.handleOnUploadMainPhoto}
              buttonHeight={10}
              buttonWidth={10}
              buttonIconType="camera"
              buttonLabel="Add photo"
              dataTest="productPhotosUploader"
              loading={this.state.isMainPhotoUploading}
            />
          </div>
          {mainPhoto != null && (
            <div styleName="item mainPhotoItem">
              <div styleName="itemWrap">
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
          <div styleName="title">
            <strong>Product photos</strong>
          </div>
          <div styleName="upload">
            <UploadWrapper
              id="additional-photos"
              onUpload={this.handleOnUploadPhoto}
              buttonHeight={10}
              buttonWidth={10}
              buttonIconType="camera"
              buttonLabel="Add photo"
              dataTest="productPhotosUploader"
              loading={this.state.isAdditionalPhotoUploading}
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
