// @flow

import React, { Component } from 'react';
import { equals, prepend, isNil } from 'ramda';

import { isEmpty } from 'utils';

import { Slider } from 'components/Slider';

import { ProductThumbnails, ProductDiscount } from './index';

import { getImageMeta, makeAdditionalPhotos } from './utils';

import './ProductImage.scss';

import type { WidgetOptionType } from './types';

type PropsType = {
  rawId: number,
  photoMain: string,
  discount: number,
  additionalPhotos: Array<string>,
  isCartAdded: boolean,
};

type StateType = {
  selected: string,
  isSquared: boolean,
};

class ProductImage extends Component<PropsType, StateType> {
  state = {
    selected: '',
    isSquared: false,
  };
  componentDidMount() {
    const { photoMain } = this.props;
    this.setImage(photoMain);
  }
  componentDidUpdate(prevProps: PropsType, prevState: StateType) {
    const { rawId } = this.props;
    const { selected } = prevState;
    if (selected !== this.state.selected) {
      this.setImage(selected);
    }
    if (rawId !== prevProps.rawId) {
      this.clearSelected();
    }
  }
  setImage = async (selected: string): Promise<any> => {
    const { height, width } = await getImageMeta(selected);
    this.setState({ isSquared: equals(height, width) });
  };
  clearSelected = (): void => {
    this.setState({
      selected: '',
    });
  };
  handleClick = ({ image }: WidgetOptionType): void => {
    this.setState({ selected: image }, () => {
      this.setImage(image);
    });
  };
  imgsToSlider = (imgs: Array<string>): Array<{ id: string, img: string }> =>
    imgs.map(img => ({ id: img, img }));
  render() {
    const { photoMain, additionalPhotos, discount } = this.props;
    const { selected, isSquared } = this.state;
    return (
      <div styleName="container">
        <div styleName="thumbnails">
          <div
            styleName={
              !isEmpty(additionalPhotos)
                ? 'thumbnailsWrapper'
                : 'noThumbnailsWrapper'
            }
          >
            {!isEmpty(additionalPhotos) ? (
              <div styleName="thumbnailsContent">
                <ProductThumbnails
                  isFirstSelected
                  isReset={isEmpty(selected)}
                  onClick={this.handleClick}
                  options={makeAdditionalPhotos(
                    prepend(photoMain, additionalPhotos || []),
                  )}
                />
              </div>
            ) : null}
          </div>
        </div>
        <div styleName="imageWrapper">
          <figure styleName="image">
            {!isSquared ? (
              <img src={selected || photoMain} alt="" styleName="imageBlur" />
            ) : null}
            {discount > 0 ? <ProductDiscount discount={discount} /> : null}
            <div
              role="img"
              style={{
                backgroundImage: `url(${
                  !isEmpty(selected) ? selected : photoMain
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
        <div styleName="imageSlider">
          {!isNil(additionalPhotos) ? (
            <Slider
              dots
              infinity
              animationSpeed={500}
              autoplaySpeed={10000}
              items={this.imgsToSlider(additionalPhotos)}
              type="image"
              slidesToShow={1}
              arrows
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default ProductImage;
