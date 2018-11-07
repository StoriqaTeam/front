// @flow

import React, { Component, Fragment } from 'react';
import { routerShape, matchShape } from 'found';
import {
  assocPath,
  isEmpty,
  omit,
  whereEq,
  pathOr,
  map,
  assoc,
  dissoc,
  filter,
  keys,
  head,
  find,
  append,
  isNil,
  contains,
  propEq,
  drop,
  length,
} from 'ramda';
import { validate } from '@storiqa/shared';
import classNames from 'classnames';
import { Environment } from 'relay-runtime';

import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import {
  Select,
  SpinnerCircle,
  Button,
  InputPrice,
  Checkbox,
} from 'components/common';
import { CategorySelector } from 'components/CategorySelector';
import { Icon } from 'components/Icon';
import { Textarea } from 'components/common/Textarea';
import { Input } from 'components/common/Input';
import { withShowAlert } from 'components/App/AlertContext';
import { getNameText, findCategory, convertCurrenciesForSelect } from 'utils';
import smoothscroll from 'libs/smoothscroll';

import type {
  BaseProductType,
  FormErrorsType,
  FormType,
  AttributeValueType,
  ProductCategoryType,
  ProductType,
  ValueForAttributeInputType,
  GetAttributeType,
} from 'pages/Manage/Store/Products/types';
import type { SelectItemType, CategoryType } from 'types';
import type { AddAlertInputType } from 'components/App/AlertContext';

import { Shipping } from './Shipping';
import Variants from './Variants';
import Photos from './Photos';
import Warehouses from './Warehouses';
import Tabs from './Tabs';
import Characteristics from './Characteristics';
import VariantForm from './VariantForm';
import AdditionalAttributes from './AdditionalAttributes';

import type { AvailablePackagesType, FullShippingType } from './Shipping/types';

import './Product.scss';

type PropsType = {
  baseProduct: ?BaseProductType,
  isLoading: boolean,
  availablePackages: AvailablePackagesType,
  shippingData: ?FullShippingType,
  customAttributes: Array<GetAttributeType>,
  formErrors: FormErrorsType,
  isLoadingPackages: boolean,
  isLoadingShipping: boolean,
  environment?: Environment,
  router: routerShape,
  match: matchShape,
  onSave: (form: FormType, isAddVariant?: boolean) => {},
  categories: Array<CategoryType>,
  currencies: Array<string>,
  onChangeShipping: (shippingData: ?FullShippingType) => void,
  onCreateAttribute: (attribute: GetAttributeType) => void,
  onRemoveAttribute: (id: string) => void,
  onResetAttribute: () => void,
  onSaveShipping: (onlyShippingSave?: boolean) => void,
  showAlert: (input: AddAlertInputType) => void,
};

type StateType = {
  activeTab: string,
  category: ?ProductCategoryType,
  currencies: Array<SelectItemType>,
  currency: ?SelectItemType,
  form: FormType,
  formErrors: FormErrorsType,
  scrollArr: Array<string>,
  shippingErrors: ?{
    local?: string,
    inter?: string,
  },
  tabs: Array<{
    id: string,
    label: string,
  }>,
  variantForForm: ?ProductType | 'new',
};

