// @flow

import React from 'react';
// import classNames from 'classnames';

import './MobileUpload.scss';

type PropsType = {
  onUpload: (e: any) => void,
  id: string,
  dataTest: string,
  disabled: ?boolean,
};

const MobileUpload = ({ dataTest, disabled, id, onUpload }: PropsType) => (
  <div styleName="container">
    <label htmlFor={id} styleName="upload" data-test={dataTest}>
      <span>some text</span>
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
