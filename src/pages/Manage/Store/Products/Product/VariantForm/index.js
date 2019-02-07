// @flow

import React, { Component, Fragment } from 'react';
import {
  append,
  find,
  isEmpty,
  isNil,
  map,
  propEq,
  reject,
  pathOr,
  head,
  dissoc,
  keys,
  filter,
  contains,
} from 'ramda';
import { Environment } from 'relay-runtime';
import { validate } from '@storiqa/shared';
import uuidv4 from 'uuid/v4';

import { Input, Button, InputPrice } from 'components/common';
import { Icon } from 'components/Icon';

import { log, fromRelayError } from 'utils';
import smoothscroll from 'libs/smoothscroll';
import { renameKeys } from 'utils/ramda';

import {
  UpdateProductMutation,
  CreateProductWithAttributesMutation,
} from 'relay/mutations';

import type {
  ProductType,
  ValueForAttributeInputType,
  GetAttributeType,
  FormErrorsType,
  AttributeValueType,
} from 'pages/Manage/Store/Products/types';

import type { SelectItemType } from 'types';
import type { AddAlertInputType } from 'components/Alerts/AlertContext';
import type { MutationParamsType as UpdateProductMutationType } from 'relay/mutations/UpdateProductMutation';
import type { MutationParamsType as CreateProductWithAttributesMutationType } from 'relay/mutations/CreateProductWithAttributesMutation';

import Characteristics from '../Characteristics';
import Photos from '../Photos';
import Warehouses from '../Warehouses';
import PreOrder from '../PreOrder';

import './VariantForm.scss';

import t from './i18n';

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
  cancelVariantForm: (isClose?: boolean) => void,
  customAttributes: any,
  mainVariant: ?ProductType,
  variant: ?ProductType | 'new',
  showAlert: (input: AddAlertInputType) => void,
  environment: Environment,
  productId: string,
  productRawId: number,
  currency: ?SelectItemType,
};

