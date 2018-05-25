// @flow

import React, { Component } from 'react';
import { map, addIndex, propEq } from 'ramda';
import classNames from 'classnames';

import './ProductSize.scss';

import type { WidgetOptionType } from './types';

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
   * @param {WidgetOptionType} selected
   * @return {void}
   */
  handleClick = (index: number, selected: WidgetOptionType): void => {
    const { onClick } = this.props;
    onClick({ ...selected, state: 'selected' });
  };
  render() {
    const { title, options } = this.props;
    const mapIndexed = addIndex(map);
    return (
      <div styleName="container">
        <h4>{title}</h4>
        <div styleName="sizes">
          {mapIndexed((option, index, arr) => {
            const available = arr.every(propEq('state', 'available'));
            const separator = () =>
              !option.state === 'disabled' && option.state === 'available';
            return (
              <button
                key={`${option.label}`}
                onClick={() => this.handleClick(index, option)}
                styleName={`size ${
                  option.state === 'selected' ? 'clicked' : ''
                } ${option.state === 'disabled' ? 'disabled' : ''}`}
              >
                {option.label}
                {!available || separator() ? (
                  <span
                    styleName={classNames('separator', {
                      highlighted: option.state === 'selected',
                    })}
                  />
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
