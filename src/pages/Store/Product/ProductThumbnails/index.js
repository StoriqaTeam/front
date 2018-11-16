// @flow

import React, { Component } from 'react';
import { isEmpty, isNil, contains } from 'ramda';
import classNames from 'classnames';

import BannerLoading from 'components/Banner/BannerLoading';
import ImageLoader from 'libs/react-image-loader';
import { convertSrc } from 'utils';

import { Icon } from 'components/Icon';

import './ProductThumbnails.scss';

import { sortByProp } from '../utils';

import type { WidgetOptionType } from '../types';

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
    selected: null,
  };

  handleClick = (option: WidgetOptionType, index: number): void => {
    if (
      this.props.availableValues &&
      !contains(option.label, this.props.availableValues)
    ) {
      return;
    }

    this.setState({ selected: index }, () => {
      this.props.onClick(option);
    });
  };

  render() {
    const { options, row, title, isOnSelected, availableValues } = this.props;
    const { selected } = this.state;

    const mapOptions = (option, index) => {
      const isSelected = availableValues
        ? option.label === this.props.selectedValue
        : option.state === 'selected';
      const isDisabled = availableValues
        ? !contains(option.label, availableValues)
        : option.state === 'disabled';
      return (
        <button
          key={`${option.label || option.id}`}
          data-test={`productThumbail${option.label}`}
          onClick={() => this.handleClick(option, index)}
        >
          {option.image ? (
            <figure
              styleName={classNames('thumbnailContainer', {
                clicked: isSelected || selected === index,
                disabled: isDisabled,
              })}
            >
              <ImageLoader
                fit
                src={convertSrc(option.image, 'medium')}
                loader={<BannerLoading />}
              />
            </figure>
          ) : (
            <div
              styleName={classNames('emptyImg', {
                clicked: isSelected || selected === index,
                disabled: isDisabled,
              })}
            >
              <Icon type="camera" size={40} />
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
