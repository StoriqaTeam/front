// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { find, append, head, pathOr, map, isEmpty, omit, reject } from 'ramda';
import { validate } from '@storiqa/shared';

import { withShowAlert } from 'components/App/AlertContext';
import { Input } from 'components/common/Input';
import { Checkbox } from 'components/common/Checkbox';

import Characteristics from './Characteristics';
import Photos from './Photos';
import Warehouses from './Warehouses';

import './Form.scss';

type AttributeValueType = {
  attrId: number,
  value: string,
  metaField?: ?string,
};

type VariantType = ?{
  vendorCode?: ?string,
  price?: ?number,
  cashback?: ?number,
  mainPhoto?: ?string,
  photos?: Array<string>,
  attributeValues?: Array<AttributeValueType>,
  variantId: ?string,
};

type StateType = {
  vendorCode: ?string,
  price: ?number,
  cashback?: ?number,
  discount?: ?number,
  mainPhoto?: ?string,
  photos?: Array<string>,
  attributeValues?: Array<AttributeValueType>,
  formErrors: ?{
    vendorCode?: Array<string>,
    price?: Array<string>,
    attributes?: Array<string>,
  },
  isLoading: boolean,
  preOrderDays: string,
  preOrder: boolean,
  preOrderDays: string,
};

type PropsType = {
  category: {
    getAttributes: Array<{
      rawId: number,
    }>,
  },
  variant: ?{
    id: string,
    productRawId: string,
    vendorCode: string,
    price: number,
    cashback?: ?number,
    discount?: ?number,
    photoMain?: ?string,
    additionalPhotos?: Array<string>,
    stocks: {
      id: string,
      productId: number,
      warehouseId: string,
      quantity: number,
      warehouse: {
        name: string,
        addressFull: {
          value: string,
        },
      },
    },
    preOrder: boolean,
    preOrderDays: number,
  },
  onExpandClick: (id: string) => void,
  onChangeVariantForm: (variantData: ?VariantType) => void,
  formErrors: ?{
    vendorCode?: Array<string>,
    price?: Array<string>,
    attributes?: Array<string>,
  },
};

type ValueForAttributeInputType = {
  attr: any,
  variant: any,
};

