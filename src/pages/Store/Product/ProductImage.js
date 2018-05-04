// @flow

import React, { Component } from 'react';

import { isEmpty } from 'utils';

import { ProductThumbnails, ImageDetail } from './index';

import './ProductImage.scss';

import { SelectedType, ThumbnailType } from './types';

type PropsType = {
  mainImage: string,
  thumbnails: Array<ThumbnailType>,
};

type StateType = {
  selected: SelectedType,
};

class ProductImage extends Component<PropsType, StateType> {
  /**
   * @static
   * @param {PropsType} nextProps
   * @param {StateType} prevState
   * @return {StateType | null}
   */
  static getDerivedStateFromProps(
    nextProps: PropsType,
    prevState: StateType,
  ): StateType | null {
    const { selected } = prevState;
    if (!isEmpty(selected)) {
      return {
        selected: {},
      };
    }
    return prevState;
  }
  state = {
    selected: {},
  };
  /**
   * Sets the clicked image as the big one.
   * @param {SelectedType} selected
   * @param {string} selected.img
   * @return {void}
   */
  handleClick = ({ img }: SelectedType): void => {
    this.setState({ selected: img });
  };
  render() {
    const { mainImage, thumbnails } = this.props;
    const { selected } = this.state;
    return (
      <div styleName="container">
        <div styleName={!isEmpty(thumbnails) ? 'thumbnailsWrapper' : 'noThumbnailsWrapper'}>
          {!isEmpty(thumbnails) ? (
            <ProductThumbnails
              isFirstSelected
              isReset={isEmpty(selected)}
              onClick={this.handleClick}
              thumbnails={thumbnails}
            />
          ) : null}
        </div>
        <div styleName="image">
          <figure styleName="bigImage">
            <img
              src={!isEmpty(selected) ? selected : mainImage}
              alt=""
            />
          </figure>
          <ImageDetail />
        </div>
      </div>
    );
  }
}

export default ProductImage;
