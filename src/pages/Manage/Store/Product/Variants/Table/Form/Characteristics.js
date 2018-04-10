// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { filter, propEq, head, pathOr } from 'ramda';

import CharacteristicItem from './CharacteristicItem';

import './Characteristics.scss';

type PropsType = {
  onChange: (Array<({ attrId: number, value: string })>) => void,
  values: Array<{ attrId: string, value: string }>,
  category: { getAttributes: Array<{}> },
};

class Characteristics extends PureComponent<PropsType> {
  handleItemChange = (attribute: { attrId: number, value: string }) => {
    const { attrId, value, metaField } = attribute;
    const filteredItems = filter(item => item.attrId !== attrId, this.props.values);
    filteredItems.push({ attrId, value, metaField });
    this.props.onChange(filteredItems);
  };

  render() {
    const attributes = pathOr([], ['getAttributes'], this.props.category);
    return (
      <div styleName="container">
        <div styleName="title">Характеристики</div>
        <div styleName="items">
          {attributes.map(item => (
            <CharacteristicItem
              key={item.id}
              attribute={item}
              onSelect={this.handleItemChange}
              value={head(filter(propEq('attrId', item.rawId), this.props.values))}
            />
          ))}
        </div>
      </div>
    );
  }
}

Characteristics.contextTypes = {
  directories: PropTypes.object,
};

export default Characteristics;
