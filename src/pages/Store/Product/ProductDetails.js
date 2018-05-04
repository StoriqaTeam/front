// @flow

import * as React from 'react';

import { isNil } from 'ramda';

import { WidgetsType } from './types';

import {
  ProductSize,
  ProductMaterial,
  ProductThumbnails,
} from './index';

import './ProductDetails.scss';

type WidgetValueType = {
  id: string,
  label: string,
  img?: string,
};

type PropsType = {
  widgets: WidgetsType,
  productTitle: string,
  productDescription: string,
  onWidgetClick: Function,
  children: React.Node,
};

type StateType = {
  resetCHECKBOX: boolean,
  resetCOMBOBOX: boolean,
  resetCOLOR_PICKER: boolean,
};

class ProductDetails extends React.Component<PropsType, StateType> {
  state = {
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
  handleWidget = (
    selected: WidgetValueType,
    { uiElement }: WidgetsType,
  ): void => {
    const { onWidgetClick } = this.props;
    this.setState(
      {
        ...this.resetOthers(uiElement),
      },
      () => onWidgetClick(selected),
    );
  };
  render() {
    const { resetCHECKBOX, resetCOMBOBOX, resetCOLOR_PICKER } = this.state;
    const {
      productTitle,
      productDescription,
      widgets: { CHECKBOX, COMBOBOX, COLOR_PICKER },
      children,
    } = this.props;
    return (
      <div styleName="container">
        <h2>{productTitle}</h2>
        {children}
        <p>{productDescription}</p>
        {/* eslint-disable camelcase */}
        {!isNil(CHECKBOX) ? (
          <ProductSize
            isReset={resetCHECKBOX}
            title={CHECKBOX.title}
            sizes={CHECKBOX.values}
            onClick={widget => this.handleWidget(widget, CHECKBOX)}
          />
        ) : null}
        {!isNil(COMBOBOX) ? (
          <ProductMaterial
            isReset={resetCOMBOBOX}
            title={COMBOBOX.title || ''}
            materials={COMBOBOX.values}
            onSelect={widget => this.handleWidget(widget, COMBOBOX)}
          />
        ) : null}
        {!isNil(COLOR_PICKER) ? (
          <ProductThumbnails
            isReset={resetCOLOR_PICKER}
            title={COLOR_PICKER.title}
            row
            srcProp="image"
            thumbnails={COLOR_PICKER.values}
            onClick={widget => this.handleWidget(widget, COLOR_PICKER)}
          />
        ) : null}
      </div>
    );
  }
}

export default ProductDetails;
