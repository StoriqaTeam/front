// @flow

import React from 'react';
import type { Node } from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import './UploadWrapper.scss';

type PropsType = {
  children: Node,
  onUpload: (e: any) => void,
  buttonLabel: string,
  buttonHeight: number,
  buttonWidth: number,
  buttonIconType: ?string,
  overPicture: ?string,
  id: string,
};


// TODO: refactor for avoid use style props

const UploadWrapper = ({
  buttonLabel,
  children,
  onUpload,
  buttonHeight,
  buttonWidth,
  buttonIconType,
  overPicture,
  id,
}: PropsType) => (
  <div styleName="wrapper">
    <div styleName="upoloadContainer">
      <label
        htmlFor={id}
        styleName="uploadButton"
        style={{ height: `${buttonHeight}rem`, width: `${buttonWidth}rem` }}
      >
        {(buttonIconType && !overPicture && <Icon type={buttonIconType} size={32} />)}
        {!overPicture && <span styleName={classNames('buttonLabel')}>{buttonLabel}</span>}
        {overPicture &&
          <div
            styleName="overPictureWrap"
            style={{ height: buttonHeight, width: buttonWidth }}
          >
            <img
              styleName="overPicture"
              src={overPicture}
              alt="img"
            />
          </div>
        }
      </label>
      <input style={{ display: 'none' }} id={id} type="file" onChange={onUpload} />
    </div>
    <div styleName="childrenConainer">
      <div styleName="upoloadChildren">
        {children}
      </div>
    </div>
  </div>
);

export default UploadWrapper;
