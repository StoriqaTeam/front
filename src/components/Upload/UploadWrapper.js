// @flow

import React from 'react';
import type { Node } from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import './UploadWrapper.scss';

type PropsType = {
  isReady: boolean,
  children: Node,
  onUpload: (e: any) => void,
  buttonLabel: string,
  buttonHeight: number,
  buttonWidth: number,
  buttonIconType: ?string,
};

const UploadWrapper = ({
  buttonLabel,
  isReady,
  children,
  onUpload,
  buttonHeight,
  buttonWidth,
  buttonIconType,
}: PropsType) => {
  if (!isReady) {
    return (
      <div>Loading</div>
    );
  }
  return (
    <div styleName="wrapper">
      <div styleName="upoloadContainer">
        <label htmlFor="exampleInput" styleName="uploadButton" style={{ height: buttonHeight, width: buttonWidth }}>
          {(buttonIconType && <Icon type={buttonIconType} size={32} />)}
          <span styleName={classNames('buttonLabel')}>{buttonLabel}</span>
        </label>
        <input style={{ display: 'none' }} id="exampleInput" type="file" onChange={onUpload} />
      </div>
      <div styleName="childrenConainer">
        <div styleName="upoloadChildren">
          {children}
        </div>
      </div>
    </div>
  );
};

export default UploadWrapper;
