// @flow

import React, {PureComponent} from 'react';

import {extractText, buildWidgets, filterVariants} from 'utils';

import {
  ProductPrice,
  ProductSize,
  ProductMaterial,
  ProductThumbnails,
} from './index';

import './ProductDetails.scss';

type WidgetValueType = {
  id: string,
  label: string,
  img?: string,
}

type PropsType = {
  widgets: {},
  productTitle: string,
  productDescription: string
}

type StateType = {
  sizes: string | number[],
  selected: WidgetValueType,
  thumbnails?: { id: string | number, img: string, alt: string }[],
  variantSelected: number,
}

class ProductDetails extends PureComponent<PropsType, StateType> {
  state = {
    selected: null,
    variantSelected: 0,
  };
  /**
   * @param {WidgetValueType} selected
   * @param {[]} productVariants
   * @param {string} variantId
   * @return {void}
   */
  handleSelected = (selected: WidgetValueType, productVariants, variantId: string): void => {
    this.filter(productVariants, selected, variantId);
    this.setState({
      selected,
    });
  };
  /**
   * @param {WidgetValueType} selected
   * @param {[]} productVariants
   * @param {string} variantId
   * @return {void}
   */
  handleColor = (selected: WidgetValueType, productVariants, variantId: string): void => {
    this.filter(productVariants, selected, variantId);
  };
  /**
   * @param selected
   * @param productVariants
   * @param variantId
   */
  handleSize = (selected: WidgetValueType, productVariants, variantId: string): void => {
    this.filter(productVariants, selected, variantId);
  };

  render() {
    const {
      selected,
      variantSelected,
    } = this.state;
    const {
      productTitle,
      productDescription,
      widgets,
    } = this.props;
    const widgetsKey = Object.keys(widgets)[0];
    return (
      <div styleName="container">
        <h2>{productTitle}</h2>
        <ProductPrice
          lastPrice="0.000290"
          currentPrice="0.000123"
          percentage="12"
        />
        <p>
          {productDescription}
        </p>
        <ProductSize
          title={widgets.CHECKBOX.title}
          sizes={widgets.CHECKBOX.values}
          onClick={val => this.handleSize(val)}
        />
        <ProductMaterial
          title={widgets.COMBOBOX.title}
          selected={selected || widgets.COMBOBOX.values[0]}
          materials={widgets[widgetsKey].values}
          onSelect={val => this.handleSelected(val)}
        />
        <ProductThumbnails
          title={widgets.COLOR_PICKER.title}
          row
          srcProp="image"
          thumbnails={widgets.COLOR_PICKER.values}
          onClick={val => this.handleColor(val)}
        />
      </div>
    );
  }
}

export default ProductDetails;
