// @flow

import React, { PureComponent } from 'react';
import type { Node } from 'react';
import { propOr, prop } from 'ramda';

import { verifyItemCurrency } from 'utils';

import { Rating } from 'components/common/Rating';

import type { CountryType } from 'types';
import type {
  WidgetType,
  DeliveryAddress,
  DeliveryDataType,
  ProductVariantType,
} from '../types';

import {
  ProductContext,
  ProductMaterial,
  ProductPrice,
  ProductQuantity,
  ProductSize,
  ProductThumbnails,
  Delivery,
} from '../index';

import { sortByProp } from '../utils';

import './ProductDetails.scss';

type PropsType = {
  children: Node,
  onWidgetClick: Function,
  productDescription: string,
  productTitle: string,
  widgets: Array<WidgetType>,
  selectedAttributes: { [string]: string },
  availableAttributes: {
    [string]: Array<string>,
  },
  unselectedAttr: Array<string>,
  onChangeQuantity: (quantity: number) => void,
  cartQuantity: number,
  userAddress: ?DeliveryAddress,
  baseProductRawId: number,
  countries: Array<CountryType>,
  onChangeDeliveryData: (deliveryData: DeliveryDataType) => void,
  deliveryData: DeliveryDataType,
  productVariant: ProductVariantType,
};

class ProductDetails extends PureComponent<PropsType> {
  generateWidget = (widget: WidgetType, index: number): Node => {
    const { unselectedAttr, productVariant } = this.props;
    let WidgetComponent;
    switch (widget.uiElement) {
      case 'CHECKBOX':
        WidgetComponent = (
          <ProductSize
            key={index}
            id={widget.id}
            title={widget.title}
            options={widget.options}
            onClick={this.props.onWidgetClick}
            selectedValue={prop(widget.id, this.props.selectedAttributes)}
            availableValues={propOr(
              [],
              widget.id,
              this.props.availableAttributes,
            )}
            isOnSelected={
              (unselectedAttr && unselectedAttr.indexOf(widget.title) > -1) ||
              false
            }
          />
        );
        break;
      case 'COMBOBOX':
        WidgetComponent = (
          <ProductMaterial
            key={index}
            id={widget.id}
            title={widget.title || ''}
            options={widget.options}
            onSelect={this.props.onWidgetClick}
            selectedValue={prop(widget.id, this.props.selectedAttributes)}
            availableValues={propOr(
              [],
              widget.id,
              this.props.availableAttributes,
            )}
            isOnSelected={
              (unselectedAttr && unselectedAttr.indexOf(widget.title) > -1) ||
              false
            }
          />
        );
        break;
      case 'COLOR_PICKER':
        WidgetComponent = (
          <ProductThumbnails
            key={index}
            id={widget.id}
            title={widget.title}
            row
            srcProp="image"
            options={widget.options}
            onClick={(option: { label: string }) =>
              this.props.onWidgetClick({
                attributeId: widget.id,
                attributeValue: option.label,
              })
            }
            selectedValue={prop(widget.id, this.props.selectedAttributes)}
            availableValues={propOr(
              [],
              widget.id,
              this.props.availableAttributes,
            )}
            isOnSelected={
              (unselectedAttr && unselectedAttr.indexOf(widget.title) > -1) ||
              false
            }
            productVariant={productVariant}
          />
        );
        break;
      default:
        return null;
    }
    return WidgetComponent;
  };

  render() {
    const {
      productTitle,
      productDescription,
      widgets,
      children,
      onChangeQuantity,
      cartQuantity,
      userAddress,
      baseProductRawId,
      countries,
      onChangeDeliveryData,
      deliveryData,
    } = this.props;
    return (
      <ProductContext.Consumer>
        {({ productVariant, rating }) => {
          const verifiedVariant = verifyItemCurrency(productVariant);
          return (
            <div styleName="container">
              <h2>{productTitle}</h2>
              <div styleName="rating">
                <Rating value={rating} />
              </div>
              <ProductPrice {...verifiedVariant} />
              <p styleName="productDescription">{productDescription}</p>
              <Delivery
                currency={verifiedVariant.currency}
                userAddress={userAddress}
                baseProductRawId={baseProductRawId}
                countries={countries}
                onChangeDeliveryData={onChangeDeliveryData}
                deliveryData={deliveryData}
              />
              <div styleName="widgets">
                {sortByProp('id')(widgets).map(this.generateWidget)}
              </div>
              <ProductQuantity
                quantity={productVariant.quantity}
                preOrder={productVariant.preOrder}
                preOrderDays={productVariant.preOrderDays}
                onChangeQuantity={onChangeQuantity}
                cartQuantity={cartQuantity}
              />
              {children}
            </div>
          );
        }}
      </ProductContext.Consumer>
    );
  }
}

export default ProductDetails;
