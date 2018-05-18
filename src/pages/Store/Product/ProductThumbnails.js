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

class ProductThumbnails extends Component<PropsType, {}> {
  static defaultProps = {
    title: '',
    row: false,
    isFirstSelected: false,
  };
  handleClick = (option: WidgetOptionType): void => {
    const { onClick } = this.props;
    onClick(option);
  };
  render() {
    const { options, row, title } = this.props;
    const mapOptions = option => (
      <button key={`${option.label}`} onClick={() => this.handleClick(option)}>
        <figure>
          <img
            styleName={classNames(
              {
                clicked: option.state === 'selected',
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
      <div styleName="container">
        {!isEmpty(title) ? <h4>{title}</h4> : null}
        <div styleName={`thumbnails ${row ? 'row' : 'column'}`}>
          {isNil(options) ? null : sortByProp('label')(options).map(mapOptions)}
        </div>
      </div>
    );
  }
}

export default ProductThumbnails;
