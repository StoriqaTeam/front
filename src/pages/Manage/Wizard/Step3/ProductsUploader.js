// @flow

import React from 'react';
import { map } from 'ramda';

import { UploadWrapper } from 'components/Upload';

import './Form.scss';

type PropsType = {
  onUpload: (type: string, e: any) => Promise<*>,
  photoMain: ?string,
  additionalPhotos: Array<string>,
};

const Uploaders = ({ onUpload, photoMain, additionalPhotos }: PropsType) => (
  <div styleName="uploadersWrapper">
    <div styleName="uploadedPhotoList">
      {map(
        item => (
          <div key={item} styleName="uploadItem">
            <div
              styleName="imageBG"
              style={{ backgroundImage: `url(${item})` }}
            />
          </div>
        ),
        additionalPhotos,
      )}
    </div>
    <UploadWrapper
      id="upload_additional_photo"
      onUpload={e => {
        onUpload('additionalPhoto', e);
      }}
      buttonHeight={10}
      buttonWidth={10}
      noIndents
      buttonIconType="camera"
      buttonIconSize={20}
      buttonLabel="Add photo"
      dataTest="productAdditionalPhotosUploader"
    />
  </div>
);

export default Uploaders;
