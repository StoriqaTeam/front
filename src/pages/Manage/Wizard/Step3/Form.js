// @flow

import React from 'react';
import { map, find } from 'ramda';

import { getNameText } from 'utils';
import { UploadWrapper } from 'components/Upload';
import { Icon } from 'components/Icon';
import { Input } from 'components/common/Input';
import { Textarea } from 'components/common/Textarea';
import { CategorySelector } from 'components/CategorySelector';

import './Form.scss';

type PropsType = {
  // data: {
  //   userId: ?number,
  //   storeId: ?number,
  //   name: ?string,
  //   slug: ?string,
  //   shortDescription: ?string,
  //   defaultLanguage: ?string,
  //   country: ?string,
  //   address: ?string,
  // },
  // onChange: (data: { [name: string]: string }) => void,
};

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

const ThirdForm = ({
  data,
  onChange,
  products,
  categories,
  onUpload,
}: PropsType) => {
  console.log(products);

  const handleChangeData = e => {
    const {
      target: { value, name },
    } = e;
    onChange({ [name]: value });
  };

  const { addressFull } = data;
  console.log('third products: ', products);

  return (
    <div styleName="wrapper">
      <div styleName="formWrapper">
        <div styleName="headerTitle">Add new product</div>
        <div styleName="headerDescription">
          Fill up the forms below to show up as many attributes of your good to
          make it clear for buyer
        </div>
        <div styleName="form">
          <div styleName="section">
            <div styleName="formItem">
              <Input
                id="name"
                value={data.name}
                label="Product name"
                onChange={handleChangeData}
                fullWidth
              />
            </div>
            <div styleName="formItem">
              <Textarea
                id="shortDescription"
                value={data.shortDescription}
                label="Short description"
                onChange={handleChangeData}
                fullWidth
              />
            </div>
          </div>
          <div styleName="section">
            <div styleName="sectionName">Product photo</div>
            <Uploaders onUpload={onUpload} />
          </div>
          <div styleName="section">
            <div styleName="sectionName">Product photo</div>
            <Uploaders onUpload={onUpload} />
          </div>
          <div styleName="section">
            <div styleName="sectionName">General settings and pricing</div>
            <div styleName="formItem">
              {/* <CategorySelector
                categories={categories}
                onSelect={itemId => console.log('^^^^ selected category: ', itemId)}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdForm;
