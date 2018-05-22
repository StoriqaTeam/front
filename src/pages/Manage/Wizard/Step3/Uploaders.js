// @flow

import React from 'react';
import { map } from 'ramda';

import { UploadWrapper } from 'components/Upload';

import './Form.scss';

const aditionalPhotosConfig = [
  {
    id: 'photoAngle',
    buttonIconType: 'angleView',
    buttonLabel: 'Add angle view',
    dataTest: 'productPhotosUploader',
  },
  {
    id: 'photoDetails',
    buttonIconType: 'showDetails',
    buttonLabel: 'Show details',
    dataTest: 'productPhotosUploader',
  },
  {
    id: 'photoScene',
    buttonIconType: 'showInScene',
    buttonLabel: 'Show in scene',
    dataTest: 'productPhotosUploader',
  },
  {
    id: 'photoUse',
    buttonIconType: 'showInUse',
    buttonLabel: 'Show in use',
    dataTest: 'productPhotosUploader',
  },
  {
    id: 'photoSizes',
    buttonIconType: 'showSizes',
    buttonLabel: 'Show sizes',
    dataTest: 'productPhotosUploader',
  },
  {
    id: 'photoVarienty',
    buttonIconType: 'showVariety',
    buttonLabel: 'Show variety',
    dataTest: 'productPhotosUploader',
  },
];

const Uploaders = ({
  onUpload,
  photoMain,
  aditionalPhotosMap,
}: {
  onUpload: (type: string, e: any) => void,
}) => (
  <div styleName="uploadersWrapper">
    {console.log('>>> Uploaders: ', { photoMain })}
    <div styleName="uploadItem">
      <UploadWrapper
        id="main_photo"
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
      >
        {photoMain && (
          <div styleName="uploadedPhotoWrapper">
            <img src={photoMain} alt="mainPhoto" />
          </div>
        )}
      </UploadWrapper>
    </div>
    {map(
      item => (
        <div key={item.id} styleName="uploadItem">
          <UploadWrapper
            id={item.id}
            onUpload={e => {
              onUpload(item.id, e);
            }}
            buttonHeight={26}
            buttonWidth={26}
            noIndents
            buttonIconType={item.buttonIconType}
            buttonIconSize={56}
            buttonLabel={item.buttonLabel}
            dataTest={item.dataTest}
          >
            {aditionalPhotosMap[item.id] && (
              <div styleName="uploadedPhotoWrapper">
                <img src={aditionalPhotosMap[item.id]} alt={item.buttonLabel} />
              </div>
            )}
          </UploadWrapper>
        </div>
      ),
      aditionalPhotosConfig,
    )}
    {/* <div styleName="uploadItem">
      <UploadWrapper
        id="photoDetails"
        onUpload={e => {
          onUpload('photoDetails', e);
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
        id="photoScene"
        onUpload={e => {
          onUpload('photoScene', e);
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
        id="photoUse"
        onUpload={e => {
          onUpload('photoUse', e);
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
        id="photoSizes"
        onUpload={e => {
          onUpload('photoSizes', e);
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
        id="photoVarienty"
        onUpload={e => {
          onUpload('photoVarienty', e);
        }}
        buttonHeight={26}
        buttonWidth={26}
        noIndents
        buttonIconType="showVariety"
        buttonIconSize={56}
        buttonLabel="Show variety"
        dataTest="productPhotosUploader"
      />
    </div> */}
  </div>
);

export default Uploaders;
