// @flow

import React from 'react';
import { isEmpty } from 'ramda';
import { Icon } from 'components/Icon';

import './MobileUpload.scss';

type PropsType = {
  onUpload: (e: any) => void,
  onDelete: (e: any) => void,
  id: string,
  avatar: ?string,
  dataTest: string,
  disabled: ?boolean,
};

const MobileUpload = ({
  dataTest,
  disabled,
  id,
  onUpload,
  onDelete,
  avatar,
}: PropsType) => (
  <div styleName="container">
    {isEmpty(avatar) ? (
      <span styleName="imageArea">
        <Icon type="user" />
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
        <img src={avatar} alt="" />
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
