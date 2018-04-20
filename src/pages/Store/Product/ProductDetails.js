// @flow

import React, { PureComponent } from 'react';

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
  productDescription: string,
  onWidgetClick: Function,
}

type StateType = {
  selected: WidgetValueType,
}

class ProductDetails extends PureComponent<PropsType, StateType> {
  state = {
    selected: null,
  };
  /**
   * @param {WidgetValueType} selected
   * @param {string} title
   * @return {void}
   */
  handleWidget = (selected: WidgetValueType, title): void => {
    const { onWidgetClick } = this.props;
    if (title === 'Material') {
      this.setState({
        selected,
      });
    }
    onWidgetClick(selected);
  };
  render() {
    const {
      selected,
    } = this.state;
    const {
      productTitle,
      productDescription,
      widgets,
    } = this.props;
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
          onClick={val => this.handleWidget(val, widgets.CHECKBOX.title)}
        />
        <ProductMaterial
          title={widgets.COMBOBOX.title}
          selected={selected || widgets.COMBOBOX.values[0]}
          materials={widgets.COMBOBOX.values}
          onSelect={val => this.handleWidget(val, widgets.COMBOBOX.title)}
        />
        <ProductThumbnails
          title={widgets.COLOR_PICKER.title}
          row
          srcProp="image"
          thumbnails={widgets.COLOR_PICKER.valuesWithImages}
          onClick={val => this.handleWidget(val, widgets.COLOR_PICKER.title)}
        />
      </div>
    );
  }
}

export default ProductDetails;
