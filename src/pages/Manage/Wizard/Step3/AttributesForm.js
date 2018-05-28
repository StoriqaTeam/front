// @flow

import React, { PureComponent } from 'react';
import { map, concat, filter, complement, propEq, find } from 'ramda';

import { log } from 'utils';

import { CharacteristicItem } from './CharacteristicItem';

import './AttributesForm.scss';

export type AttributeType = {
  id: string,
  rawId: number,
  metaField: {
    translatedValues: Array<{
      translations: Array<{ text: string }>,
    }>,
    values: ?Array<string>,
  },
};

export type AttrValueType = {
  attrId: number,
  value: string,
  metaField?: ?string,
};

type PropsType = {
  attributes: Array<AttributeType>,
  values: Array<AttrValueType>,
  onChange: (attrs: Array<AttrValueType>) => void,
};

class AttributesForm extends PureComponent<PropsType> {
  handleCharectiristicItemChange = (
    data: ?{
      attrId: number,
      value: string,
      metaField?: string,
    },
  ) => {
    // log.info('>>> AttributeForm handleCharectiristicItemChange: ', { data });
    const notChangedAttrs =
      filter(complement(propEq('attrId', data.attrId)), this.props.values) ||
      [];
    // $FlowIgnoreMe
    const result = data.value
      ? concat([data], notChangedAttrs)
      : notChangedAttrs;
    this.props.onChange(
      data.value !== 'NotSelected' ? result : notChangedAttrs,
    );
  };

  renderCharacteristics = map((item: AttributeType) => {
    const value = find(propEq('attrId', item.rawId), this.props.values);
    // log.info('>>> AttributesForm renderCharacteristics: ', {
    //   item,
    //   value,
    //   values: this.props.values,
    // });
    // if (value) {
    return (
      <div key={item.id} styleName="itemWrapper">
        <CharacteristicItem
          // $FlowIgnoreMe
          attribute={item}
          onSelect={this.handleCharectiristicItemChange}
          // $FlowIgnoreMe
          value={value}
        />
      </div>
    );
    // }
    // return null;
  });

  render() {
    const { attributes, values } = this.props;
    // const attributesWithEmpty = [
    //   { id: 'notSelected', rawId: 0, name: [{ text: 'Not selected' }] }, // for empty value
    //   ...attributes,
    // ];
    // log.info('>>> AttributesForm render: ', { attributes, values });
    return this.renderCharacteristics(attributes);
  }
}

export default AttributesForm;
