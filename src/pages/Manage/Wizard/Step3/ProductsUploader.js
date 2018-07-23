// @flow

import React from 'react';
import { map } from 'ramda';

import { UploadWrapper } from 'components/Upload';
import { Icon } from 'components/Icon';
import { convertSrc } from 'utils';

import './Form.scss';

type PropsType = {
  onUpload: (type: string, e: any) => Promise<*>,
  onRemove: (url: string) => void,
  additionalPhotos: Array<string>,
};

const Uploaders = ({ onUpload, additionalPhotos, onRemove }: PropsType) => (
  <div styleName="uploadersWrapper">
    <div styleName="uploadedPhotoList">
      {map(
        item => (
          <div
            key={item}
            styleName="uploadItem"
            onClick={() => onRemove(item)}
            onKeyDown={() => {}}
            role="button"
            tabIndex="0"
          >
            <div
              styleName="imageBG"
              style={{ backgroundImage: `url(${convertSrc(item, 'small')})` }}
            />
            <div styleName="itemHover">
              <Icon type="basket" size={40} />
            </div>
          </div>
        ),
        additionalPhotos,
      )}
      <div styleName="uploadItem">
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
    </div>
  </div>
);

export default Uploaders;
