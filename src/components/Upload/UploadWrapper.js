// @flow strict

import React from 'react';
import type { Node } from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';
import { log } from 'utils';

import './UploadWrapper.scss';

type PropsType = {
  children?: Node,
  onUpload: (e: SyntheticInputEvent<HTMLInputElement>) => void,
  buttonLabel: string,
  buttonHeight: number | string,
  buttonWidth: number | string,
  fullWidth?: boolean,
  buttonIconType: ?string,
  overPicture?: ?string,
  noIndents: ?boolean,
  id: string,
  dataTest: string,
  buttonIconSize:
    | 8
    | 16
    | 20
    | 24
    | 28
    | 32
    | 36
    | 40
    | 48
    | 56
    | 80
    | 120
    | void,
  disabled?: boolean,
  customUnit?: boolean,
  square?: boolean,
};

const UploadWrapper = (props: PropsType) => {
  const {
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
  } = props;

  log.debug('UploadWrapper', props);

  return (
    <div styleName={classNames('wrapper', { square })}>
      <div styleName={classNames('uploadContainer', { noIndents })}>
        <label
          htmlFor={id}
          styleName={classNames('uploadButton', { fullWidth })}
          style={{
            height: `${buttonHeight}${customUnit === true ? '' : 'rem'}`,
            width:
              fullWidth === false &&
              `${buttonWidth}${customUnit === true ? '' : 'rem'}`,
          }}
          data-test={dataTest}
        >
          {buttonIconType != null &&
            overPicture == null && (
              <Icon type={buttonIconType} size={buttonIconSize || 32} />
            )}
          {overPicture == null && (
            <span styleName={classNames('buttonLabel')}>{buttonLabel}</span>
          )}
          {overPicture != null && (
            <div
              styleName="overPictureWrap"
              style={{
                height: `${buttonHeight}rem`,
                width: `${buttonWidth}rem`,
              }}
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
        {disabled === false && (
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
};

UploadWrapper.defaultProps = {
  customUnit: false,
  square: false,
  children: null,
  overPicture: null,
  disabled: false,
  fullWidth: false,
};

export default UploadWrapper;
