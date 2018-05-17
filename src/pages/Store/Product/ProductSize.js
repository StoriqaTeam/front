// @flow

import React, { Component } from 'react';
import { map, addIndex, propEq } from 'ramda';

import './ProductSize.scss';

import { SelectedType, WidgetOptionType } from './types';

import { sortByProp } from './utils';

type PropsType = {
  title: string,
  options: Array<WidgetOptionType>,
  onClick: WidgetOptionType => WidgetOptionType,
};

class ProductSize extends Component<PropsType, {}> {
  /**
   * Highlights size's border when clicked
   * @param {number} index
   * @param {SelectedType} selected
   * @return {void}
   */
  handleClick = (index: number, selected: SelectedType): void => {
    const { onClick } = this.props;
    onClick({ ...selected, state: 'selected ' });
  };
  render() {
    const { title, options } = this.props;
    const mapIndexed = addIndex(map);
    return (
      <div styleName="container">
        <h4>{title}</h4>
        <div styleName="sizes">
          {mapIndexed((option, index, arr) => {
            const selected = arr.every(propEq('opacity', 'selected'));
            const separator = () =>
              !option.state === 'disable' && option.state === 'available';
            return (
              <button
                key={`${option.label}`}
                onClick={() => this.handleClick(index, option)}
                styleName={`size ${
                  option.state === 'selected' ? 'clicked' : ''
                } ${option.state === 'disable' ? 'opaque' : ''}`}
              >
                {option.label}
                {!selected && separator() ? (
                  <span styleName="separator" />
                ) : null}
              </button>
            );
          }, sortByProp('label')(options))}
        </div>
      </div>
    );
  }
}

export default ProductSize;
