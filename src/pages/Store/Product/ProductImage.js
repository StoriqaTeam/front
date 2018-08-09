// @flow

import React, { Component } from 'react';
import { equals } from 'ramda';

import { isEmpty } from 'utils';

import { ProductThumbnails, ProductDiscount } from './index';

import { getImageMeta } from './utils';

import './ProductImage.scss';

import type { WidgetOptionType } from './types';

type PropsType = {
  mainImage: string,
  discount: number,
  thumbnails: Array<WidgetOptionType>,
};

type StateType = {
  selected: string,
  isSquared: boolean,
};

class ProductImage extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(
    nextProps: PropsType,
    prevState: StateType,
  ): StateType | null {
    const { selected } = prevState;
    if (!isEmpty(selected)) {
      return {
        ...prevState,
        selected: '',
      };
    }
    return null;
  }
  state = {
    selected: '',
    isSquared: false,
  };

  componentDidMount() {
    const { mainImage } = this.props;
    this.setImage(mainImage);
  }
  componentDidUpdate(prevProps: PropsType, prevState: StateType) {
    const { selected } = prevState;
    if (selected !== this.state.selected) {
      this.setImage(selected);
    }
  }
  setImage = async (selected: string): Promise<any> => {
    const { height, width } = await getImageMeta(selected);
    this.setState({ isSquared: equals(height, width) });
  };
  handleClick = ({ image }: WidgetOptionType): void => {
    this.setState({ selected: image }, () => {
      this.setImage(image);
    });
  };
  render() {
    const { mainImage, thumbnails, discount } = this.props;
    const { selected, isSquared } = this.state;
    return (
      <div styleName="container">
        <div styleName="thumbnails">
          <div
            styleName={
              !isEmpty(thumbnails) ? 'thumbnailsWrapper' : 'noThumbnailsWrapper'
            }
          >
            {!isEmpty(thumbnails) ? (
              <div styleName="thumbnailsContent">
                <ProductThumbnails
                  isFirstSelected
                  isReset={isEmpty(selected)}
                  onClick={this.handleClick}
                  options={thumbnails}
                />
              </div>
            ) : null}
          </div>
        </div>
        <div styleName="imageWrapper">
          <figure styleName="image">
            {!isSquared ? (
              <img src={selected || mainImage} alt="" styleName="imageBlur" />
            ) : null}
            {discount > 0 ? <ProductDiscount discount={discount} /> : null}
            <div
              role="img"
              style={{
                backgroundImage: `url(${
                  !isEmpty(selected) ? selected : mainImage
                })`,
                backgroundSize: 'contain',
                backgroundPosition: `${isSquared ? 'center top' : 'center'}`,
                backgroundRepeat: 'no-repeat',
                height: '100%',
                width: '100%',
              }}
            />
          </figure>
        </div>
      </div>
    );
  }
}

export default ProductImage;
