// @flow

import React, { Component } from 'react';
import {
  assoc,
  pathOr,
  map,
  propEq,
  addIndex,
  findIndex,
  filter,
  complement,
  isNil,
} from 'ramda';

import { UploadWrapper } from 'components/Upload';
import { Select } from 'components/common/Select';
import { Icon } from 'components/Icon';
import { uploadFile, log, convertSrc } from 'utils';

import type { GetAttributeType } from 'pages/Manage/Store/Products/types';

import './Characteristics.scss';

type StateType = {
  isPhotoUploading: boolean,
};

type PropsType = {
  attribute: GetAttributeType,
  onSelect: Function,
  value: { attrId: number, value: string, metaField?: ?string },
};

class CharacteristicItem extends Component<PropsType, StateType> {
  state = {
    isPhotoUploading: false,
  };

  getSelectItems = (
    attribute: GetAttributeType,
  ): Array<{ id: string, label: string }> => {
    // $FlowIgnoreMe
    const values = pathOr(null, ['metaField', 'values'], attribute);
    const translatedValues = pathOr(
      [],
      ['metaField', 'translatedValues'],
      // $FlowIgnoreMe
      attribute,
    );
    const mapIndexed = addIndex(map);

    if (values) {
      return mapIndexed((item, idx) => ({ id: `${idx}`, label: item }), values);
    }

    const items = mapIndexed(
      // $FlowIgnoreMe
      (item: { translations: Array<{ text: string }> }, idx: number) => {
        // $FlowIgnoreMe
        const text = pathOr(null, ['translations', 0, 'text'], item);
        if (text) {
          return {
            id: `${idx}`,
            label: text,
          };
        }
        return null;
      },
      translatedValues || [],
    );
    return filter(complement(isNil), items);
  };

  handleSelect = (value: { label: string }) => {
    this.props.onSelect({
      ...this.props.value,
      value: value.label,
      attrId: this.props.attribute.rawId,
    });
  };

  handleOnUpload = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.setState({ isPhotoUploading: true });
    uploadFile(e.target.files[0])
      .then(result => {
        if (!result || result.url == null) {
          log.error(result);
          alert('Error :('); // eslint-disable-line
        }
        this.props.onSelect(assoc('metaField', result.url, this.props.value));
      })
      .catch(alert)
      .finally(() => {
        this.setState({ isPhotoUploading: false });
      });
  };

  handleRemoveImg = () => {
    const { onSelect, value } = this.props;
    onSelect(assoc('metaField', '', value));
  };

  render() {
    const { attribute, value } = this.props;
    const { isPhotoUploading } = this.state;
    if (!value) {
      log.warn('CharacteristicItem', 'value is nil');
      return null;
    }
    const items = this.getSelectItems(attribute);
    const selectedItem = {
      id: `${findIndex(propEq('label', value.value), items)}`,
      label: value.value,
    };
    const { metaField: characteristicImg } = this.props.value;
    // $FlowIgnoreMe
    const name = pathOr('', ['name', 0, 'text'], attribute);
    return (
      <div styleName="item">
        <div styleName="characteristicImg">
          <div styleName="upload">
            <UploadWrapper
              id={attribute.id}
              buttonLabel="Add photo"
              onUpload={this.handleOnUpload}
              buttonHeight={10}
              buttonWidth={10}
              buttonIconType="upload"
              overPicture={convertSrc(characteristicImg, 'small')}
              loading={isPhotoUploading}
              dataTest="productCharacteristicImgUploader"
            />
          </div>
          {characteristicImg && (
            <div styleName="remove">
              <div
                styleName="removeButton"
                onClick={this.handleRemoveImg}
                onKeyDown={() => {}}
                role="button"
                tabIndex="0"
              >
                <Icon type="basket" size={32} />
              </div>
            </div>
          )}
        </div>
        <div styleName="characteristicSelect">
          <Select
            forForm
            fullWidth
            label={name}
            activeItem={selectedItem}
            items={items}
            onSelect={this.handleSelect}
            dataTest="characteristicSelect"
          />
        </div>
      </div>
    );
  }
}

export default CharacteristicItem;
