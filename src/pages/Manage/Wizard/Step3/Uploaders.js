// @flow

import React from 'react';

import { UploadWrapper } from 'components/Upload';

import './Form.scss';

const Uploaders = ({ onUpload }) => (
  <div styleName="uploadersWrapper">
    <div styleName="uploadItem">
      <UploadWrapper
        id="main_foto"
        onUpload={onUpload}
        buttonHeight={26}
        buttonWidth={26}
        noIndents
        buttonIconType="camera"
        buttonLabel="Add photo"
        dataTest="productPhotosUploader"
      />
    </div>
    <div styleName="uploadItem withIndents">
      <UploadWrapper
        id="main_foto"
        onUpload={onUpload}
        buttonHeight={26}
        buttonWidth={26}
        noIndents
        buttonIconType="camera"
        buttonLabel="Add photo"
        dataTest="productPhotosUploader"
      />
    </div>
    <div styleName="uploadItem">
      <UploadWrapper
        id="main_foto"
        onUpload={onUpload}
        buttonHeight={26}
        buttonWidth={26}
        noIndents
        buttonIconType="camera"
        buttonLabel="Add photo"
        dataTest="productPhotosUploader"
      />
    </div>
    <div styleName="uploadItem">
      <UploadWrapper
        id="main_foto"
        onUpload={onUpload}
        buttonHeight={26}
        buttonWidth={26}
        noIndents
        buttonIconType="camera"
        buttonLabel="Add photo"
        dataTest="productPhotosUploader"
      />
    </div>
    <div styleName="uploadItem withIndents">
      <UploadWrapper
        id="main_foto"
        onUpload={onUpload}
        buttonHeight={26}
        buttonWidth={26}
        noIndents
        buttonIconType="camera"
        buttonLabel="Add photo"
        dataTest="productPhotosUploader"
      />
    </div>
    <div styleName="uploadItem">
      <UploadWrapper
        id="main_foto"
        onUpload={onUpload}
        buttonHeight={26}
        buttonWidth={26}
        noIndents
        buttonIconType="camera"
        buttonLabel="Add photo"
        dataTest="productPhotosUploader"
      />
    </div>
    <div styleName="uploadItem">
      <UploadWrapper
        id="main_foto"
        onUpload={onUpload}
        buttonHeight={26}
        buttonWidth={26}
        noIndents
        buttonIconType="camera"
        buttonLabel="Add photo"
        dataTest="productPhotosUploader"
      />
    </div>
  </div>
);

export default Uploaders;