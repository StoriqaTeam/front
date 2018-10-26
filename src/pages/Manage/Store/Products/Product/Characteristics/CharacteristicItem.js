// @flow

import React, { PureComponent } from 'react';
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

type PropsType = {
  attribute: GetAttributeType,
  onSelect: Function,
  value: { attrId: number, value: string, metaField?: ?string },
};

class CharacteristicItem extends PureComponent<PropsType> {
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

  handleOnUpload = async (e: any) => {
    e.preventDefault();
    const file = e.target.files[0];
    const result = await uploadFile(file);
    if (!result.url) return;
    this.props.onSelect(assoc('metaField', result.url, this.props.value));
  };

  handleRemoveImg = () => {
    const { onSelect, value } = this.props;
    onSelect(assoc('metaField', '', value));
  };

  render() {
    const { attribute, value } = this.props;
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
              onUpload={this.handleOnUpload}
              buttonHeight={10}
              buttonWidth={10}
              buttonIconType="upload"
              overPicture={convertSrc(characteristicImg, 'small')}
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
