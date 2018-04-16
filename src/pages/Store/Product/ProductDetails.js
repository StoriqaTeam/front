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
  variantSelected: number,
}

class ProductDetails extends PureComponent<{}, StateType> {
  state = {
    selected: null,
    variantSelected: 0,
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
      variantSelected,
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
          const productVariants = buildWidgets(variants);
          /* eslint-disable no-console */
          console.log('productVariants', productVariants);
          const {
            CHECKBOX,
            COLOR_PICKER,
            COMBOBOX,
          } = productVariants[variantSelected];
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
                title={CHECKBOX.title}
                sizes={CHECKBOX.values}
              />
              <ProductMaterial
                title={COMBOBOX.title}
                selected={selected || COMBOBOX.values[0]}
                materials={COMBOBOX.values}
                onSelect={this.handleSelected}
              />
              <ProductThumbnails
                title={COLOR_PICKER.title}
                row
                srcProp="img"
                thumbnails={COLOR_PICKER.values}
              />
            </div>
          );
        }}
      </ProductContext.Consumer>
    );
  }
}

export default ProductDetails;
