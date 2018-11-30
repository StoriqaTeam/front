// @flow strict

import React, { PureComponent } from 'react';
import { isNil } from 'ramda';

import { Icon } from 'components/Icon';

import './MobileUpload.scss';

import t from './i18n';

type PropsType = {
  onUpload: (e: SyntheticInputEvent<HTMLInputElement>) => void,
  onDelete: (e: SyntheticEvent<HTMLSpanElement>) => void,
  id: string,
  img: ?string,
  dataTest: string,
  disabled: boolean,
  iconType: string,
};

class MobileUpload extends PureComponent<PropsType> {
  static defaultProps = {
    disabled: true,
    dataTest: 'dataMobileUpload',
  };

  render() {
    const {
      dataTest,
      disabled,
      id,
      onUpload,
      onDelete,
      img,
      iconType,
    } = this.props;
    return (
      <div styleName="container">
        {isNil(img) ? (
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
          {t.uploadPhoto}
        </label>
        {disabled && (
          <input
            style={{ display: 'none' }}
            id={id}
            type="file"
            onChange={onUpload}
          />
        )}
      </div>
    );
  }
}

export default MobileUpload;
