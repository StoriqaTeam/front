// @flow

import * as React from 'react';

import { WidgetsType, WidgetType } from './types';

import { ProductSize, ProductMaterial, ProductThumbnails } from './index';

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

  handleWidgetClick = (selected: WidgetType) => {

  };

  generateWidget = (widget: WidgetType, index: number) => {
    let WidgetComponent;
    switch(widget.uiElement) {
      case 'CHECKBOX':
        WidgetComponent = (
          <ProductSize
            key={index}
            title={widget.title}
            sizes={widget.options}
            onClick={selected => this.handleWidgetClick(selected)}
          />
        );
        break;
      case 'COMBOBOX':
        WidgetComponent = (
          <ProductMaterial
            key={index}
            title={widget.title || ''}
            materials={widget.options}
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
            thumbnails={widget.options}
            onClick={selected => this.handleWidgetClick(selected)}
          />
        );
        break;
      default:
        return null
    }
    return (WidgetComponent);
  };
  render() {
    const { resetCHECKBOX, resetCOMBOBOX, resetCOLOR_PICKER } = this.state;
    const {
      productTitle,
      productDescription,
      widgets,
      children,
    } = this.props;
    return (
      <div styleName="container">
        <h2>{productTitle}</h2>
        {children}
        <p>{productDescription}</p>
        {widgets.map(this.generateWidget)}
      </div>
    );
  }
}

export default ProductDetails;
