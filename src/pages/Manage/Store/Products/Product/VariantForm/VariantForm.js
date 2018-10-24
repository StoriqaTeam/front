// @flow strict

import React, { Component } from 'react';

import { Input, Button, InputPrice } from 'components/common';

import type { SelectItemType } from 'types';

import Characteristics from '../Characteristics/Characteristics';
import Photos from '../Photos/Photos';
import Warehouses from '../Warehouses/Warehouses';

import './VariantForm.scss';
import {append, assocPath, isEmpty, isNil, omit, reject} from "ramda";

type FormErrorsType = {
  vendorCode?: Array<string>,
  price?: Array<string>,
  attributes?: Array<string>,
};

type AttributeValueType = {
  attrId: number,
  value: string,
  metaField?: ?string,
};

type StateType = {
  vendorCode: ?string,
  price: ?number,
  cashback: ?number,
  discount: ?number,
  photoMain: ?string,
  photos: Array<string>,
  attributeValues: Array<AttributeValueType>,
  formErrors: FormErrorsType,
  isLoading: boolean,
  preOrderDays: string,
  preOrder: boolean,
};

type PropsType = {
  variant: any,
  cancelNewVariant: () => void,
  currency: SelectItemType,
  customAttributes: any,
};

class VariantForm extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      vendorCode: null,
      price: null,
      cashback: null,
      discount: null,
      photoMain: null,
      photos: [],
      attributeValues: [],
      formErrors: {},
      isLoading: false,
      preOrderDays: '',
      preOrder: false,
    };
  }

  handleAddMainPhoto = (url: string) => {
    this.setState({ photoMain: url });
  };

  handleAddPhoto = (url: string) => {
    this.setState((prevState: StateType) => ({
      photos: append(url, prevState.photos || []),
    }));
  };

  handleRemovePhoto = (url: string) => {
    const { photoMain, photos } = this.state;
    if (url === photoMain) {
      this.setState({ photoMain: null });
      return;
    }
    // $FlowIgnoreMe
    this.setState({ photos: reject(n => url === n, photos) });
  };

  handleVendorCodeChange = (e: SyntheticInputEvent<>) => {
    this.setState({ vendorCode: e.target.value });
  };

  handlePriceChange = (value: number) => {
    this.setState({ price: value });
  };

  handlePercentChange = (id: string) => (e: SyntheticInputEvent<>) => {
    const {
      target: { value },
    } = e;
    if (value === '') {
      this.setState({ [id]: null });
      return;
    } else if (value === 0) {
      this.setState({ [id]: 0 });
      return;
    } else if (parseFloat(value) > 100) {
      this.setState({ [id]: 99 });
      return;
    } else if (Number.isNaN(parseFloat(value))) {
      return;
    }
    this.setState({ [id]: parseFloat(value) });
  };

  render() {
    const { cancelNewVariant, currency, customAttributes } = this.props;
    const {
      photos,
      photoMain,
      vendorCode,
      price,
      formErrors,
      cashback,
      discount,
      attributeValues,
    } = this.state;
    console.log('---this.state', this.state);
    //
    return (
      <div styleName="container">
        <div styleName="title">
          <strong>Product photos</strong>
        </div>
        <div styleName="photos">
          <Photos
            photos={photos}
            photoMain={photoMain}
            onAddMainPhoto={this.handleAddMainPhoto}
            onAddPhoto={this.handleAddPhoto}
            onRemovePhoto={this.handleRemovePhoto}
          />
        </div>
        <div styleName="title">
          <strong>General settings</strong>
        </div>
        <div styleName="formItem">
          <Input
            fullWidth
            label={
              <span>
                Vendor code <span styleName="asterisk">*</span>
              </span>
            }
            value={vendorCode || ''}
            onChange={this.handleVendorCodeChange}
            errors={formErrors && formErrors.vendorCode}
            dataTest="variantVendorcodeInput"
          />
        </div>
        <div styleName="title">
          <strong>Pricing</strong>
        </div>
        <div styleName="formItem">
          <InputPrice
            required
            label="Price"
            onChangePrice={this.handlePriceChange}
            price={parseFloat(price) || 0}
            currency={currency}
            errors={formErrors && formErrors.price}
            dataTest="variantPriceInput"
          />
        </div>
        <div styleName="formItem">
          <Input
            fullWidth
            label="Cashback"
            onChange={this.handlePercentChange('cashback')}
            value={!isNil(cashback) ? `${cashback}` : ''}
            dataTest="variantCashbackInput"
          />
          <span styleName="inputPostfix">Percent</span>
        </div>
        <div styleName="formItem">
          <Input
            fullWidth
            label="Discount"
            onChange={this.handlePercentChange('discount')}
            value={!isNil(discount) ? `${discount}` : ''}
            dataTest="variantDiscountInput"
          />
          <span styleName="inputPostfix">Percent</span>
        </div>
        {!isEmpty(customAttributes) &&
          <div styleName="formItem">
            <Characteristics
              customAttributes={customAttributes}
              values={attributeValues || []}
              onChange={this.handleChangeValues}
              errors={(formErrors && formErrors.attributes) || null}
            />
          </div>
        }
        <div styleName="buttons">
          <div styleName="saveButton">
            <Button
              big
              fullWidth
              onClick={() => {}}
              dataTest="saveVariantButton"
            >
              Save
            </Button>
          </div>
          <div styleName="cancelButton">
            <Button
              big
              fullWidth
              wireframe
              onClick={cancelNewVariant}
              dataTest="cancelVariantButton"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default VariantForm;
