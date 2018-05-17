// @flow

import * as React from 'react';

import { WidgetsType, WidgetType, WidgetOptionType } from './types';

import { ProductSize, ProductMaterial, ProductThumbnails } from './index';

import { sortByProp } from './utils';

import './ProductDetails.scss';

type PropsType = {
  widgets: WidgetsType,
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
        return null;
    }
    return WidgetComponent;
  };
  render() {
    const { productTitle, productDescription, widgets, children } = this.props;
    return (
      <div styleName="container">
        <h2>{productTitle}</h2>
        {children}
        <p>{productDescription}</p>
        {sortByProp('id')(widgets).map(this.generateWidget)}
      </div>
    );
  }
}

export default ProductDetails;
