// @flow

import React, { Component, Fragment } from 'react';
import {
  assocPath,
  prop,
  propOr,
  isEmpty,
  omit,
  whereEq,
  pathOr,
  map,
  assoc,
  dissoc,
  prepend,
  filter,
  keys,
  head,
  find,
  reject,
  append,
  isNil,
  contains,
  propEq,
  drop,
  length,
  reverse,
} from 'ramda';
import { validate } from '@storiqa/shared';
import classNames from 'classnames';

import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { Select, SpinnerCircle, Button, InputPrice, Checkbox } from 'components/common';
import { CategorySelector } from 'components/CategorySelector';
import { Icon } from 'components/Icon';
import { Textarea } from 'components/common/Textarea';
import { Input } from 'components/common/Input';
import { withShowAlert } from 'components/App/AlertContext';
import { renameKeys } from 'utils/ramda';
import { getNameText, findCategory, convertCurrenciesForSelect } from 'utils';
import smoothscroll from 'libs/smoothscroll';

import type { SelectItemType } from 'types';
import type { AddAlertInputType } from 'components/App/AlertContext';

import { ProductFormContext, AdditionalAttributes } from './index';
import { Shipping } from './Shipping';
import type { AvailablePackagesType, FullShippingType } from './Shipping/types';

import Variants from './Variants/Variants';
import Photos from './Photos/Photos';
import Warehouses from './Warehouses/Warehouses';
import Tabs from './Tabs/Tabs';
import Characteristics from './Characteristics/Characteristics';
import VariantForm from './VariantForm/VariantForm';

import './Product.scss';

type AttributeType = {
  id: string,
  rawId: number,
  name: {
    lang: string,
    text: string,
  },
};

type AttributeValueType = {
  attrId: number,
  value: string,
  metaField?: ?string,
};

type VariantType = ?{
  productRawId: ?string,
  vendorCode?: string,
  price?: number,
  cashback?: ?number,
  mainPhoto?: ?string,
  photos?: Array<string>,
  attributeValues?: Array<AttributeValueType>,
};

type LangTextType = Array<{
  lang: string,
  text: string,
}>;

type BaseProductType = {
  id: string,
  rawId: number,
  name: LangTextType,
  shortDescription: LangTextType,
  longDescription: LangTextType,
  seoTitle: LangTextType,
  seoDescription: LangTextType,
  category: ?{
    id: string,
    rawId: number,
    getAttributes: ?Array<*>,
  },
  status: string,
  currencyId: number,
  store: {
    rawId: number,
  },
  currency: string,
  products: any,
};

type ValueForAttributeInputType = {
  attr: any,
  variant: any,
};

type PropsType = {
  baseProduct: ?BaseProductType,
  onSave: Function,
  validationErrors: {
    [string]: Array<string>,
  },
  variantFormErrors: {
    [string]: Array<string>,
  },
  categories: Array<{}>,
  isLoading: boolean,
  comeResponse: boolean,
  resetComeResponse: () => void,
  currencies: Array<string>,
  availablePackages: ?AvailablePackagesType,
  isLoadingPackages: boolean,
  onChangeVariantForm: (variantData: ?VariantType) => void,
  variantData: VariantType,
  closedVariantFormAnnunciator: boolean,
  onChangeShipping: (shippingData: ?FullShippingType) => void,
  shippingData: ?FullShippingType,
  resetVariantFormErrors: (field: string) => void,

  customAttributes: Array<AttributeType>,
  onCreateAttribute: (attribute: AttributeType) => void,
  onRemoveAttribute: (id: string) => void,
  onResetAttribute: () => void,

  showAlert: (input: AddAlertInputType) => void,
};

