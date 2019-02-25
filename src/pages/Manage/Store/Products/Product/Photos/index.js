// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { length, map } from 'ramda';

import { Icon } from 'components/Icon';
import { UploadWrapper } from 'components/Upload';
import { uploadFile, uploadMultipleFiles, log, convertSrc } from 'utils';
import { withShowAlert } from 'components/Alerts/AlertContext';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';

import './Photos.scss';

import t from './i18n';

type StateType = {
  isMainPhotoUploading: boolean,
  isAdditionalPhotoUploading: boolean,
};

type PropsType = {
  onAddMainPhoto: (url: string) => void,
  onAddPhoto: (photosUrls: Array<string>) => void,
  onRemovePhoto: (url: string) => void,
  photoMain: ?string,
  photos: ?Array<string>,
  isMainVariant?: boolean,
  showAlert: (input: AddAlertInputType) => void,
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

  handleOnUploadPhoto = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.setState({ isAdditionalPhotoUploading: true });

    const { files } = e.target;

    // $FlowIgnore
    if (length(files) > 1) {
      uploadMultipleFiles(files)
        .then(result => {
          if (!result) {
            log.error(result);
            alert('Error :('); // eslint-disable-line
          }
          this.props.onAddPhoto(map(item => item.url, result));
          return true;
        })
        .finally(() => {
          this.setState({ isAdditionalPhotoUploading: false });
        })
        .catch(error => {
          this.props.showAlert({
            type: 'danger',
            text: error.message,
            link: { text: 'Close.' },
          });
        });
    }

    // $FlowIgnore
    if (length(files) === 1) {
      uploadFile(files[0])
        .then(result => {
          if (!result || result.url == null) {
            log.error(result);
            alert('Error :('); // eslint-disable-line
          }
          this.props.onAddPhoto([result.url]);
          return true;
        })
        .finally(() => {
          this.setState({ isAdditionalPhotoUploading: false });
        })
        .catch(error => {
          this.props.showAlert({
            type: 'danger',
            text: error.message,
            link: { text: 'Close.' },
          });
        });
    }
  };

  render() {
    const {
      photoMain,
      photos: items,
      onRemovePhoto,
      isMainVariant,
    } = this.props;
    const { isMainPhotoUploading, isAdditionalPhotoUploading } = this.state;
    return (
      <div styleName="container">
        <div styleName="mainPhoto">
          <div styleName="upload mainPhotoUpload">
            <UploadWrapper
              id={`${isMainVariant ? 'main-variant' : ''}main-photo`}
              onUpload={this.handleOnUploadMainPhoto}
              buttonHeight={15}
              buttonWidth={15}
              buttonIconType="camera"
              buttonLabel={t.labelAddMainPhoto}
              loading={isMainPhotoUploading}
              dataTest="productPhotosUploader"
            />
          </div>
          {photoMain && (
            <div styleName="item mainPhotoItem">
              <div styleName="mainPhotoItemWrap">
                <img src={convertSrc(photoMain, 'small')} alt="img" />
              </div>
              <div
                styleName="remove"
                onClick={() => {
                  onRemovePhoto(photoMain);
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
              multiple
              onUpload={this.handleOnUploadPhoto}
              buttonHeight={10}
              buttonWidth={10}
              buttonIconType="camera"
              buttonLabel={t.labelAddPhoto}
              loading={isAdditionalPhotoUploading}
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

export default withShowAlert(Photos);
