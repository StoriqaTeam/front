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
import { uploadFile, log, convertSrc } from 'utils';

import './Characteristics.scss';

type AttributeType = {
  rawId: number,
  id: string,
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

type StateType = {
  isPhotoUploading: boolean,
};

class CharacteristicItem extends Component<PropsType, StateType> {
  state = {
    isPhotoUploading: false,
  };

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
          <UploadWrapper
            id={attribute.id}
            onUpload={this.handleOnUpload}
            buttonHeight={10}
            buttonWidth={10}
            buttonIconType="upload"
            overPicture={convertSrc(characteristicImg, 'small')}
            dataTest="productCharacteristicImgUploader"
            loading={this.state.isPhotoUploading}
            buttonLabel=""
          />
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
