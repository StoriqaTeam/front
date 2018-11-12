// @flow

import React, { Component } from 'react';
import { prepend, isNil } from 'ramda';
import classNames from 'classnames';
import { isEmpty, convertSrc } from 'utils';

import { Slider } from 'components/Slider';
import { Icon } from 'components/Icon';
import { ImageZoom } from 'components/ImageZoom';
import BannerLoading from 'components/Banner/BannerLoading';
import ImageLoader from 'libs/react-image-loader';

import { ProductThumbnails, ProductDiscount } from './index';

import { makeAdditionalPhotos } from './utils';

import './ProductImage.scss';

import type { WidgetOptionType } from './types';

type PropsType = {
  rawId: number,
  photoMain: ?string,
  discount: number,
  additionalPhotos: Array<string>,
  isCartAdded: boolean,
};

type StateType = {
  selected: string,
};

class ProductImage extends Component<PropsType, StateType> {
  state = {
    selected: '',
  };

  componentDidUpdate(prevProps: PropsType) {
    const { rawId } = this.props;
    if (rawId !== prevProps.rawId) {
      this.clearSelected();
    }
  }

  clearSelected = (): void => {
    this.setState({
      selected: '',
    });
  };

  handleClick = ({ image }: WidgetOptionType): void => {
    this.setState({ selected: image });
  };

  imgsToSlider = (imgs: Array<string>): Array<{ id: string, img: string }> =>
    imgs.map(img => ({ id: img, img }));

  render() {
    const { photoMain, additionalPhotos, discount } = this.props;
    const { selected } = this.state;
    const showMobileSlider = !isNil(additionalPhotos) && !isNil(photoMain);
    return (
      <div styleName="container">
        {discount > 0 ? <ProductDiscount discount={discount} /> : null}
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
                  prepend(photoMain || '', additionalPhotos || []),
                )}
              />
            </div>
          ) : null}
        </div>
        <div
          styleName={classNames('imageWrapper', {
            hasMobileSlider: showMobileSlider,
          })}
        >
          <div styleName="imageContainer">
            {photoMain || selected ? (
              <ImageZoom>
                {({ onMouseMove, backgroundPosition, backgroundImage }) => (
                  <figure
                    styleName="image"
                    style={{
                      backgroundPosition,
                      backgroundImage,
                      transition: 'opacity 0.3s ease-out',
                      backgroundSize: '220%',
                    }}
                  >
                    <ImageLoader
                      fit
                      src={
                        !isEmpty(selected)
                          ? convertSrc(selected, 'large')
                          : convertSrc(photoMain, 'large')
                      }
                      loader={
                        <div styleName="loader">
                          <BannerLoading />
                        </div>
                      }
                      onMouseMove={onMouseMove}
                      onFocus={() => {}}
                    />
                  </figure>
                )}
              </ImageZoom>
            ) : (
              <div styleName="noImage">
                <Icon type="camera" size={80} />
              </div>
            )}
          </div>
        </div>
        {showMobileSlider ? (
          <div styleName="imageSlider">
            <Slider
              infinity
              animationSpeed={500}
              slidesToShow={1}
              items={this.imgsToSlider(
                prepend(photoMain || '', additionalPhotos || []),
              )}
              type="image"
              arrows
              counter
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default ProductImage;
