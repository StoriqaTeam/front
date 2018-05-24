// @flow

import React, { PureComponent } from 'react';
import { map, concat, filter, complement, propEq, find } from 'ramda';

import CharacteristicItem from 'pages/Manage/Store/Product/Variants/Table/Form/CharacteristicItem';

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
  handleCharectiristicItemChange = (data: {
    attrId: number,
    value: string,
    metaField?: string,
  }) => {
    const notChangedAttrs =
      filter(complement(propEq('attrId', data.attrId)), this.props.values) ||
      [];
    // $FlowIgnoreMe
    const result = concat([data], notChangedAttrs);
    this.props.onChange(result);
  };

  renderCharacteristics = map((item: AttributeType) => {
    const value = find(propEq('attrId', item.rawId), this.props.values);
    if (value) {
      return (
        <div styleName="itemWrapper">
          <CharacteristicItem
            key={item.id}
            // $FlowIgnoreMe
            attribute={item}
            onSelect={this.handleCharectiristicItemChange}
            // $FlowIgnoreMe
            value={value}
          />
        </div>
      );
    }
    return null;
  });

  render() {
    const { attributes } = this.props;
    return this.renderCharacteristics(attributes);
  }
}

export default AttributesForm;
