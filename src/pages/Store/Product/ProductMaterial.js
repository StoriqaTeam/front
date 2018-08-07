// @flow

import React, { Component } from 'react';
import { isNil } from 'ramda';
import classNames from 'classnames';

import { Select } from 'components/common/Select';

import './ProductMaterial.scss';

import { sortByProp } from './utils';

import type { WidgetOptionType } from './types';

type MaterialType = { id: string | number, label: string };

type PropsType = {
  title: string,
  options: Array<MaterialType>,
  onSelect: Function,
  isOnSelected: boolean,
};

type StateType = {
  selected: WidgetOptionType | null,
};

class ProductMaterial extends Component<PropsType, StateType> {
  state = {
    selected: null,
  };
  /**
   * Highlights size's border when clicked
   * @param {WidgetOptionType} selected
   * @return {void}
   */
  handleSelect = (selected: WidgetOptionType): void => {
    const { onSelect } = this.props;
    this.setState(
      {
        selected,
      },
      () => onSelect(selected),
    );
  };
  render() {
    const { title, options, isOnSelected } = this.props;
    const { selected } = this.state;
    return (
      <div styleName="container">
        <div id={title} styleName={classNames('title', { isOnSelected })}>
          <strong>{title}</strong>
        </div>
        {isNil(options) ? null : (
          <Select
            forForm
            activeItem={selected ? sortByProp('label')(options)[0] : null}
            items={sortByProp('label')(options)}
            onSelect={this.handleSelect}
          />
        )}
      </div>
    );
  }
}

export default ProductMaterial;
