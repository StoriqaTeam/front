// @flow

import React from 'react';
import { Icon } from 'components/Icon';

import './MobileUpload.scss';

type PropsType = {
  onUpload: (e: any) => void,
  onDelete: (e: any) => void,
  id: string,
  img: ?string,
  dataTest: string,
  disabled: ?boolean,
  iconType: string,
};

const MobileUpload = ({
  dataTest,
  disabled,
  id,
  onUpload,
  onDelete,
  img,
  iconType,
}: PropsType) => (
  <div styleName="container">
    {!img ? (
      <span styleName="imageArea">
        <Icon type={iconType} size={28} />
      </span>
    ) : (
      <figure styleName="image">
        <span
          onClick={onDelete}
          onKeyPress={() => {}}
          role="button"
          styleName="trash"
          tabIndex="-1"
        >
          <Icon type="basket" size={24} />
        </span>
        <img src={img} alt="" />
      </figure>
    )}
    <label htmlFor={id} styleName="upload" data-test={dataTest}>
      Upload Photo
    </label>
    {!disabled && (
      <input
        style={{ display: 'none' }}
        id={id}
        type="file"
        onChange={onUpload}
      />
    )}
  </div>
);

export default MobileUpload;
