// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { find, append, head, pathOr, map, isEmpty, omit, reject } from 'ramda';
import { validate } from '@storiqa/shared';

import { Button } from 'components/common/Button';
import { log, fromRelayError } from 'utils';
import { withShowAlert } from 'components/App/AlertContext';
import { Input } from 'components/common/Input';

import { CreateProductWithAttributesMutation } from 'relay/mutations';
import type { MutationParamsType as CreateProductWithAttributesMutationType } from 'relay/mutations/CreateProductWithAttributesMutation';

import type { AddAlertInputType } from 'components/App/AlertContext';

import Characteristics from './Characteristics';
import Photos from './Photos';
import Warehouses from './Warehouses';

import './Form.scss';

type AttributeValueType = {
  attrId: number,
  value: string,
  metaField?: ?string,
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
};

type PropsType = {
  showAlert: (input: AddAlertInputType) => void,
  productRawId: number,
  productId: string,
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
  },
  onExpandClick: (id: string) => void,
  handleSaveBaseProductWithVariant: ({
    variantData: StateType,
    isCanCreate: boolean,
  }) => void,
  isLoading: boolean,
  isNewVariant: boolean,
  toggleNewVariantParam: (value: boolean) => void,
};

type ValueForAttributeInputType = {
  attr: any,
  variant: any,
};

class Form extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const product = props.variant;
    if (!product) {
      this.state = {
        attributeValues: this.resetAttrValues(),
        vendorCode: null,
        price: null,
        formErrors: undefined,
        isLoading: false,
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
      };
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

  handleSaveProduct = () => {
    const { handleSaveBaseProductWithVariant, variant } = this.props;

    const variantData = {
      ...this.state,
      variantId: variant ? variant.id : null,
    };
    const formErrors = this.validate();
    if (formErrors) {
      this.setState({ formErrors });
      handleSaveBaseProductWithVariant({ variantData, isCanCreate: false });
      return;
    }

    handleSaveBaseProductWithVariant({ variantData, isCanCreate: true });
  };

  handleCreateVariant = () => {
    const formErrors = this.validate();
    if (formErrors) {
      this.setState({ formErrors });
      return;
    }
    const { environment } = this.context;
    const {
      price,
      vendorCode,
      mainPhoto,
      photos,
      cashback,
      discount,
      attributeValues,
    } = this.state;
    if (!price || !vendorCode) {
      this.props.showAlert({
        type: 'danger',
        text: 'Something going wrong :(',
        link: { text: 'Close.' },
      });
      return;
    }
    this.setState({ isLoading: true });
    const params: CreateProductWithAttributesMutationType = {
      input: {
        clientMutationId: '',
        product: {
          baseProductId: this.props.productRawId,
          price,
          vendorCode,
          photoMain: mainPhoto,
          additionalPhotos: photos,
          cashback: cashback ? cashback / 100 : null,
          discount: discount ? discount / 100 : null,
        },
        attributes: attributeValues || [],
      },
      parentID: this.props.productId,
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState({ isLoading: false });
        // this.setState(() => ({ isLoading: false }));
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.setState({ formErrors: validationErrors });
          return;
        }

        // $FlowIgnoreMe
        const statusError: string = pathOr({}, ['100', 'status'], relayErrors);
        if (!isEmpty(statusError)) {
          this.props.showAlert({
            type: 'danger',
            text: `Error: "${statusError}"`,
            link: { text: 'Close.' },
          });
          return;
        }

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Variant created!',
          link: { text: '' },
        });
        this.props.toggleNewVariantParam(false);
      },
      onError: (error: Error) => {
        this.setState({ isLoading: false });
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong.',
          link: { text: 'Close.' },
        });
      },
    };
    CreateProductWithAttributesMutation.commit(params);
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

  renderVariant = () => {
    const { vendorCode, price, cashback, discount, formErrors } = this.state;
    return (
      <div styleName="variant">
        <div styleName="inputWidth">
          <div styleName="inputWidth">
            <Input
              id=""
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
                id=""
                fullWidth
                label={
                  <span>
                    Price <span styleName="asterisk">*</span>
                  </span>
                }
                onChange={this.handlePriceChange}
                onBlur={this.handlePriceBlur}
                value={price ? `${price}` : ''}
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
              id=""
              fullWidth
              label="Cashback"
              onChange={this.handlePercentChange('cashback')}
              value={cashback ? `${cashback}` : ''}
              dataTest="variantCashbackInput"
            />
            <span styleName="inputPostfix">Percent</span>
          </div>
        </div>
        <div styleName="inputWidth">
          <div styleName="inputWidth">
            <Input
              id=""
              fullWidth
              label="Discount"
              onChange={this.handlePercentChange('discount')}
              value={discount ? `${discount}` : ''}
              dataTest="variantDiscountInput"
            />
            <span styleName="inputPostfix">Percent</span>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const {
      category,
      variant,
      isLoading,
      isNewVariant,
      toggleNewVariantParam,
    } = this.props;
    const {
      photos = [],
      mainPhoto,
      formErrors,
      isLoading: isLoadingLocal,
      attributeValues,
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
        <div styleName="buttons">
          <div styleName="saveButton">
            <Button
              isLoading={isLoading || isLoadingLocal}
              big
              fullWidth
              type="button"
              onClick={
                isNewVariant ? this.handleCreateVariant : this.handleSaveProduct
              }
              dataTest="variantsProductSaveButton"
            >
              Save
            </Button>
          </div>
          {isNewVariant && (
            <button
              styleName="cancelButton"
              onClick={() => toggleNewVariantParam(false)}
              data-test="cancelNewVariantButton"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }
}

Form.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default withShowAlert(Form);
