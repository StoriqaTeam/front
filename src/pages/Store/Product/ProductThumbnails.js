// @flow

import React, { Component } from 'react';
import { isEmpty, isNil } from 'ramda';
import classNames from 'classnames';

import './ProductThumbnails.scss';

import { sortByProp } from './utils';

import type { WidgetOptionType } from './types';

type PropsType = {
  /* eslint-disable react/no-unused-prop-types */
  isFirstSelected: boolean,
  isReset: boolean,
  title?: string,
  options: Array<WidgetOptionType>,
  row?: boolean,
  onClick: Function,
  isOnSelected: boolean,
};

type StateType = {
  selected: null | number,
};

class ProductThumbnails extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(
    nextProps: PropsType,
    prevState: StateType,
  ): StateType | null {
    const { isReset, isFirstSelected } = nextProps;
    if (isReset) {
      return {
        selected: isFirstSelected ? 0 : null,
      };
    }
    return prevState;
  }
  static defaultProps = {
    title: '',
    row: false,
    isReset: false,
    isFirstSelected: false,
  };
  state = {
    selected: null,
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
    const { options, row, title, isOnSelected } = this.props;
    const { selected } = this.state;
    const mapOptions = (option, index) => (
      <button
        key={`${option.label || option.id}`}
        onClick={() => this.handleClick(option, index)}
      >
        <figure styleName="thumbnailContainer">
          <img
            styleName={classNames(
              {
                clicked: option.state === 'selected' || selected === index,
              },
              {
                disabled: option.state === 'disabled',
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
        {!isEmpty(title) ? (
          <div id={title} styleName={classNames('title', { isOnSelected })}>
            <strong>{title}</strong>
          </div>
        ) : null}
        <div styleName={`thumbnails ${row ? 'row' : 'column'}`}>
          {isNil(options) ? null : sortByProp('label')(options).map(mapOptions)}
        </div>
      </div>
    );
  }
}

export default ProductThumbnails;
