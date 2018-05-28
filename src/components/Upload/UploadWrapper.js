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
  noIndents: ?boolean,
  id: string,
  dataTest: string,
  buttonIconSize: ?number,
  disabled: ?boolean,
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
  noIndents,
  id,
  dataTest,
  buttonIconSize,
  disabled,
}: PropsType) => (
  <div styleName="wrapper">
    <div styleName={classNames('upoloadContainer', { noIndents })}>
      <label
        htmlFor={id}
        styleName="uploadButton"
        style={{ height: `${buttonHeight}rem`, width: `${buttonWidth}rem` }}
        data-test={dataTest}
      >
        {buttonIconType &&
          !overPicture && (
            <Icon type={buttonIconType} size={buttonIconSize || 32} />
          )}
        {!overPicture && (
          <span styleName={classNames('buttonLabel')}>{buttonLabel}</span>
        )}
        {overPicture && (
          <div
            styleName="overPictureWrap"
            style={{ height: `${buttonHeight}rem`, width: `${buttonWidth}rem` }}
          >
            <img styleName="overPicture" src={overPicture} alt="img" />
          </div>
        )}
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
    <div styleName="childrenConainer">
      <div styleName="upoloadChildren">{children}</div>
    </div>
  </div>
);

export default UploadWrapper;
