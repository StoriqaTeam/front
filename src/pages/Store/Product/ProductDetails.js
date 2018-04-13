// @flow

import React, { PureComponent } from 'react';

import { extractText, buildWidgets } from 'utils';

import {
  ProductContext,
  ProductPrice,
  ProductSize,
  ProductMaterial,
  ProductThumbnails,
} from './index';

import './ProductDetails.scss';

type MaterialType = {id: string | number, label: string}

type StateType = {
  sizes: string | number[],
  selected: MaterialType,
  thumbnails?: {id: string | number, img: string, alt: string}[],
}

class ProductDetails extends PureComponent<{}, StateType> {
  state = {
    selected: null,
  };
  /**
   * @param {MaterialType} selected
   * @return {void}
   */
  handleSelected = (selected: MaterialType): void => {
    this.setState({ selected });
  };
  render() {
    const {
      selected,
    } = this.state;
    return (
      <ProductContext.Consumer>
        {(context) => {
          const {
            baseProduct: {
              name,
              longDescription,
            },
            variants,
          } = context;
          const {
            Size,
            Material,
            Colour,
          } = buildWidgets(variants);
          return (
            <div styleName="container">
              <h2>{ extractText(name) }</h2>
              <ProductPrice
                lastPrice="0.000290"
                currentPrice="0.000123"
                percentage="12"
              />
              <p>
                { extractText(longDescription, 'EN', 'Нет описания') }
              </p>
              <ProductSize
                title={Size[0].title}
                sizes={Size[0].values}
              />
              <ProductMaterial
                title={Material[0].title}
                selected={selected || Material[0].values[0]}
                materials={Material[0].values}
                onSelect={this.handleSelected}
              />
              <ProductThumbnails
                title={Colour[0].title}
                row
                srcProp="img"
                thumbnails={Colour[0].values}
              />
            </div>
          );
        }}
      </ProductContext.Consumer>
    );
  }
}

export default ProductDetails;