type StateType = {
  form: {
    name: string,
    seoTitle: string,
    seoDescription: string,
    shortDescription: string,
    longDescription: string,
    currency: ?SelectItemType,
    categoryId: ?number,

    idMainVariant: ?string,
    rawIdMainVariant: ?number,
    photoMain: ?string,
    photos: ?Array<string>,
    vendorCode: ?string,
    price: ?number,
    cashback: ?number,
    discount: ?number,
    preOrderDays: string,
    preOrder: boolean,
    attributeValues: Array<AttributeValueType>,
  },
  formErrors: {
    [string]: Array<string>,
  },
  shippingErrors: ?{
    local?: string,
    inter?: string,
  },
  variantFormErrors: {
    [string]: Array<string>,
  },
  category: ?{
    id: string,
    rawId: number,
    getAttributes: ?Array<*>,
  },
  currencies: Array<SelectItemType>,
  variantFormErrors: {
    vendorCode?: Array<string>,
    price?: Array<string>,
    attributes?: Array<string>,
  },
  scrollArr: Array<string>,
  activeTab: string,
  tabs: Array<{
    id: string,
    label: string,
  }>,
  variantForForm: ?any,
};

class Form extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { baseProduct, currencies, customAttributes } = props;
    // $FlowIgnore
    const currency = pathOr('STQ', ['baseProduct', 'currency'], props);
    let form = {};

    if (baseProduct) {
      // $FlowIgnore
      const allVariants = pathOr([], ['products', 'edges'], baseProduct);
      const filteredVariants = reverse(map(item => item.node, allVariants));
      const mainVariant = head(filteredVariants);

      form = {
        name: getNameText(baseProduct.name || [], 'EN') || '',
        shortDescription:
          getNameText(baseProduct.shortDescription || [], 'EN') || '',
        longDescription:
          getNameText(baseProduct.longDescription || [], 'EN') || '',
        seoTitle: getNameText(baseProduct.seoTitle || [], 'EN') || '',
        seoDescription:
          getNameText(baseProduct.seoDescription || [], 'EN') || '',
        categoryId: baseProduct.category ? baseProduct.category.rawId : null,

        idMainVariant: mainVariant.id,
        rawIdMainVariant: mainVariant.rawId,
        photoMain: mainVariant.photoMain,
        photos: mainVariant.additionalPhotos || [],
        vendorCode: mainVariant.vendorCode,
        price: mainVariant.price,
        cashback: Math.round((mainVariant.cashback || 0) * 100),
        discount: Math.round((mainVariant.discount || 0) * 100),
        preOrderDays: mainVariant.preOrderDays,
        preOrder: mainVariant.preOrder,
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
        vendorCode: null,
        price: null,
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
      variantFormErrors: {},
      shippingErrors: null,
      scrollArr: [
        'name',
        'shortDescription',
        'longDescription',
        'categoryId',
        'vendorCode',
        'price',
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
      variantForForm: null,
    };
  }

  componentWillReceiveProps(nextProps: PropsType) {
    const currentFormErrors = this.state.formErrors;
    const nextFormErrors = nextProps.validationErrors;
    if (isEmpty(currentFormErrors) && !isEmpty(nextFormErrors)) {
      const formErrors = renameKeys(
        {
          long_description: 'longDescription',
          short_description: 'shortDescription',
          seo_title: 'seoTitle',
          seo_description: 'seoDescription',
        },
        nextFormErrors,
      );
      this.setState({ formErrors });
    }
  }

  componentDidUpdate(prevProps: PropsType) {
    const { shippingData, variantFormErrors, customAttributes } = this.props;
    if (
      JSON.stringify(shippingData) !== JSON.stringify(prevProps.shippingData)
    ) {
      this.resetShippingErrors();
    }
    if (
      JSON.stringify(variantFormErrors) !==
      JSON.stringify(prevProps.variantFormErrors)
    ) {
      this.setVariantFormErrors(
        renameKeys({ vendor_code: 'vendorCode' }, variantFormErrors),
      );
    }

    if (
      JSON.stringify(prevProps.customAttributes) !==
      JSON.stringify(customAttributes)
    ) {
      const attrValues = this.resetAttrValues(customAttributes);
      this.onChangeValues(attrValues);
    }
  }

  onChangeValues = (values: Array<AttributeValueType>) => {
    this.setState((prevState: StateType) =>
      assocPath(['form', 'attributeValues'], values, prevState),
    );
  };

  setVariantFormErrors = (errors: { [string]: Array<string> }) => {
    this.setState({ variantFormErrors: errors });
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
      const { scrollArr } = this.state;
      const oneArr = filter(
        item => contains(item, keys(errors)),
        scrollArr,
      );
      smoothscroll.scrollTo(head(oneArr));
    }
    return errors;
  };

  variantValidate = () => {
    const { errors } = validate(
      {
        vendorCode: [[val => !isEmpty(val || ''), 'Vendor code is required']],
        price: [[val => !isEmpty(val || ''), 'Price is required']],
      },
      this.props.variantData || {},
    );
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
    return shippingErrors;
  };

  handleSave = () => {
    const { variantData } = this.props;
    const { form, currency } = this.state;
    this.setState({
      formErrors: {},
      variantFormErrors: {},
      shippingErrors: null,
    });
    const preValidationErrors = this.validate();
    // const preVariantValidationErrors = this.variantValidate();
    // const shippingValidationErrors = this.shippingValidate();
    if (
      preValidationErrors
      // preVariantValidationErrors ||
      // shippingValidationErrors
    ) {
      this.setState({
        formErrors: preValidationErrors || {},
        // variantFormErrors: preVariantValidationErrors || {},
        // shippingErrors: shippingValidationErrors || null,
      });
      return;
    }
    this.props.onSave({ ...form, currency }, variantData);
  };

  handleInputChange = (id: string) => (e: any) => {
    this.setState({ formErrors: omit([id], this.state.formErrors) });
    const { value } = e.target;
    if (value.length <= 50) {
      this.setState((prevState: StateType) =>
        assocPath(['form', id], value.replace(/\s\s/, ' '), prevState),
      );
    }
  };

  handleTextareaChange = (id: string) => (e: any) => {
    this.setState({ formErrors: omit([id], this.state.formErrors) });
    const { value } = e.target;
    this.setState((prevState: StateType) =>
      assocPath(['form', id], value.replace(/\s\s/, ' '), prevState),
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
    return (
      <Textarea
        id={id}
        value={prop(id, this.state.form) || ''}
        label={required ? requiredLabel : label}
        onChange={this.handleTextareaChange(id)}
        errors={propOr(null, id, this.state.formErrors)}
        fullWidth
      />
    );
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
    return (
      <Input
        id={id}
        value={prop(id, this.state.form) || ''}
        label={requiredLabel}
        onChange={this.handleInputChange(id)}
        errors={propOr(null, id, this.state.formErrors)}
        limit={limit}
        fullWidth
      />
    );
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
        assocPath(['form', id], 99, prevState),
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
    this.setState((prevState: StateType) =>
      assocPath(['form', 'attributeValues'], values, prevState),
    );
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
      this.setState((prevState: StateType) => assocPath(['form', 'preOrderDays'], '', assocPath(['form', 'preOrder'], false, prevState)));
    }
  };

  handleOnChangePreOrder = () => {
    this.setState((prevState: StateType) =>
      assocPath(['form', 'preOrder'], !prevState.form.preOrder, prevState),
    );
    if (this.preOrderDaysInput && !this.state.form.preOrder && !this.state.form.preOrderDays) {
      this.preOrderDaysInput.focus();
    }
  };

  handleChangeTab = (activeTab: string) => {
    this.setState({ activeTab });
  };

  addNewVariant = () => {
    this.setState({ variantForForm: {} });
  };

  cancelVariantForm = () => {
    this.setState({ variantForForm: null }, () => {smoothscroll.scrollTo('tabs', () => {}, true)});
  };

  expandClick = (id: number) => {
    // $FlowIgnore
    const variants = pathOr([], ['products', 'edges'], this.props.baseProduct);
    const filteredVariants = map(item => item.node, variants);
    const variant = find(propEq('rawId', id))(filteredVariants);
    this.setState({ variantForForm: variant || {} });
  };

  render() {
    const {
      isLoading,
      baseProduct,
      comeResponse,
      resetComeResponse,
      availablePackages,
      isLoadingPackages,
      onChangeVariantForm,
      closedVariantFormAnnunciator,
      onChangeShipping,
      resetVariantFormErrors,
      onCreateAttribute,
      onRemoveAttribute,
      customAttributes,
      showAlert,
      environment,
    } = this.props;
    const {
      category,
      currencies,
      currency,
      variantFormErrors,
      shippingErrors,
      formErrors,
      form,
      activeTab,
      tabs,
      variantForForm,
    } = this.state;
    //

    console.log('---variantForForm', variantForForm);

    const status = baseProduct ? baseProduct.status : 'Draft';
    // $FlowIgnore
    const variants = pathOr([], ['products', 'edges'], baseProduct);
    const filteredVariants = reverse(map(item => item.node, variants));
    // $FlowIgnore
    const mainVariant = isEmpty(filteredVariants)
      ? null
      : head(filteredVariants);
    // $FlowIgnore
    const restVariants = !isEmpty(filteredVariants) && length(filteredVariants) > 1
      ? drop(1, filteredVariants)
      : null;
    // $FlowIgnore
    const storeID = pathOr(null, ['store', 'id'], baseProduct);
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

    console.log('---defaultAttributes', defaultAttributes);

    return (
      <ProductFormContext.Provider
        value={{
          isLoading,
          handleSaveBaseProductWithVariant: this.handleSave,
          onChangeVariantForm,
          variantFormErrors,
          // $FlowIgnore
          resetVariantFormErrors,
        }}
      >
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
                <div styleName="title">
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
                      <div styleName="categoryError">
                        {formErrors.categoryId}
                      </div>
                    )}
                </div>
                <div styleName="title">
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
                {defaultAttributes && !isEmpty(defaultAttributes) && (
                  (!baseProduct) || (!isEmpty(customAttributes) && baseProduct)
                ) && (
                    <Fragment>
                      <div styleName="title">
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
                  <div styleName="formItem additionalAttributes">
                    <Characteristics
                      customAttributes={customAttributes}
                      values={attributeValues || []}
                      onChange={this.handleChangeValues}
                      errors={(formErrors && formErrors.attributes) || null}
                    />
                  </div>
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
                  {mainVariant && <Warehouses stocks={mainVariant.stocks} />}
                </div>
                <div styleName="button">
                  <Button
                    big
                    fullWidth
                    onClick={this.handleSave}
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
                      {!restVariants &&
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
                                baseProduct ? this.addNewVariant : this.handleSave
                              }
                              dataTest="addVariantButton"
                            >
                              Add variant
                            </Button>
                          </div>
                          <div styleName="variantsWarnText">
                            You can’t add variant until create and save base
                            product.
                          </div>
                        </div>
                      }
                      {restVariants && baseProduct &&
                        <div styleName="isVariants">
                          <Variants
                            variants={restVariants}
                            productId={baseProduct.id}
                            environment={environment}
                            onExpandClick={this.expandClick}
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
                      }
                    </div>
                    <div
                      styleName={classNames('delivery', {
                        hidden: activeTab !== 'delivery',
                      })}
                    >
                      Delivery
                    </div>
                  </div>
                </Tabs>
              </div>
              {/* !baseProduct && (
                <Variants
                  variants={[]}
                  category={category}
                  comeResponse={comeResponse}
                  resetComeResponse={resetComeResponse}
                  closedVariantFormAnnunciator={closedVariantFormAnnunciator}
                  customAttributes={customAttributes}
                />
              ) */}

              {/* baseProduct && (
              <Variants
                productRawId={baseProduct.rawId}
                productId={baseProduct.id}
                category={baseProduct.category}
                variants={filteredVariants}
                storeID={storeID}
                comeResponse={comeResponse}
                resetComeResponse={resetComeResponse}
                closedVariantFormAnnunciator={closedVariantFormAnnunciator}
                customAttributes={customAttributes}
              />
            ) */}
              {/* !isLoadingPackages &&
              (category || baseProduct) && (
                <Shipping
                  currency={currency}
                  baseProduct={baseProduct}
                  baseProductId={baseProductRawID}
                  storeId={storeRawID}
                  availablePackages={availablePackages}
                  onChangeShipping={onChangeShipping}
                  shippingErrors={shippingErrors}
                />
              ) */}
              {/* isLoadingPackages && (
              <div styleName="spinner">
                <SpinnerCircle />
              </div>
            ) */}
            </div>
          )}
          {variantForForm && baseProduct && (
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
              />
            </div>
          )}
        </div>
      </ProductFormContext.Provider>
    );
  }
}

// $FlowIgnoreMe
export default withErrorBoundary(withShowAlert(Form));
