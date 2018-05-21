// @flow

import React from 'react';

import { UploadWrapper } from 'components/Upload';

import './Form.scss';

const Uploaders = ({
  onUpload,
}: {
  onUpload: (type: string, e: any) => void,
}) => (
  <div styleName="uploadersWrapper">
    <div styleName="uploadItem">
      <UploadWrapper
        id="main_foto"
        onUpload={e => {
          onUpload('photoMain', e);
        }}
        buttonHeight={26}
        buttonWidth={26}
        noIndents
        buttonIconType="mainFoto"
        buttonIconSize={56}
        buttonLabel="Add main photo"
        dataTest="productPhotosUploader"
      />
    </div>
    <div styleName="uploadItem">
      <UploadWrapper
        id="main_foto"
        onUpload={() => {
          onUpload();
        }}
        buttonHeight={26}
        buttonWidth={26}
        noIndents
        buttonIconType="angleView"
        buttonIconSize={56}
        buttonLabel="Add angle view"
        dataTest="productPhotosUploader"
      />
    </div>
    <div styleName="uploadItem">
      <UploadWrapper
        id="main_foto"
        onUpload={() => {
          onUpload();
        }}
        buttonHeight={26}
        buttonWidth={26}
        noIndents
        buttonIconType="showDetails"
        buttonIconSize={56}
        buttonLabel="Show details"
        dataTest="productPhotosUploader"
      />
    </div>
    <div styleName="uploadItem">
      <UploadWrapper
        id="main_foto"
        onUpload={() => {
          onUpload();
        }}
        buttonHeight={26}
        buttonWidth={26}
        noIndents
        buttonIconType="showInScene"
        buttonIconSize={56}
        buttonLabel="Show in scene"
        dataTest="productPhotosUploader"
      />
    </div>
    <div styleName="uploadItem">
      <UploadWrapper
        id="main_foto"
        onUpload={() => {
          onUpload();
        }}
        buttonHeight={26}
        buttonWidth={26}
        noIndents
        buttonIconType="showInUse"
        buttonIconSize={56}
        buttonLabel="Show in use"
        dataTest="productPhotosUploader"
      />
    </div>
    <div styleName="uploadItem">
      <UploadWrapper
        id="main_foto"
        onUpload={() => {
          onUpload();
        }}
        buttonHeight={26}
        buttonWidth={26}
        noIndents
        buttonIconType="showSizes"
        buttonIconSize={56}
        buttonLabel="Show sizes"
        dataTest="productPhotosUploader"
      />
    </div>
    <div styleName="uploadItem">
      <UploadWrapper
        id="main_foto"
        onUpload={() => {
          onUpload();
        }}
        buttonHeight={26}
        buttonWidth={26}
        noIndents
        buttonIconType="showVariety"
        buttonIconSize={56}
        buttonLabel="Show variety"
        dataTest="productPhotosUploader"
      />
    </div>
  </div>
);

export default Uploaders;
