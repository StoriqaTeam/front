// @flow

import React, { Component } from 'react';

import { isEmpty } from 'utils';

import { ProductThumbnails, ImageDetail } from './index';

import './ProductImage.scss';

import { SelectedType } from './types';

type PropsType = {
  mainImage: string,
  thumbnails: Array<{ img: string, alt: string, label?: string }>,
};

type StateType = {
  selectedImage: SelectedType,
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
    const { selectedImage } = prevState;
    if (!isEmpty(selectedImage)) {
      return {
        selectedImage: {},
      };
    }
    return prevState;
  }
  state = {
    selectedImage: {},
  };
  /**
   * Sets the clicked image as the big one.
   * @param {SelectedType} selected
   * @param {string} selected.img
   * @return {void}
   */
  handleClick = ({ img }: SelectedType): void => {
    this.setState({ selectedImage: img });
  };
  render() {
    const { mainImage, thumbnails } = this.props;
    const { selectedImage } = this.state;
    return (
      <div styleName="container">
        <div styleName="thumbnailsWrapper">
          {!isEmpty(thumbnails) ? (
            <ProductThumbnails
              isFirstSelected
              isReset={isEmpty(selectedImage)}
              onClick={this.handleClick}
              thumbnails={thumbnails}
            />
          ) : null}
        </div>
        <div styleName="image">
          <figure styleName="bigImage">
            <img
              src={!isEmpty(selectedImage) ? selectedImage : mainImage}
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
