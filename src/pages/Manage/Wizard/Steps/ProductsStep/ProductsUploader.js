// @flow strict

import React from 'react';
import { map } from 'ramda';

import { UploadWrapper } from 'components/Upload';
import { Icon } from 'components/Icon';
import { convertSrc } from 'utils';
import { Col, Row } from 'layout';

import './ProductsUploader.scss';

type PropsType = {
  onUpload: (e: SyntheticInputEvent<HTMLInputElement>) => void,
  onRemove: (url: string) => void,
  additionalPhotos: Array<string>,
};

const ProductsUploader = ({
  onUpload,
  additionalPhotos,
  onRemove,
}: PropsType) => (
  <div styleName="wrapper">
    {additionalPhotos.length !== 0 && (
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
                  style={{
                    backgroundImage: `url(${convertSrc(item, 'small')})`,
                  }}
                />
                <div styleName="itemHover">
                  <Icon type="basket" size={40} />
                </div>
              </div>
            ),
            additionalPhotos,
          )}
        </div>
      </div>
    )}
    <Row>
      <Col size={12} mdHidden>
        <UploadWrapper
          id="upload_additional_photo"
          onUpload={onUpload}
          buttonHeight={10}
          buttonWidth={10}
          fullWidth
          noIndents
          buttonIconType="camera"
          buttonIconSize={20}
          buttonLabel="Add photo"
          dataTest="productAdditionalPhotosUploader"
        />
      </Col>
      <Col size={12} mdVisible>
        <UploadWrapper
          id="upload_additional_photo"
          onUpload={onUpload}
          buttonHeight={10}
          buttonWidth={10}
          noIndents
          buttonIconType="camera"
          buttonIconSize={20}
          buttonLabel="Add photo"
          dataTest="productAdditionalPhotosUploader"
        />
      </Col>
    </Row>
  </div>
);

export default ProductsUploader;
