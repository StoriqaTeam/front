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
    <div styleName="uploadItem">
      <div styleName="uploadedPhotoWrapper">
        {map(
          item => (
            <div key={item} styleName="uploadItem">
              <img src={item} alt={item} />
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
        buttonHeight={26}
        buttonWidth={26}
        noIndents
        buttonIconType="mainFoto"
        buttonIconSize={56}
        buttonLabel="Add photo"
        dataTest="productAdditionalPhotosUploader"
      />
    </div>
  </div>
);

export default Uploaders;
