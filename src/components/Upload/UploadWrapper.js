// @flow

// TODO: отрефакторить таким образом, чтобы hidden input и вызов uploadFile с
// отображением ошибок рулились из этого компонента.
// другими словами, сделать полностью автономным

import React from 'react';
import type { Node } from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import type { IconSizeType } from 'types';

import './UploadWrapper.scss';

type PropsType = {
  children?: ?Node,
  onUpload: (e: SyntheticInputEvent<HTMLInputElement>) => void,
  buttonLabel: string,
  buttonHeight: number | string,
  buttonWidth: number | string,
  fullWidth?: ?boolean,
  buttonIconType: ?string,
  overPicture?: ?string,
  noIndents?: ?boolean,
  id: string,
  dataTest: string,
  buttonIconSize?: IconSizeType,
  disabled?: ?boolean,
  customUnit?: boolean,
  square?: boolean,
  loading?: boolean,
  multiple?: boolean,
};

// TODO: refactor for avoid use style props

const UploadWrapper = ({
  buttonLabel,
  children,
  onUpload,
  buttonHeight,
  buttonWidth,
  fullWidth,
  buttonIconType,
  overPicture,
  noIndents,
  id,
  dataTest,
  buttonIconSize,
  disabled,
  customUnit,
  square,
  loading,
  multiple,
}: PropsType) => (
  <div styleName={classNames('wrapper', { square })}>
    {loading && (
      <div styleName="uploadIndicator">
        <div styleName="spinner" />{' '}
      </div>
    )}
    <div styleName={classNames('uploadContainer', { noIndents })}>
      <label
        htmlFor={id}
        styleName={classNames('uploadButton', { fullWidth })}
        style={{
          height: `${buttonHeight}${customUnit ? '' : 'rem'}`,
          width: !fullWidth && `${buttonWidth}${customUnit ? '' : 'rem'}`,
        }}
        data-test={dataTest}
      >
        {buttonIconType &&
          !overPicture && <Icon type={buttonIconType} size={buttonIconSize} />}
        {!overPicture && (
          <span styleName={classNames('buttonLabel')}>{buttonLabel}</span>
        )}
        {overPicture && (
          <div
            styleName="overPictureWrap"
            style={{ height: `${buttonHeight}rem`, width: `${buttonWidth}rem` }}
          >
            {overPicture && (
              <span styleName="overlay">
                <span
                  onClick={() => {}}
                  onKeyPress={() => {}}
                  role="button"
                  styleName="delete"
                  tabIndex="-1"
                >
                  <Icon type="basket" size={24} />
                </span>
              </span>
            )}
            <img styleName="overPicture" src={overPicture} alt="img" />
          </div>
        )}
      </label>
      {!disabled && (
        <input
          style={{ display: 'none' }}
          multiple={multiple}
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

UploadWrapper.defaultProps = {
  customUnit: false,
  square: false,
  buttonIconSize: 32,
  children: null,
  fullWidth: null,
  overPicture: null,
  noIndents: null,
  disabled: null,
  loading: false,
  multiple: undefined,
};

export default UploadWrapper;