class VariantForm extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    const { customAttributes, variant, mainVariant } = props;
    let state = {};

    if (mainVariant && (!variant || variant === 'new')) {
      state = {
        vendorCode: null,
        price: null,
        cashback: null,
        discount: null,
        photoMain: mainVariant.photoMain,
        photos: mainVariant.additionalPhotos,
        attributeValues: !isEmpty(customAttributes)
          ? this.resetAttrValues(customAttributes, null)
          : [],
        preOrderDays: '',
        preOrder: false,
      };
    }

    if (variant && variant !== 'new') {
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
        preOrderDays: `${preOrderDays || ''}`,
        preOrder,
      };
    }

    this.state = {
      ...state,
      formErrors: {},
      isLoading: false,
      scrollArr: ['vendorCode', 'price', 'attributes'],
    };
    if (process.env.BROWSER) {
      window.scroll({ top: 0 });
    }
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
    this.setState({ photos: reject(n => url === n, photos) });
  };

  handleVendorCodeChange = (e: SyntheticInputEvent<>) => {
    const { value } = e.target;
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
      this.setState({ [id]: 100 });
      return;
    } else if (Number.isNaN(parseFloat(value))) {
      return;
    }
    this.setState({ [id]: parseFloat(value) });
  };

  resetAttrValues = (
    customAttributes: Array<GetAttributeType>,
    variant: ?ProductType,
  ) => {
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
      variant.attributes &&
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
    this.setState((prevState: StateType) => ({
      attributeValues: values,
      formErrors: dissoc('attributes', prevState.formErrors),
    }));
  };

  handleChangePreOrder = (data: {
    preOrderDays: string,
    preOrder: boolean,
  }) => {
    this.setState({
      preOrderDays: data.preOrderDays,
      preOrder: data.preOrder,
    });
  };

  validate = () => {
    const { errors } = validate(
      {
        vendorCode: [[val => Boolean(val), 'Vendor code is required']],
        price: [[val => Boolean(val), 'Price is required']],
      },
      this.state,
    );
    if (errors && !isEmpty(errors)) {
      this.scrollToError(errors);
    }
    return errors;
  };

  scrollToError = (errors: FormErrorsType) => {
    const { scrollArr } = this.state;
    const oneArr = filter(item => contains(item, keys(errors)), scrollArr);
    if (!isEmpty(oneArr) && head(oneArr)) {
      smoothscroll.scrollTo(head(oneArr));
    }
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
    this.setState({ isLoading: true });
    const params: CreateProductWithAttributesMutationType = {
      input: {
        clientMutationId: uuidv4(),
        product: {
          baseProductId: productRawId,
          price: price || 0,
          vendorCode: vendorCode || '',
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
          const formErrors = renameKeys(
            { vendor_code: 'vendorCode' },
            validationErrors,
          );
          this.setState({ formErrors });
          this.scrollToError(formErrors);
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
    if (!variant || variant === 'new') {
      return;
    }
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
    this.setState({ isLoading: true });
    const params: UpdateProductMutationType = {
      input: {
        clientMutationId: uuidv4(),
        id: variant.id,
        product: {
          price,
          vendorCode,
          photoMain: photoMain || '',
          additionalPhotos: photos,
          cashback: cashback ? cashback / 100 : 0,
          discount: discount ? discount / 100 : 0,
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
          const formErrors = renameKeys(
            { vendor_code: 'vendorCode' },
            validationErrors,
          );
          this.setState({ formErrors });
          this.scrollToError(formErrors);
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
          text: 'Variant updated!',
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
    const {
      cancelVariantForm,
      currency,
      customAttributes,
      variant,
    } = this.props;
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
    return (
      <div styleName="container">
        <button styleName="cross" onClick={() => cancelVariantForm(true)}>
          <Icon type="cross" size={16} />
        </button>
        <div styleName="title">
          <strong>{t.productPhotos}</strong>
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
        <div styleName="title titleGeneral">
          <strong>{t.generalSettings}</strong>
        </div>
        <div styleName="formItem">
          <Input
            id="vendorCode"
            fullWidth
            label={
              <span>
                {t.vendorCode} <span styleName="asterisk">*</span>
              </span>
            }
            value={vendorCode || ''}
            onChange={this.handleVendorCodeChange}
            errors={formErrors && formErrors.vendorCode}
            dataTest="vendorCode"
          />
        </div>
        <div styleName="title titlePricing">
          <strong>{t.pricing}</strong>
        </div>
        <div styleName="formItem">
          <InputPrice
            id="price"
            required
            label={t.price}
            onChangePrice={this.handlePriceChange}
            price={parseFloat(price) || 0}
            currency={currency}
            errors={formErrors && formErrors.price}
            dataTest="price"
          />
        </div>
        <div styleName="formItem">
          <Input
            fullWidth
            id="cashback"
            label={t.cashback}
            onChange={this.handlePercentChange('cashback')}
            value={!isNil(cashback) ? `${cashback}` : ''}
            dataTest="Cashback"
          />
          <span styleName="inputPostfix">{t.percent}</span>
        </div>
        <div styleName="formItem">
          <Input
            fullWidth
            id="discount"
            label={t.discount}
            onChange={this.handlePercentChange('discount')}
            value={!isNil(discount) ? `${discount}` : ''}
            dataTest="Discount"
          />
          <span styleName="inputPostfix">Percent</span>
        </div>
        {!isEmpty(customAttributes) && (
          <Fragment>
            <div styleName="title titleCharacteristics">
              <strong>{t.characteristics}</strong>
            </div>
            <div styleName="characteristics">
              <Characteristics
                customAttributes={customAttributes}
                values={attributeValues || []}
                onChange={this.handleChangeValues}
                errors={(formErrors && formErrors.attributes) || null}
              />
            </div>
          </Fragment>
        )}
        <div styleName="preOrder">
          <PreOrder
            preOrderDays={preOrderDays}
            preOrder={preOrder}
            onChangePreOrder={this.handleChangePreOrder}
          />
        </div>
        <div styleName="warehouses">
          {variant &&
            !isEmpty(variant) &&
            variant !== 'new' && <Warehouses stocks={variant.stocks} />}
        </div>
        <div styleName="footer">
          <div styleName="buttons">
            <div styleName="saveButton">
              <Button
                big
                fullWidth
                onClick={
                  variant === 'new'
                    ? this.handleCreateVariant
                    : this.handleUpdateVariant
                }
                dataTest="saveVariantButton"
                isLoading={isLoading}
              >
                {t.save}
              </Button>
            </div>
            <div styleName="cancelButton">
              <Button
                big
                fullWidth
                wireframe
                onClick={() => {
                  cancelVariantForm(true);
                }}
                dataTest="cancelVariantButton"
              >
                {t.cancel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VariantForm;
