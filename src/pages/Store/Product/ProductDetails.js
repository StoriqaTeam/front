// @flow

import React, { PureComponent } from 'react';

import { extractText, buildWidgets, filterVariants } from 'utils';

import {
  ProductPrice,
  ProductSize,
  ProductMaterial,
  ProductThumbnails,
} from './index';

import './ProductDetails.scss';

type MaterialType = {id: string | number, label: string}

type PropsType = {
  baseProduct: any,
}

type StateType = {
  sizes: string | number[],
  selected: MaterialType,
  thumbnails?: {id: string | number, img: string, alt: string}[],
  variantSelected: number,
}

class ProductDetails extends PureComponent<PropsType, StateType> {
  state = {
    selected: null,
    variantSelected: 0,
  };
  /**
   * @param {MaterialType} selected
   * @param {[]} productVariants
   * @param {string} variantId
   * @return {void}
   */
  handleSelected = (selected: MaterialType, productVariants, variantId: string): void => {
    this.filter(productVariants, selected, variantId);
    this.setState({
      selected,
    });
  };
  /**
   * @param selected
   * @param productVariants
   * @param variantId
   */
  handleSize = (selected: MaterialType, productVariants, variantId: string): void => {
    this.filter(productVariants, selected, variantId);
  };
  /**
   * @param variants
   * @param selected
   * @param variantId
   */
  filter = (variants, selected, variantId): number => {
    /* eslint-disable no-console */
    console.log('filterVariants(variants, selected, variantId)', filterVariants(variants, selected, variantId));
    return filterVariants(variants, selected, variantId);
  };
  render() {
    const {
      selected,
      variantSelected,
    } = this.state;
    const {
      baseProduct: {
        name,
        longDescription,
        variants: {
          all,
        },
      },
    } = this.props;
    const productVariants = buildWidgets(all);
    /* eslint-disable no-console */
    console.log('productVariants', productVariants);
    const {
      CHECKBOX,
      COLOR_PICKER,
      COMBOBOX,
      variantId,
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
          onClick={val => this.handleSize(val, productVariants, variantId)}
        />
        <ProductMaterial
          title={COMBOBOX.title}
          selected={selected || COMBOBOX.values[0]}
          materials={COMBOBOX.values}
          onSelect={val => this.handleSelected(val, productVariants, variantId)}
        />
        <ProductThumbnails
          title={COLOR_PICKER.title}
          row
          srcProp="img"
          thumbnails={COLOR_PICKER.values}
        />
      </div>
    );
  }
}

export default ProductDetails;
