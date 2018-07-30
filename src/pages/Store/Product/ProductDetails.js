// @flow

import * as React from 'react';

import { Rating } from 'components/common/Rating';

import type { WidgetType, WidgetOptionType } from './types';

import {
  ProductContext,
  ProductMaterial,
  ProductPrice,
  ProductQuantity,
  ProductSize,
  ProductThumbnails,
} from './index';

import { sortByProp } from './utils';

import './ProductDetails.scss';

type PropsType = {
  widgets: Array<WidgetType>,
  productTitle: string,
  productDescription: string,
  onWidgetClick: Function,
  children: React.Node,
};

class ProductDetails extends React.Component<PropsType, {}> {
  handleWidgetClick = (selected: WidgetOptionType): void => {
    const { onWidgetClick } = this.props;
    onWidgetClick(selected);
  };

  generateWidget = (widget: WidgetType, index: number): React.Node => {
    let WidgetComponent;
    switch (widget.uiElement) {
      case 'CHECKBOX':
        WidgetComponent = (
          <ProductSize
            key={index}
            title={widget.title}
            options={widget.options}
            onClick={selected => this.handleWidgetClick(selected)}
          />
        );
        break;
      case 'COMBOBOX':
        WidgetComponent = (
          <ProductMaterial
            key={index}
            title={widget.title || ''}
            options={widget.options}
            onSelect={selected => this.handleWidgetClick(selected)}
          />
        );
        break;
      case 'COLOR_PICKER':
        WidgetComponent = (
          <ProductThumbnails
            key={index}
            title={widget.title}
            row
            srcProp="image"
            options={widget.options}
            onClick={selected => this.handleWidgetClick(selected)}
          />
        );
        break;
      default:
        return null;
    }
    return WidgetComponent;
  };
  render() {
    const { productTitle, productDescription, widgets, children } = this.props;
    return (
      <ProductContext.Consumer>
        {({ productVariant, rating }) => (
          <div styleName="container">
            <h2>{productTitle}</h2>
            <div styleName="rating">
              <Rating value={rating} />
            </div>
            <ProductPrice
              price={productVariant.price}
              lastPrice={productVariant.lastPrice}
              cashback={productVariant.cashback}
            />
            <p>{productDescription}</p>
            {sortByProp('id')(widgets).map(this.generateWidget)}
            <ProductQuantity />
            { children }
          </div>
        )}
      </ProductContext.Consumer>
    );
  }
}

export default ProductDetails;
