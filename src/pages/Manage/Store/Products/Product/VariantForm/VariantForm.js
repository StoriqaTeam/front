// @flow

import React, { Component, Fragment } from 'react';
import {
  append,
  assocPath,
  find,
  isEmpty,
  isNil,
  map,
  omit,
  propEq,
  reject,
  pathOr,
  head,
  dissoc,
  keys,
  filter, contains
} from 'ramda';
import { Environment } from 'relay-runtime';
import { validate } from '@storiqa/shared';

import { Input, Button, InputPrice, Checkbox } from 'components/common';
import { Icon } from 'components/Icon';

import { log, fromRelayError } from 'utils';
import smoothscroll from 'libs/smoothscroll';

import {
  UpdateProductMutation,
  CreateProductWithAttributesMutation,
} from 'relay/mutations';

import type { SelectItemType } from 'types';
import type { AddAlertInputType } from 'components/App/AlertContext';
import type { MutationParamsType as UpdateProductMutationType } from 'relay/mutations/UpdateProductMutation';
import type { MutationParamsType as CreateProductWithAttributesMutationType } from 'relay/mutations/CreateProductWithAttributesMutation';

import Characteristics from '../Characteristics/Characteristics';
import Photos from '../Photos/Photos';
import Warehouses from '../Warehouses/Warehouses';

import './VariantForm.scss';

type ValueForAttributeInputType = {
  attr: any,
  variant: any,
};

type AttributeType = {
  id: string,
  rawId: number,
  name: {
    lang: string,
    text: string,
  },
};

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
  scrollArr: Array<string>,
};

type PropsType = {
  variant: any,
  cancelVariantForm: () => void,
  currency: SelectItemType,
  customAttributes: any,
  mainVariant: any,
  productId: string,
  productRawId: number,




  environment: Environment,
  showAlert: (input: AddAlertInputType) => void,
};