class Form extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { onChangeVariantForm, variant } = props;
    const product = variant;
    if (!product) {
      this.state = {
        attributeValues: this.resetAttrValues(),
        vendorCode: null,
        price: null,
        formErrors: undefined,
        isLoading: false,
        preOrder: false,
        preOrderDays: '',
      };
    } else {
      this.state = {
        vendorCode: product.vendorCode,
        price: product.price,
        cashback: Math.round((product.cashback || 0) * 100),
        discount: Math.round((product.discount || 0) * 100),
        mainPhoto: product.photoMain,
        photos: product.additionalPhotos,
        attributeValues: this.resetAttrValues(),
        formErrors: undefined,
        isLoading: false,
        preOrder: Boolean(product.preOrder),
        preOrderDays:
          product.preOrder && product.preOrderDays
            ? `${product.preOrderDays}`
            : '',
      };
    }

    const variantData = {
      ...this.state,
      variantId: variant ? variant.id : null,
    };
    onChangeVariantForm(variantData);
  }

  componentDidUpdate(prevProps: PropsType, prevState: StateType) {
    const { state } = this;
    if (JSON.stringify(state) !== JSON.stringify(prevState)) {
      const { onChangeVariantForm, variant } = this.props;
      const variantData = {
        ...this.state,
        variantId: variant ? variant.id : null,
      };
      onChangeVariantForm(variantData);
    }
  }

  onChangeValues = (values: Array<AttributeValueType>) => {
    this.setState({ attributeValues: values });
  };

  validate = () => {
    const { errors } = validate(
      {
        vendorCode: [[val => !isEmpty(val || ''), 'Vendor code is required']],
        price: [[val => !isEmpty(val || ''), 'Price is required']],
      },
      this.state,
    );
    return errors;
  };

  resetAttrValues = () => {
    const attrValues: Array<AttributeValueType> = map(
      item => ({
        attrId: item.rawId,
        ...this.valueForAttribute({ attr: item, variant: this.props.variant }),
      }),
      this.props.category.getAttributes,
    );
    return attrValues;
  };

  handleVendorCodeChange = (e: any) => {
    this.setState({
      vendorCode: e.target.value,
      // $FlowIgnore
      formErrors: omit(['vendorCode'], this.state.formErrors),
    });
  };

  handlePriceChange = (e: any) => {
    const resetErrorObj = {
      // $FlowIgnore
      formErrors: omit(['price'], this.state.formErrors),
    };
    const {
      target: { value },
    } = e;
    const regexp = /(^[0-9]*[.,]?[0-9]*$)/;
    if (regexp.test(value)) {
      this.setState({ price: value, ...resetErrorObj });
      return;
    }
    if (value === '') {
      this.setState({ price: 0, ...resetErrorObj });
    }
  };

  handlePriceBlur = () => {
    const price = `${this.state.price || ''}`;
    this.setState({
      price: Number(price.replace(/,/, '.').replace(/\.$/, '')),
    });
  };

  handleAddMainPhoto = (url: string) => {
    this.setState({ mainPhoto: url });
  };

  handleAddPhoto = (url: string) => {
    this.setState((prevState: StateType) => ({
      photos: append(url, prevState.photos || []),
    }));
  };

  handleRemovePhoto = (url: string) => {
    const { mainPhoto, photos } = this.state;
    if (url === mainPhoto) {
      this.setState({ mainPhoto: null });
      return;
    }
    // $FlowIgnoreMe
    this.setState({ photos: reject(n => url === n, photos) });
  };

  toggleDropdownVariant = () => {
    // $FlowIgnoreMe
    const id: string = pathOr(null, ['rawId'], this.props.variant);
    if (this.props.onExpandClick) {
      this.props.onExpandClick(id);
    }
  };

  valueForAttribute = (
    input: ValueForAttributeInputType,
  ): { value: string, metaField?: string } => {
    const { attr, variant } = input;
    const attrFromVariant =
      variant &&
      find(item => item.attribute.rawId === attr.rawId, variant.attributes);
    if (attrFromVariant && attrFromVariant.value) {
      return {
        value: attrFromVariant.value,
        metaField: attrFromVariant.metaField,
      };
    }
    const { values, translatedValues } = attr.metaField;
    if (values) {
      return {
        value: head(values) || '',
      };
    } else if (translatedValues && !isEmpty(translatedValues)) {
      return {
        // $FlowIgnoreMe
        value: pathOr(
          '',
          // $FlowIgnoreMe
          [0, 'translations', 0, 'text'],
          translatedValues || [],
        ),
      };
    }
    return {
      value: '',
    };
  };

  handlePercentChange = (id: string) => (e: any) => {
    const {
      target: { value },
    } = e;
    if (value === '') {
      this.setState({ [id]: null });
      return;
    } else if (value === 0) {
      this.setState({ [id]: 0 });
      return;
    } else if (value > 100) {
      this.setState({ [id]: 99 });
      return;
    } else if (Number.isNaN(parseFloat(value))) {
      return;
    }
    this.setState({ [id]: parseFloat(value) });
  };

  handleOnChangePreOrderDays = (e: any) => {
    let {
      target: { value },
    } = e;
    const regexp = /(^\d*$)/;
    if (!regexp.test(value)) {
      return;
    }
    value = value.replace(/^0+/, '0').replace(/^0+(\d)/, '$1');
    this.setState((prevState: StateType) => ({
      preOrder: prevState.preOrder && Boolean(value),
      preOrderDays: value,
    }));
  };

  handleOnChangePreOrder = () => {
    this.setState((prevState: StateType) => ({
      preOrder: !prevState.preOrder && Boolean(prevState.preOrderDays),
    }));
  };

  renderVariant = () => {
    const { formErrors } = this.props;
    const { vendorCode, price, cashback, discount } = this.state;
    return (
      <div styleName="variant">
        <div styleName="inputWidth">
          <div styleName="inputWidth">
            <Input
              fullWidth
              label={
                <span>
                  VendorCode <span styleName="asterisk">*</span>
                </span>
              }
              value={vendorCode || ''}
              onChange={this.handleVendorCodeChange}
              errors={formErrors && formErrors.vendorCode}
              dataTest="variantVendorcodeInput"
            />
          </div>
        </div>
        <div styleName="inputWidth">
          <div styleName="inputWidth">
            <div styleName="inputWithIcon">
              <Input
                fullWidth
                label={
                  <span>
                    Price <span styleName="asterisk">*</span>
                  </span>
                }
                onChange={this.handlePriceChange}
                onBlur={this.handlePriceBlur}
                value={price || ''}
                errors={formErrors && formErrors.price}
                dataTest="variantPriceInput"
              />
              <span styleName="priceIcon">STQ</span>
            </div>
          </div>
        </div>
        <div styleName="inputWidth">
          <div styleName="inputWidth">
            <Input
              fullWidth
              label="Cashback"
              onChange={this.handlePercentChange('cashback')}
              value={cashback || ''}
              dataTest="variantCashbackInput"
            />
            <span styleName="inputPostfix">Percent</span>
          </div>
        </div>
        <div styleName="inputWidth">
          <div styleName="inputWidth">
            <Input
              fullWidth
              label="Discount"
              onChange={this.handlePercentChange('discount')}
              value={discount || ''}
              dataTest="variantDiscountInput"
            />
            <span styleName="inputPostfix">Percent</span>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { category, variant, formErrors } = this.props;
    const {
      photos = [],
      mainPhoto,
      attributeValues,
      preOrder,
      preOrderDays,
    } = this.state;
    return (
      <div styleName="container">
        <div styleName="title">
          <strong>General</strong>
        </div>
        <div styleName="variants">{this.renderVariant()}</div>
        <Photos
          photos={photos}
          mainPhoto={mainPhoto}
          onAddMainPhoto={this.handleAddMainPhoto}
          onAddPhoto={this.handleAddPhoto}
          onRemovePhoto={this.handleRemovePhoto}
        />
        {attributeValues &&
          !isEmpty(attributeValues) && (
            <Characteristics
              category={category}
              values={this.state.attributeValues || []}
              onChange={this.onChangeValues}
              errors={(formErrors && formErrors.attributes) || null}
            />
          )}
        {variant &&
          variant.stocks &&
          !isEmpty(variant.stocks) && <Warehouses stocks={variant.stocks} />}
        <div styleName="preOrder">
          <div styleName="preOrderTitle">
            <div styleName="title">
              <strong>Available for pre-order</strong>
            </div>
            <div styleName="preOrderCheckbox">
              <Checkbox
                inline
                id="preOrderCheckbox"
                isChecked={preOrder}
                onChange={this.handleOnChangePreOrder}
              />
            </div>
          </div>
          <div styleName="preOrderDaysInput">
            <Input
              fullWidth
              label="Lead time (days)"
              onChange={this.handleOnChangePreOrderDays}
              value={preOrderDays}
              dataTest="variantPreOrderDaysInput"
            />
          </div>
        </div>
      </div>
    );
  }
}

Form.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default withShowAlert(Form);
