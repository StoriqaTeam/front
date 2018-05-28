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
import { uploadFile, log } from 'utils';

import './Characteristics.scss';

type AttributeType = {
  rawId: number,
  id: string,
  name: string,
  metaField: {
    translatedValues: ?Array<{}>,
    values: ?Array<string>,
  },
};

type PropsType = {
  attribute: AttributeType,
  onSelect: Function,
  value: { attrId: number, value: string, metaField?: string },
};

class CharacteristicItem extends PureComponent<PropsType> {
  getSelectItems = (
    attribute: AttributeType,
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
    // log.info('>>> CharacteristicItem handleSelect: ', value);
    this.props.onSelect({
      ...this.props.value,
      value: value ? value.label : null,
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

  render() {
    const { attribute, value } = this.props;
    // if (!value) {
    //   log.warn('CharacteristicItem', 'value is nil');
    //   return null;
    // }
    // const emptyItem = { id: '-1', label: 'NotSelected' };
    // const items = [emptyItem, ...this.getSelectItems(attribute)];
    const items = this.getSelectItems(attribute);
    const selectedItem = value
      ? {
          id: `${findIndex(propEq('label', value.value), items)}`,
          label: value.value,
        }
      : null;
    // : emptyItem;
    // : items;
    // const { metaField: characteristicImg } = this.props.value;
    const characteristicImg = pathOr('', ['metaField'], this.props.value);
    // $FlowIgnoreMe
    const name = pathOr('', ['name', 0, 'text'], attribute);
    log.info('>>> CharacteristicItem render: ', { value, selectedItem });
    return (
      <div styleName="item">
        <div styleName="characteristicImg">
          <UploadWrapper
            id={attribute.id}
            onUpload={this.props.value && this.handleOnUpload}
            buttonHeight={10}
            buttonWidth={10}
            buttonIconType="upload"
            overPicture={characteristicImg}
            dataTest="productCharacteristicImgUploader"
            disabled={!this.props.value}
          />
        </div>
        <div styleName="characteristicSelect">
          <Select
            forForm
            withEmpty
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
