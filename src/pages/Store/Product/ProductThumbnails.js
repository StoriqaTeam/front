// @flow

import React, { Component } from 'react';
import { isEmpty, isNil } from 'ramda';
import classNames from 'classnames';

import './ProductThumbnails.scss';

import { sortByProp } from './utils';

import { WidgetOptionType } from './types';

type PropsType = {
  /* eslint-disable react/no-unused-prop-types */
  isFirstSelected: boolean,
  title?: string,
  options: Array<WidgetOptionType>,
  row?: boolean,
  onClick: Function,
};

type StateType = {
  selected: null | number,
};

class ProductThumbnails extends Component<PropsType, StateType> {
  static defaultProps = {
    title: '',
    row: false,
    isFirstSelected: false,
  };
  state = {
    selected: 0,
  };
  handleClick = (option: WidgetOptionType, index: number): void => {
    const { onClick } = this.props;
    this.setState(
      {
        selected: index,
      },
      () => {
        onClick(option);
      },
    );
  };
  render() {
    const { options, row, title, isFirstSelected } = this.props;
    const { selected } = this.state;
    const mapOptions = (option, index) => (
      <button
        key={`${option.label || option.id}`}
        onClick={() => this.handleClick(option, index)}
      >
        <figure>
          <img
            styleName={classNames(
              {
                clicked:
                  option.state === 'selected' ||
                  (isFirstSelected && selected === index),
              },
              {
                disable: option.state === 'disable',
              },
            )}
            src={option.image}
            alt={option.alt || 'image alt'}
          />
        </figure>
      </button>
    );
    return (
      <div
        styleName={classNames('container', {
          'scroll-x': row,
          'scroll-y': !row,
        })}
      >
        {!isEmpty(title) ? <h4>{title}</h4> : null}
        <div styleName={`thumbnails ${row ? 'row' : 'column'}`}>
          {isNil(options) ? null : sortByProp('label')(options).map(mapOptions)}
        </div>
      </div>
    );
  }
}

export default ProductThumbnails;
