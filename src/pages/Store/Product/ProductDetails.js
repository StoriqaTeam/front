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
  resetCHECKBOX: boolean,
  resetCOMBOBOX: boolean,
  resetCOLOR_PICKER: boolean,
}

class ProductDetails extends PureComponent<PropsType, StateType> {
  state = {
    selected: null,
    resetCHECKBOX: false,
    resetCOMBOBOX: false,
    resetCOLOR_PICKER: false,
  };
  /**
   * @param {string} uiElement
   * @return {Object}
   */
  resetOthers = (uiElement: string): Object => ({
    resetCHECKBOX: uiElement !== 'CHECKBOX',
    resetCOMBOBOX: uiElement !== 'COMBOBOX',
    resetCOLOR_PICKER: uiElement !== 'COLOR_PICKER',
  });
  /**
   * @param {WidgetValueType} selected
   * @param {Object} widget
   * @param {string} widget.uiElement
   * @return {void}
   */
  handleWidget = (selected: WidgetValueType, { uiElement }): void => {
    const { onWidgetClick } = this.props;
    if (uiElement === 'COMBOBOX') {
      this.setState({
        selected,
      });
    }
    this.setState({
      ...this.resetOthers(uiElement),
    });
    onWidgetClick(selected);
  };
  render() {
    const {
      selected,
      resetCHECKBOX,
      resetCOMBOBOX,
      resetCOLOR_PICKER,
    } = this.state;
    const {
      productTitle,
      productDescription,
      widgets: {
        CHECKBOX,
        COMBOBOX,
        COLOR_PICKER,
      },
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
          isReset={resetCHECKBOX}
          title={CHECKBOX.title}
          sizes={CHECKBOX.values}
          onClick={widget => this.handleWidget(widget, CHECKBOX)}
        />
        <ProductMaterial
          title={COMBOBOX.title}
          selected={selected || COMBOBOX.values[0]}
          materials={COMBOBOX.values}
          onSelect={widget => this.handleWidget(widget, COMBOBOX)}
        />
        {/* eslint-disable camelcase */}
        <ProductThumbnails
          isReset={resetCOLOR_PICKER}
          title={COLOR_PICKER.title}
          row
          srcProp="image"
          thumbnails={COLOR_PICKER.values}
          onClick={widget => this.handleWidget(widget, COLOR_PICKER)}
        />
      </div>
    );
  }
}

export default ProductDetails;
