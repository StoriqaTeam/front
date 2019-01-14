// @flow

import React, { Component } from 'react';
import { isEmpty, isNil, contains, find, propEq } from 'ramda';
import classNames from 'classnames';

import ImageLoader from 'libs/react-image-loader';
import { convertSrc } from 'utils';

import { Icon } from 'components/Icon';

import './ProductThumbnails.scss';

import { sortByProp } from '../utils';

import type { ProductVariantType, WidgetOptionType } from '../types';

type PropsType = {
  /* eslint-disable react/no-unused-prop-types */
  isFirstSelected: boolean,
  isReset: boolean,
  title?: string,
  options: Array<WidgetOptionType>,
  row?: boolean,
  onClick: Function,
  isOnSelected: boolean,
  availableValues?: Array<string>,
  selectedValue: ?string,
  productVariant: ProductVariantType,
};

type StateType = {
  selected: ?number,
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
    selected: null, // eslint-disable-line
  };

  handleClick = (option: WidgetOptionType): void => {
    this.props.onClick(option);
  };

  render() {
    const {
      options,
      row,
      title,
      isOnSelected,
      selectedValue,
      availableValues,
      productVariant,
    } = this.props;

    const mapOptions = option => {
      const productVariantAttribute = find(propEq('value', option.label))(
        productVariant.attributes,
      );
      const img = productVariantAttribute
        ? productVariantAttribute.metaField
        : option.image;
      const isDisabled = availableValues
        ? !contains(option.label, availableValues)
        : option.state === 'disabled';

      return (
        <button
          key={`${option.label || option.id}`}
          styleName="button"
          data-test={`productThumbail${option.label}`}
          onClick={() => this.handleClick(option)}
        >
          {option.image ? (
            <figure
              styleName={classNames('thumbnailContainer', {
                clicked: option.label === selectedValue,
                disabled: isDisabled,
              })}
            >
              <ImageLoader
                fit
                src={convertSrc(img, 'medium')}
                loader={<div />}
              />
            </figure>
          ) : (
            <div
              styleName={classNames('emptyImg', {
                clicked: option.label === selectedValue,
                disabled: isDisabled,
              })}
            >
              <Icon type="camera" size={24} />
            </div>
          )}
        </button>
      );
    };

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
