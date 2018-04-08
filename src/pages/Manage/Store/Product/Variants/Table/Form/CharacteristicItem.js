// @flow

import React, { PureComponent } from 'react';
import { assoc, pathOr, map, propEq, addIndex, findIndex, filter, complement, isNil } from 'ramda';

import { UploadWrapper } from 'components/Upload';
import { MiniSelect } from 'components/MiniSelect';
import { uploadFile } from 'utils';

import './Characteristics.scss';

type PropsType = {
  attribute: { rawId: number },
  onSelect: ({ attrId: number, value: string }) => void,
  value: { attrId: number, value: string, metaField?: string },
};

class CharacteristicItem extends PureComponent<PropsType> {
  getSelectItems = (attribute: {}) => {
    const values = pathOr(null, ['metaField', 'values'], attribute);
    const translatedValues = pathOr(null, ['metaField', 'translatedValues'], attribute);
    const mapIndexed = addIndex(map);

    if (values) {
      return mapIndexed((item, idx) => ({ id: `${idx}`, label: item }), values);
    }

    const items = mapIndexed((item, idx) => {
      const text = pathOr(null, [0, 'text'], item);
      if (text) {
        return {
          id: `${idx}`,
          label: text,
        };
      }
      return null;
    }, translatedValues);
    return filter(complement(isNil), items);
  };

  handleSelect = (value: {}) => {
    this.props.onSelect({
      ...this.props.value,
      value: value.label,
      attrId: this.props.attribute.rawId,
    });
  };

  handleOnUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const result = await uploadFile(file);
    if (!result.url) return;
    this.props.onSelect(assoc('metaField', result.url, this.props.value));
  };

  render() {
    const { attribute, value } = this.props;
    const items = this.getSelectItems(attribute);
    const selectedItem = { id: `${findIndex(propEq('label', value.value), items)}`, label: value.value };
    const { metaField: characteristicImg } = this.props.value;
    const name = pathOr('', ['name', 0, 'text'], attribute);
    return (
      <div styleName="item">
        <div styleName="characteristicImg">
          <UploadWrapper
            id={attribute.id}
            onUpload={this.handleOnUpload}
            buttonHeight={80}
            buttonWidth={80}
            buttonIconType="upload"
            overPicture={characteristicImg}
          />
        </div>
        <MiniSelect
          forForm
          fullWidth
          label={name}
          activeItem={selectedItem}
          items={items}
          onSelect={this.handleSelect}
        />
      </div>
    );
  }
}

export default CharacteristicItem;
