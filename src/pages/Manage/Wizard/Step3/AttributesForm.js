// @flow

import React, { PureComponent } from 'react';
import { map, concat, filter, complement, propEq, find } from 'ramda';

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
  value: ?string,
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
    const notChangedAttrs =
      (data &&
        filter(complement(propEq('attrId', data.attrId)), this.props.values)) ||
      [];
    const result =
      data && data.value
        ? // $FlowIgnoreMe
          concat([data], notChangedAttrs)
        : notChangedAttrs;
    this.props.onChange(data && data.value ? result : notChangedAttrs);
  };

  renderCharacteristics = map((item: AttributeType) => {
    const value = find(propEq('attrId', item.rawId), this.props.values);
    return (
      <div key={item.id} styleName="itemWrapper">
        <CharacteristicItem
          attribute={item}
          onSelect={this.handleCharectiristicItemChange}
          value={value}
        />
      </div>
    );
  });

  render() {
    const { attributes } = this.props;
    return this.renderCharacteristics(attributes);
  }
}

export default AttributesForm;
