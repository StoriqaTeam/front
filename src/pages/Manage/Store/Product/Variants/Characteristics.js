// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { filter, flatten, map, merge, prop, reduce } from 'ramda';

import { log } from 'utils';

import CharacteristicItem from './CharacteristicItem';
import attrs from './attrs.json';

type StateType = {
  items: Array<({ attrId: number, value: string })>,
};

type PropsType = {
  onChange: (Array<({ attrId: number, value: string })>) => void,
};

class Characteristics extends Component<PropsType, StateType> {
  state = {
    items: [],
  };

  getCategoriesWithAttributes = (categories: {}) => {
    const lvl1Childs = prop('children', categories);
    const lvl2Childs = flatten(map(prop('children'), lvl1Childs));
    const lvl3Childs = flatten(map(prop('children'), lvl2Childs));
    const categoriesWithAttrs = filter(item => prop('length', prop('getAttributes', item)) > 0, lvl3Childs);
    const filtered = map(item => ({ [item.rawId]: item.getAttributes }), categoriesWithAttrs);
    return reduce(merge, {}, filtered);
  };

  handleItemChange = (attribute: { attrId: number, value: string }) => {
    this.setState((prevState) => {
      const { attrId, value } = attribute;
      const filteredItems = filter(item => item.attrId !== attrId, prevState.items);
      filteredItems.push({ attrId, value });
      this.props.onChange(filteredItems);
      return { items: filteredItems };
    });
  };

  renderCharacteristicItems = () => {
    // const { categories } = this.context.directories;
    // const attrsByCategory = this.getCategoriesWithAttributes(categories);
    // const currentAttrs = attrsByCategory[this.props.categoryId];
    // log.debug({ currentAttrs });
    return [
      <CharacteristicItem
        key={`characteristic-item-${attrs[0].id}`}
        attribute={attrs[0]}
        onSelect={this.handleItemChange}
      />,
      <CharacteristicItem
        key={`characteristic-item-${attrs[1].id}`}
        attribute={attrs[1]}
        onSelect={this.handleItemChange}
      />,
      <CharacteristicItem
        key={`characteristic-item-${attrs[2].id}`}
        attribute={attrs[2]}
        onSelect={this.handleItemChange}
      />,
    ];
  };

  render() {
    return this.renderCharacteristicItems();
  }
}

Characteristics.contextTypes = {
  directories: PropTypes.object,
};

export default Characteristics;