class VariantForm extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    const { customAttributes, variant } = props;
    console.log('---variant', variant);

    let state = {};

    if (isEmpty(variant)) {
      state = {
        vendorCode: null,
        price: null,
        cashback: null,
        discount: null,
        photoMain: null,
        photos: [],
        attributeValues: !isEmpty(customAttributes)
          ? this.resetAttrValues(customAttributes, null)
          : [],
        preOrderDays: '',
        preOrder: false,
      };
    } else {
      const {
        vendorCode,
        price,
        cashback,
        discount,
        photoMain,
        additionalPhotos,
        preOrderDays,
        preOrder,
      } = variant;
      state = {
        vendorCode,
        price,
        cashback: Math.round((cashback || 0) * 100),
        discount: Math.round((discount || 0) * 100),
        photoMain,
        photos: additionalPhotos,
        attributeValues: !isEmpty(customAttributes)
          ? this.resetAttrValues(customAttributes, variant)
          : [],
        preOrderDays,
        preOrder,
      };
    }

    this.state = {
      ...state,
      formErrors: {},
      isLoading: false,
      scrollArr: ['vendorCode', 'price'],
    };
    window.scroll({ top: 0 });
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
    const { value } = e.target;
    // this.setState({ vendorCode: e.target.value });
    this.setState((prevState: StateType) => ({
      formErrors: dissoc('vendorCode', prevState.formErrors),
      vendorCode: value,
    }));
  };

  handlePriceChange = (value: number) => {
    this.setState((prevState: StateType) => ({
      formErrors: dissoc('price', prevState.formErrors),
      price: value,
    }));
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

  resetAttrValues = (customAttributes: Array<AttributeType>, variant) => {
    // $FlowIgnoreMe
    const attributeValues = pathOr(
      null,
      ['form', 'attributeValues'],
      this.state,
    );
    const attrValues: Array<AttributeValueType> = map(item => {
      if (attributeValues) {
        const isAttributeValue = find(propEq('attrId', item.rawId))(
          attributeValues,
        );
        if (isAttributeValue) {
          return isAttributeValue;
        }
      }
      return {
        attrId: item.rawId,
        ...this.valueForAttribute({ attr: item, variant }),
      };
    }, customAttributes);
    return attrValues;
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

  handleChangeValues = (values: Array<AttributeValueType>) => {
    this.setState({ attributeValues: values });
  };

  preOrderDaysInput: ?HTMLInputElement;

  handleOnChangePreOrderDays = (e: SyntheticInputEvent<>) => {
    let {
      target: { value },
    } = e;
    const regexp = /(^\d*$)/;
    if (!regexp.test(value)) {
      return;
    }
    value = value.replace(/^0+/, '0').replace(/^0+(\d)/, '$1');
    this.setState({ preOrderDays: value });
  };

  handleOnBlurPreOrderDays = (e: SyntheticInputEvent<>) => {
    const {
      target: { value },
    } = e;
    if (!value || value === '0') {
      this.setState({
        preOrderDays: '',
        preOrder: false,
      });
    }
  };

  handleOnChangePreOrder = () => {
    this.setState((prevState: StateType) => ({
      preOrder: !prevState.preOrder,
    }));
    if (this.preOrderDaysInput && !this.state.preOrder && !this.state.preOrderDays) {
      this.preOrderDaysInput.focus();
    }
  };

  handleSave = () => {

  };

  validate = () => {
    const { errors } = validate(
      {
        vendorCode: [[val => Boolean(val), 'Vendor code is required']],
        price: [[val => Boolean(val), 'Price is required']],
      },
      this.state,
    );
    console.log('---errors', errors);
    if (errors && !isEmpty(errors)) {
      const { scrollArr } = this.state;
      const oneArr = filter(
        item => contains(item, keys(errors)),
        scrollArr,
      );
      smoothscroll.scrollTo(head(oneArr));
    }
    return errors;
  };

  handleCreateVariant = () => {
    const preValidationErrors = this.validate();
    if (preValidationErrors) {
      this.setState({
        formErrors: preValidationErrors || {},
      });
      return;
    }
    const { productId, productRawId, cancelVariantForm } = this.props;
    const {
      price,
      vendorCode,
      photoMain,
      photos,
      cashback,
      discount,
      preOrder,
      preOrderDays,
      attributeValues,
    } = this.state;
    const params: CreateProductWithAttributesMutationType = {
      input: {
        clientMutationId: '',
        product: {
          baseProductId: productRawId,
          price: price || 0,
          vendorCode: vendorCode|| '',
          photoMain,
          additionalPhotos: photos,
          cashback: cashback ? cashback / 100 : null,
          discount: discount ? discount / 100 : null,
          preOrder,
          preOrderDays: Number(preOrderDays),
        },
        attributes: attributeValues,
      },
      parentID: productId,
      environment: this.props.environment,
      onCompleted: (response: ?{}, errors: ?Array<any>) => {
        this.setState({ isLoading: false });
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
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Variant create!',
          link: { text: '' },
        });
        cancelVariantForm();
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

  handleUpdateVariant = () => {
    const preValidationErrors = this.validate();
    if (preValidationErrors) {
      this.setState({
        formErrors: preValidationErrors || {},
      });
      return;
    }
    const { cancelVariantForm, variant } = this.props;
    const {
      price,
      vendorCode,
      photoMain,
      photos,
      cashback,
      discount,
      preOrder,
      preOrderDays,
      attributeValues,
    } = this.state;
    const params: UpdateProductMutationType = {
      input: {
        clientMutationId: '',
        id: variant.id,
        product: {
          price,
          vendorCode,
          photoMain,
          additionalPhotos: photos,
          cashback: cashback ? cashback / 100 : null,
          discount: discount ? discount / 100 : null,
          preOrder,
          preOrderDays: Number(preOrderDays),
        },
        attributes: attributeValues,
      },
      environment: this.props.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState({ isLoading: false });
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.setState({
            formErrors: validationErrors,
          });
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
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Variant update!',
          link: { text: '' },
        });
        cancelVariantForm();
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong.',
          link: { text: 'Close.' },
        });
      },
    };
    UpdateProductMutation.commit(params);
  };

  render() {
    const { cancelVariantForm, currency, customAttributes, variant } = this.props;
    const {
      photos,
      photoMain,
      vendorCode,
      price,
      formErrors,
      cashback,
      discount,
      attributeValues,
      isLoading,
      preOrder,
      preOrderDays,
    } = this.state;
    console.log('---this.props', this.props);
    console.log('---this.state', this.state);
    return (
      <div styleName="container">
        <button
          styleName="cross"
          onClick={cancelVariantForm}
        >
          <Icon type="cross" size={16} />
        </button>
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
            id="vendorCode"
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
            id="price"
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
        {!isEmpty(customAttributes) && (
          <Fragment>
            <div styleName="title">
              <strong>Characteristics</strong>
            </div>
            <div styleName="formItem">
              <Characteristics
                customAttributes={customAttributes}
                values={attributeValues || []}
                onChange={this.handleChangeValues}
                errors={(formErrors && formErrors.attributes) || null}
              />
            </div>
          </Fragment>
        )}
        <div styleName="formItem">
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
                inputRef={node => {
                  this.preOrderDaysInput = node;
                }}
                fullWidth
                label="Lead time (days)"
                onChange={this.handleOnChangePreOrderDays}
                onBlur={this.handleOnBlurPreOrderDays}
                value={preOrderDays || ''}
                dataTest="variantPreOrderDaysInput"
              />
            </div>
          </div>
        </div>
        <div styleName="warehouses">
          {!isEmpty(variant) && <Warehouses stocks={variant.stocks} />}
        </div>
        <div styleName="buttons">
          <div styleName="saveButton">
            <Button
              big
              fullWidth
              onClick={isEmpty(variant) ? this.handleCreateVariant : this.handleUpdateVariant}
              dataTest="saveVariantButton"
              isLoading={isLoading}
            >
              Save
            </Button>
          </div>
          <div styleName="cancelButton">
            <Button
              big
              fullWidth
              wireframe
              onClick={cancelVariantForm}
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
