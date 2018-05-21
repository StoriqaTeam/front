// @flow

import React, { Component } from 'react';

import { isEmpty } from 'utils';

import { ProductThumbnails, ImageDetail } from './index';

import './ProductImage.scss';

import { WidgetOptionType, ThumbnailType } from './types';

type PropsType = {
  mainImage: string,
  discount: number,
  thumbnails: Array<ThumbnailType>,
};

type StateType = {
  selected: WidgetOptionType,
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
  handleClick = ({ image }: WidgetOptionType): void => {
    this.setState({ selected: image });
  };
  render() {
    const { mainImage, thumbnails, discount } = this.props;
    const { selected } = this.state;
    return (
      <div styleName="container">
        <div
          styleName={
            !isEmpty(thumbnails) ? 'thumbnailsWrapper' : 'noThumbnailsWrapper'
          }
        >
          {!isEmpty(thumbnails) ? (
            <ProductThumbnails
              isFirstSelected
              isReset={isEmpty(selected)}
              onClick={this.handleClick}
              options={thumbnails}
            />
          ) : null}
        </div>
        <div styleName="image">
          <figure styleName="bigImage">
            {(discount > 0) ? (
              <span styleName="discount">
                Price <br /> Off <br />
                <span
                  style={{
                    fontSize: 16,
                  }}
                >
                  { `${discount} %` }
                </span>
              </span>
            ) : null}
            <img src={!isEmpty(selected) ? selected : mainImage} alt="" />
          </figure>
          <ImageDetail />
        </div>
      </div>
    );
  }
}

export default ProductImage;