class Form extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
    const currentFormErrors = prevState.formErrors;
    const nextFormErrors = nextProps.formErrors;
    if (isEmpty(currentFormErrors) && !isEmpty(nextFormErrors)) {
      const { scrollArr } = prevState;
      const oneArr = filter(
        item => contains(item, keys(nextFormErrors)),
        scrollArr,
      );
      if (!isEmpty(oneArr) && head(oneArr)) {
        smoothscroll.scrollTo(head(oneArr));
      }
      return {
        ...prevState,
        formErrors: nextFormErrors,
      };
    }
    return null;
  }

  constructor(props: PropsType) {
    super(props);
    const { baseProduct, currencies, customAttributes } = props;
    // $FlowIgnore
    const currency = pathOr('STQ', ['baseProduct', 'currency'], props);
    let form = {};
    let variantForForm = null;

    if (baseProduct) {
      const {
        name,
        shortDescription,
        longDescription,
        seoTitle,
        seoDescription,
        category,
      } = baseProduct;
      // $FlowIgnore
      const allVariants = pathOr([], ['products', 'edges'], baseProduct);
      const filteredVariants = map(item => item.node, allVariants);
      const mainVariant = head(filteredVariants);
      const {
        id,
        rawId,
        photoMain,
        additionalPhotos,
        vendorCode,
        price,
        cashback,
        discount,
        preOrderDays,
        preOrder,
      } = mainVariant;

      // $FlowIgnore
      const variantId = pathOr([], ['match', 'params', 'variantId'], props);
      variantForForm = this.getVariantForForm(variantId);

      form = {
        name: getNameText(name || [], 'EN') || '',
        shortDescription: getNameText(shortDescription || [], 'EN') || '',
        longDescription: getNameText(longDescription || [], 'EN') || '',
        seoTitle: getNameText(seoTitle || [], 'EN') || '',
        seoDescription: getNameText(seoDescription || [], 'EN') || '',
        categoryId: category ? category.rawId : null,

        idMainVariant: id,
        rawIdMainVariant: rawId,
        photoMain,
        photos: additionalPhotos || [],
        vendorCode,
        price,
        cashback: Math.round((cashback || 0) * 100),
        discount: Math.round((discount || 0) * 100),
        preOrderDays,
        preOrder,
        attributeValues: !isEmpty(customAttributes)
          ? this.resetAttrValues(customAttributes, mainVariant)
          : [],
      };
    } else {
      form = {
        name: '',
        shortDescription: '',
        longDescription: '',
        seoTitle: '',
        seoDescription: '',
        categoryId: null,

        idMainVariant: null,
        rawIdMainVariant: null,
        photoMain: null,
        photos: [],
        vendorCode: '',
        price: 0,
        cashback: null,
        discount: null,
        preOrderDays: '',
        preOrder: false,
        attributeValues: !isEmpty(customAttributes)
          ? this.resetAttrValues(customAttributes, null)
          : [],
      };
    }
    this.state = {
      form,
      formErrors: {},
      category: null,
      currencies: convertCurrenciesForSelect(currencies),
      currency: { id: currency, label: currency },
      shippingErrors: null,
      scrollArr: [
        'name',
        'shortDescription',
        'longDescription',
        'categoryId',
        'vendorCode',
        'price',
        'attributes',
      ],
      activeTab: 'variants',
      tabs: [
        {
          id: 'variants',
          label: 'Variants',
        },
        {
          id: 'delivery',
          label: 'Delivery',
        },
      ],
      variantForForm,
    };
  }

  componentDidUpdate(prevProps: PropsType) {
    const { shippingData, customAttributes, baseProduct } = this.props;
    if (
      JSON.stringify(shippingData) !== JSON.stringify(prevProps.shippingData)
    ) {
      this.resetShippingErrors();
    }

    if (
      JSON.stringify(prevProps.customAttributes) !==
      JSON.stringify(customAttributes)
    ) {
      const attrValues = this.resetAttrValues(customAttributes);
      this.onChangeValues(attrValues);
    }

    // $FlowIgnore
    const pathname = pathOr(
      null,
      ['match', 'location', 'pathname'],
      this.props,
    );
    // $FlowIgnore
    const prevPathname = pathOr(
      null,
      ['match', 'location', 'pathname'],
      prevProps,
    );
    if (
      pathname !== prevPathname ||
      (baseProduct &&
        prevProps.baseProduct &&
        JSON.stringify(prevProps.baseProduct.products) !==
          JSON.stringify(baseProduct.products))
    ) {
      // $FlowIgnore
      const variantId = pathOr(
        null,
        ['match', 'params', 'variantId'],
        this.props,
      );
      this.updateVariantForForm(this.getVariantForForm(variantId));
    }
  }

  onChangeValues = (values: Array<AttributeValueType>) => {
    this.setState((prevState: StateType) =>
      assocPath(['form', 'attributeValues'], values, prevState),
    );
  };

  getVariantForForm = (variantId?: string) => {
    if (!variantId) {
      return null;
    }
    if (variantId === 'new') {
      return 'new';
    }
    const { baseProduct } = this.props;
    // $FlowIgnoreMe
    const allVariants = pathOr([], ['products', 'edges'], baseProduct);
    const filteredVariants = map(item => item.node, allVariants);
    // $FlowIgnoreMe
    return find(propEq('rawId', parseFloat(variantId)))(filteredVariants);
  };

  updateVariantForForm = (variant: ?ProductType | 'new') => {
    this.setState({ variantForForm: variant });
  };

  scrollToError = (errors: FormErrorsType) => {
    const { scrollArr } = this.state;
    const oneArr = filter(item => contains(item, keys(errors)), scrollArr);
    if (!isEmpty(oneArr) && head(oneArr)) {
      smoothscroll.scrollTo(head(oneArr));
    }
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

  resetShippingErrors = () => {
    this.setState({ shippingErrors: null });
  };

  validate = () => {
    const { errors } = validate(
      {
        name: [[val => Boolean(val), 'Name is required']],
        shortDescription: [
          [val => Boolean(val), 'Short description is required'],
        ],
        longDescription: [
          [val => Boolean(val), 'Long description is required'],
        ],
        categoryId: [[val => Boolean(val), 'Category is required']],
        vendorCode: [[val => Boolean(val), 'Vendor code is required']],
        price: [[val => Boolean(val), 'Price is required']],
      },
      this.state.form,
    );
    if (errors && !isEmpty(errors)) {
      this.scrollToError(errors);
    }
    return errors;
  };

  shippingValidate = () => {
    const { shippingData } = this.props;
    let shippingErrors = null;
    if (
      shippingData &&
      !shippingData.withoutLocal &&
      isEmpty(shippingData.local) &&
      !shippingData.pickup.pickup
    ) {
      shippingErrors = assoc(
        'local',
        'Add at least one delivery service or pickup',
        shippingErrors,
      );
    }
    if (
      shippingData &&
      !shippingData.withoutInter &&
      isEmpty(shippingData.international)
    ) {
      shippingErrors = assoc(
        'inter',
        'Add at least one delivery service',
        shippingErrors,
      );
    }
    if (isEmpty(this.state.formErrors)) {
      if (shippingErrors && shippingErrors.local) {
        smoothscroll.scrollTo('localShippingError');
      }
      if (shippingErrors && !shippingErrors.local && shippingErrors.inter) {
        smoothscroll.scrollTo('interShippingError');
      }
    }

    return shippingErrors;
  };

  handleSave = (isAddVariant?: boolean) => {
    const { form, currency } = this.state;
    this.setState({
      formErrors: {},
      shippingErrors: null,
    });
    const preValidationErrors = this.validate();
    const shippingValidationErrors = this.shippingValidate();
    if (preValidationErrors || shippingValidationErrors) {
      this.setState({
        formErrors: preValidationErrors || {},
        shippingErrors: shippingValidationErrors || null,
      });
      return;
    }
    this.props.onSave(
      { ...form, currency: currency ? currency.id : null },
      isAddVariant,
    );
  };

  handleInputChange = (id: string) => (e: any) => {
    this.setState({ formErrors: omit([id], this.state.formErrors) });
    const { value } = e.target;
    if (value.length <= 50) {
      this.setState((prevState: StateType) =>
        assocPath(['form', id], value, prevState),
      );
    }
  };

  handleTextareaChange = (id: string) => (e: any) => {
    this.setState({ formErrors: omit([id], this.state.formErrors) });
    const { value } = e.target;
    this.setState((prevState: StateType) =>
      assocPath(['form', id], value, prevState),
    );
  };

  handleSelectedCategory = (categoryId: number) => {
    const { categories, onResetAttribute } = this.props;
    const category = findCategory(
      whereEq({ rawId: parseInt(categoryId, 10) }),
      categories,
    );
    this.setState(
      (prevState: StateType) => ({
        form: {
          ...this.state.form,
          categoryId,
        },
        category: {
          id: category.id,
          rawId: category.rawId,
          getAttributes: category.getAttributes,
        },
        formErrors: dissoc('categoryId', prevState.formErrors),
      }),
      onResetAttribute,
    );
  };

  handleOnSelectCurrency = (currency: ?SelectItemType) => {
    this.setState({ currency });
  };

  handleAddMainPhoto = (url: string) => {
    this.setState((prevState: StateType) =>
      assocPath(['form', 'photoMain'], url, prevState),
    );
  };

  handleAddPhoto = (url: string) => {
    const { photos } = this.state.form;
    const newPhotos = append(url, photos || []);
    this.setState((prevState: StateType) =>
      assocPath(['form', 'photos'], newPhotos, prevState),
    );
  };

  handleRemovePhoto = (url: string) => {
    const { photoMain, photos } = this.state.form;
    if (url === photoMain) {
      this.setState((prevState: StateType) =>
        assocPath(['form', 'photoMain'], null, prevState),
      );
      return;
    }

    const newPhotos = filter(item => item !== url, photos || []);
    this.setState((prevState: StateType) =>
      assocPath(['form', 'photos'], newPhotos, prevState),
    );
  };

  handlePriceChange = (value: number) => {
    this.setState((prevState: StateType) => {
      const formErrors = dissoc('price', prevState.formErrors);
      return { ...assocPath(['form', 'price'], value, prevState), formErrors };
    });
  };

  handlePercentChange = (id: string) => (e: any) => {
    const {
      target: { value },
    } = e;
    if (value === '') {
      this.setState((prevState: StateType) =>
        assocPath(['form', id], null, prevState),
      );
      return;
    } else if (value === 0) {
      this.setState((prevState: StateType) =>
        assocPath(['form', id], 0, prevState),
      );
      return;
    } else if (value > 100) {
      this.setState((prevState: StateType) =>
        assocPath(['form', id], 100, prevState),
      );
      return;
    } else if (Number.isNaN(parseFloat(value))) {
      return;
    }
    this.setState((prevState: StateType) =>
      assocPath(['form', id], parseFloat(value), prevState),
    );
  };

  handleChangeValues = (values: Array<AttributeValueType>) => {
    this.setState((prevState: StateType) => {
      const formErrors = dissoc('attributes', prevState.formErrors);
      return {
        ...assocPath(['form', 'attributeValues'], values, prevState),
        formErrors,
      };
    });
  };

  preOrderDaysInput: ?HTMLInputElement;

  handleOnChangePreOrderDays = (e: any) => {
    let {
      target: { value },
    } = e;
    const regexp = /(^\d*$)/;
    if (!regexp.test(value)) {
      return;
    }
    value = value.replace(/^0+/, '0').replace(/^0+(\d)/, '$1');
    this.setState((prevState: StateType) =>
      assocPath(['form', 'preOrderDays'], value, prevState),
    );
  };

  handleOnBlurPreOrderDays = (e: any) => {
    const {
      target: { value },
    } = e;
    if (!value || value === '0') {
      this.setState((prevState: StateType) =>
        assocPath(
          ['form', 'preOrderDays'],
          '',
          assocPath(['form', 'preOrder'], false, prevState),
        ),
      );
    }
  };

  handleOnChangePreOrder = () => {
    this.setState((prevState: StateType) =>
      assocPath(['form', 'preOrder'], !prevState.form.preOrder, prevState),
    );
    if (
      this.preOrderDaysInput &&
      !this.state.form.preOrder &&
      !this.state.form.preOrderDays
    ) {
      this.preOrderDaysInput.focus();
    }
  };

  handleChangeTab = (activeTab: string) => {
    this.setState({ activeTab });
  };

  addNewVariant = () => {
    this.setState({ variantForForm: 'new' });
    this.handleChangePathName('new');
  };

  cancelVariantForm = (isClose?: boolean) => {
    this.setState({ variantForForm: null }, () => {
      if (!isClose) {
        smoothscroll.scrollTo('tabs', () => {}, true);
      } else {
        window.scroll({ top: 0 });
      }
    });

    this.handleChangePathName();
  };

  expandClick = (id: number) => {
    this.handleChangePathName(id);
  };

  handleChangePathName = (variant?: number | 'new') => {
    // $FlowIgnore
    const baseProductRawId = pathOr(null, ['baseProduct', 'rawId'], this.props);
    // $FlowIgnore
    const storeRawId = pathOr(
      null,
      ['baseProduct', 'store', 'rawId'],
      this.props,
    );

    this.props.router.push(
      `/manage/store/${storeRawId}/products/${parseInt(baseProductRawId, 10)}${
        variant ? `/variant/${variant}` : ''
      }`,
    );
  };

  handleSaveShipping = (onlyShippingSave?: boolean) => {
    const shippingValidationErrors = this.shippingValidate();
    if (shippingValidationErrors) {
      this.setState({
        shippingErrors: shippingValidationErrors || null,
      });
      return;
    }
    this.props.onSaveShipping(onlyShippingSave);
  };

  renderInput = (props: {
    id: string,
    label: string,
    limit: number,
    required?: boolean,
  }) => {
    const { id, label, limit, required } = props;
    const requiredLabel = required ? (
      <span>
        {label} <span styleName="asterisk">*</span>
      </span>
    ) : (
      label
    );
    // $FlowIgnore
    const value = pathOr('', ['form', id], this.state);
    // $FlowIgnore
    const errors = pathOr(undefined, ['formErrors', id], this.state);
    return (
      <Input
        id={id}
        value={value}
        label={requiredLabel}
        onChange={this.handleInputChange(id)}
        errors={errors}
        limit={limit}
        fullWidth
      />
    );
  };

  renderTextarea = (props: {
    id: string,
    label: string,
    required?: boolean,
  }) => {
    const { id, label, required } = props;
    const requiredLabel = (
      <span>
        {label} <span styleName="asterisk">*</span>
      </span>
    );
    // $FlowIgnore
    const value = pathOr('', ['form', id], this.state);
    // $FlowIgnore
    const errors = pathOr('', ['formErrors', id], this.state);
    return (
      <Textarea
        id={id}
        value={value}
        label={required ? requiredLabel : label}
        onChange={this.handleTextareaChange(id)}
        errors={errors}
        fullWidth
      />
    );
  };

  render() {
    const {
      isLoading,
      baseProduct,
      availablePackages,
      isLoadingPackages,
      onChangeShipping,
      onCreateAttribute,
      onRemoveAttribute,
      customAttributes,
      environment,
      isLoadingShipping,
      showAlert,
    } = this.props;
    const {
      category,
      currencies,
      currency,
      shippingErrors,
      formErrors,
      form,
      activeTab,
      tabs,
      variantForForm,
    } = this.state;

    const status = baseProduct ? baseProduct.status : 'Draft';
    // $FlowIgnore
    const variants = pathOr([], ['products', 'edges'], baseProduct);
    const filteredVariants = map(item => item.node, variants) || [];
    const mainVariant = isEmpty(filteredVariants)
      ? null
      : // $FlowIgnore
        head(filteredVariants);
    const restVariants =
      // $FlowIgnore
      !isEmpty(filteredVariants) && length(filteredVariants) > 1
        ? // $FlowIgnore
          drop(1, filteredVariants)
        : null;
    // $FlowIgnore
    const storeRawID = pathOr(null, ['store', 'rawId'], baseProduct);
    // $FlowIgnore
    const baseProductRawID = pathOr(null, ['rawId'], baseProduct);
    let defaultAttributes = null;
    // $FlowIgnore
    const categoryAttributes = pathOr(null, ['getAttributes'], category);
    // $FlowIgnore
    const baseProductAttributes = pathOr(
      null,
      ['category', 'getAttributes'],
      baseProduct,
    );
    if (categoryAttributes && !isEmpty(categoryAttributes)) {
      defaultAttributes = categoryAttributes;
    }
    if (baseProductAttributes && !isEmpty(baseProductAttributes)) {
      defaultAttributes = baseProductAttributes;
    }

    const {
      photos,
      photoMain,
      price,
      cashback,
      discount,
      attributeValues,
      preOrder,
      preOrderDays,
    } = form;

    return (
      <div styleName="container">
        {!variantForForm && (
          <div>
            {baseProduct && (
              <div
                styleName={classNames('status', {
                  draft: status === 'DRAFT',
                  moderation: status === 'MODERATION',
                  decline: status === 'DECLINE',
                  published: status === 'PUBLISHED',
                })}
              >
                {status}
              </div>
            )}
            <div styleName="form">
              <div styleName="title">
                <strong>Product photos</strong>
              </div>
              <Photos
                photos={photos}
                photoMain={photoMain}
                onAddMainPhoto={this.handleAddMainPhoto}
                onAddPhoto={this.handleAddPhoto}
                onRemovePhoto={this.handleRemovePhoto}
              />
              <div styleName="title titleGeneral">
                <strong>General settings</strong>
              </div>
              <div styleName="formItem">
                {this.renderInput({
                  id: 'name',
                  label: 'Product name',
                  limit: 50,
                  required: true,
                })}
              </div>
              <div styleName="formItem textArea">
                {this.renderTextarea({
                  id: 'shortDescription',
                  label: 'Short description',
                  required: true,
                })}
              </div>
              <div styleName="formItem textArea">
                {this.renderTextarea({
                  id: 'longDescription',
                  label: 'Long description',
                  required: true,
                })}
              </div>
              <div styleName="formItem">
                <Select
                  forForm
                  label="Currency"
                  activeItem={currency}
                  items={currencies}
                  onSelect={this.handleOnSelectCurrency}
                  dataTest="productCurrencySelect"
                  fullWidth
                />
              </div>
              <div styleName="formItem">
                {this.renderInput({
                  id: 'vendorCode',
                  label: 'Vendor code',
                  limit: 50,
                  required: true,
                })}
              </div>
              <div styleName="formItem">
                {this.renderInput({
                  id: 'seoTitle',
                  label: 'SEO title',
                  limit: 50,
                })}
              </div>
              <div styleName="formItem textArea">
                {this.renderTextarea({
                  id: 'seoDescription',
                  label: 'SEO description',
                })}
              </div>
              <div styleName="categorySelector">
                <CategorySelector
                  id="categoryId"
                  onlyView={Boolean(baseProduct)}
                  categories={this.props.categories}
                  category={baseProduct && baseProduct.category}
                  onSelect={itemId => {
                    this.handleSelectedCategory(itemId);
                  }}
                />
                {formErrors &&
                  formErrors.categoryId && (
                    <div styleName="categoryError">{formErrors.categoryId}</div>
                  )}
              </div>
              <div styleName="title titlePricing">
                <strong>PRICING</strong>
              </div>
              <div styleName="formItem">
                <InputPrice
                  id="price"
                  required
                  label="Price"
                  onChangePrice={this.handlePriceChange}
                  price={parseFloat(price) || 0}
                  currency={
                    baseProduct
                      ? {
                          id: baseProduct.currency,
                          label: baseProduct.currency,
                        }
                      : currency
                  }
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
              {defaultAttributes &&
                !isEmpty(defaultAttributes) &&
                (!baseProduct ||
                  (!isEmpty(customAttributes) && baseProduct)) && (
                  <Fragment>
                    <div styleName="title titleCharacteriscics">
                      <strong>Characteriscics</strong>
                    </div>
                    <div styleName="formItem additionalAttributes">
                      <AdditionalAttributes
                        onlyView={Boolean(baseProduct)}
                        // $FlowIgnore
                        attributes={defaultAttributes}
                        customAttributes={customAttributes}
                        onCreateAttribute={onCreateAttribute}
                        onRemoveAttribute={onRemoveAttribute}
                      />
                    </div>
                  </Fragment>
                )}
              {!isEmpty(customAttributes) && (
                <div styleName="characteristics">
                  <Characteristics
                    customAttributes={customAttributes}
                    values={attributeValues || []}
                    onChange={this.handleChangeValues}
                    errors={(formErrors && formErrors.attributes) || null}
                  />
                </div>
              )}
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
              <div styleName="warehouses">
                {mainVariant && <Warehouses stocks={mainVariant.stocks} />}
              </div>
              <div styleName="button">
                <Button
                  big
                  fullWidth
                  onClick={() => {
                    this.handleSave();
                  }}
                  dataTest="saveProductButton"
                  isLoading={isLoading}
                >
                  {baseProduct ? 'Update product' : 'Create product'}
                </Button>
              </div>
            </div>
            <div id="tabs" styleName="tabs">
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onChangeTab={this.handleChangeTab}
              >
                <div styleName="tabsWrap">
                  <div
                    styleName={classNames('variants', {
                      hidden: activeTab !== 'variants',
                    })}
                  >
                    {!restVariants && (
                      <div styleName="noVariants">
                        <div styleName="variantsIcon">
                          <Icon type="addVariant" size={80} />
                        </div>
                        <div styleName="variantsText">
                          Currently you have no variants for you product.<br />
                          Add variants if you need some.
                        </div>
                        <div styleName="variantsButton">
                          <Button
                            big
                            wireframe
                            fullWidth
                            onClick={
                              baseProduct
                                ? this.addNewVariant
                                : () => {
                                    this.handleSave(true);
                                  }
                            }
                            dataTest="addVariantButton"
                          >
                            Add variant
                          </Button>
                        </div>
                        {!baseProduct && (
                          <div styleName="variantsWarnText">
                            You can’t add variant until create and save base
                            product.
                          </div>
                        )}
                      </div>
                    )}
                    {restVariants &&
                      baseProduct && (
                        <div styleName="isVariants">
                          <Variants
                            variants={restVariants}
                            productId={baseProduct.id}
                            environment={environment}
                            onExpandClick={this.expandClick}
                            showAlert={showAlert}
                          />
                          <div styleName="variantsButton">
                            <Button
                              big
                              wireframe
                              fullWidth
                              onClick={this.addNewVariant}
                              dataTest="addVariantButton"
                            >
                              Add variant
                            </Button>
                          </div>
                        </div>
                      )}
                  </div>
                  <div
                    styleName={classNames('delivery', {
                      hidden: activeTab !== 'delivery',
                    })}
                  >
                    {!isLoadingPackages && (
                      <Fragment>
                        <Shipping
                          currency={currency}
                          baseProduct={baseProduct}
                          baseProductId={baseProductRawID}
                          storeId={storeRawID}
                          availablePackages={availablePackages}
                          onChangeShipping={onChangeShipping}
                          shippingErrors={shippingErrors}
                        />
                        <div styleName="deliveryButton">
                          <Button
                            big
                            fullWidth
                            onClick={
                              baseProduct
                                ? () => {
                                    this.handleSaveShipping(true);
                                  }
                                : () => {
                                    this.handleSave();
                                  }
                            }
                            dataTest="saveShippingButton"
                            isLoading={
                              !baseProduct ? isLoading : isLoadingShipping
                            }
                          >
                            Save
                          </Button>
                        </div>
                      </Fragment>
                    )}
                    {isLoadingPackages && (
                      <div styleName="spinner">
                        <SpinnerCircle
                          additionalStyles={{}}
                          containerStyles={{}}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Tabs>
            </div>
          </div>
        )}
        {variantForForm &&
          baseProduct && (
            <div className="variantForm">
              <VariantForm
                cancelVariantForm={this.cancelVariantForm}
                customAttributes={customAttributes}
                mainVariant={mainVariant}
                variant={variantForForm}
                showAlert={showAlert}
                environment={environment}
                productId={baseProduct.id}
                productRawId={baseProduct.rawId}
                currency={currency}
              />
            </div>
          )}
      </div>
    );
  }
}

// $FlowIgnoreMe
export default withErrorBoundary(withShowAlert(Form));
