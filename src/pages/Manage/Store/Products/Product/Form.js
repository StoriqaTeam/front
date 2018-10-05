// @flow

import React, { Component } from 'react';
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
} from 'ramda';
import { validate } from '@storiqa/shared';
import classNames from 'classnames';

import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { Select, SpinnerCircle, Button } from 'components/common';
import { CategorySelector } from 'components/CategorySelector';
import { Textarea } from 'components/common/Textarea';
import { Input } from 'components/common/Input';
import { renameKeys } from 'utils/ramda';
import { getNameText, findCategory, convertCurrenciesForSelect } from 'utils';

import type { SelectItemType } from 'types';

import { ProductFormContext, AdditionalAttributes } from './index';
import { Shipping } from './Shipping';
import type { AvailablePackagesType, FullShippingType } from './Shipping/types';

import Variants from './Variants/Variants';

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
  customAttributes: Array<AttributeType>,
  status: string,
  currencyId: number,
  store: {
    rawId: number,
  },
};

type PropsType = {
  baseProduct: ?BaseProductType,
  onSave: Function,
  validationErrors: ?{},
  categories: Array<{}>,
  isLoading: boolean,
  comeResponse: boolean,
  resetComeResponse: () => void,
  currencies: Array<string>,
  availablePackages: ?AvailablePackagesType,
  isLoadingPackages: boolean,
  isLoadingAttributes: boolean,
  onChangeVariantForm: (variantData: ?VariantType) => void,
  variantData: VariantType,
  closedVariantFormAnnunciator: boolean,
  onChangeShipping: (shippingData: ?FullShippingType) => void,
  shippingData: ?FullShippingType,
  attributes: Array<AttributeType>,
  onCreateAttribute: (attributeId: number) => void,
  onDeleteAttribute: (attributeId: number) => void,
};

type StateType = {
  form: {
    name: string,
    shortDescription: string,
    longDescription: string,
    seoTitle: string,
    seoDescription: string,
    categoryId: ?number,
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
    getAttributes: ?Array<AttributeType>,
  },
  currencies: Array<SelectItemType>,
  currency: ?SelectItemType,
  variantFormErrors: {
    vendorCode?: Array<string>,
    price?: Array<string>,
    attributes?: Array<string>,
  },
};

class Form extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { baseProduct, currencies } = props;
    // $FlowIgnore
    const currency = pathOr('STQ', ['baseProduct', 'currency'], props);
    let form = {};
    if (baseProduct) {
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
      };
    } else {
      form = {
        name: '',
        shortDescription: '',
        longDescription: '',
        seoTitle: '',
        seoDescription: '',
        categoryId: null,
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
    const { shippingData } = this.props;
    if (
      JSON.stringify(shippingData) !== JSON.stringify(prevProps.shippingData)
    ) {
      this.resetShippingErrors();
    }
  }

  resetShippingErrors = () => {
    this.setState({ shippingErrors: null });
  };

  validate = () => {
    // TODO: вынести спеки
    const { errors } = validate(
      {
        name: [[val => !isEmpty(val), 'Name must not be empty']],
        shortDescription: [
          [val => !isEmpty(val), 'Short description must not be empty'],
        ],
        longDescription: [
          [val => !isEmpty(val), 'Long description must not be empty'],
        ],
        categoryId: [[val => val, 'Select a category']],
      },
      this.state.form,
    );
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
    const preVariantValidationErrors = this.variantValidate();
    const shippingValidationErrors = this.shippingValidate();
    if (
      preValidationErrors ||
      preVariantValidationErrors ||
      shippingValidationErrors
    ) {
      this.setState({
        formErrors: preValidationErrors || {},
        variantFormErrors: preVariantValidationErrors || {},
        shippingErrors: shippingValidationErrors || null,
      });
      return;
    }
    this.props.onSave(
      { ...form, currencyId: currency ? Number(currency.id) : null },
      variantData,
    );
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
    const { categories } = this.props;
    const category = findCategory(
      whereEq({ rawId: parseInt(categoryId, 10) }),
      categories,
    );
    this.setState((prevState: StateType) => ({
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
    }));
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
    const requiredLabel = (
      <span>
        {label} <span styleName="asterisk">*</span>
      </span>
    );
    return (
      <Input
        id={id}
        value={prop(id, this.state.form) || ''}
        label={required ? requiredLabel : label}
        onChange={this.handleInputChange(id)}
        errors={propOr(null, id, this.state.formErrors)}
        limit={limit}
        fullWidth
      />
    );
  };

  render() {
    const {
      isLoading,
      baseProduct,
      comeResponse,
      resetComeResponse,
      availablePackages,
      isLoadingPackages,
      isLoadingAttributes,
      onChangeVariantForm,
      closedVariantFormAnnunciator,
      onChangeShipping,
      attributes,
      onCreateAttribute,
      onDeleteAttribute,
    } = this.props;
    const {
      category,
      currencies,
      currency,
      variantFormErrors,
      shippingErrors,
      formErrors,
    } = this.state;
    const status = baseProduct ? baseProduct.status : 'Draft';
    // $FlowIgnore
    const variants = pathOr([], ['products', 'edges'], baseProduct);
    const filteredVariants = map(item => item.node, variants);
    // $FlowIgnore
    const storeID = pathOr(null, ['store', 'id'], baseProduct);
    // $FlowIgnore
    const storeRawID = pathOr(null, ['store', 'rawId'], baseProduct);
    // $FlowIgnore
    const baseProductRawID = pathOr(null, ['rawId'], baseProduct);
    // $FlowIgnore
    const categoryAttributes = pathOr(
      [],
      ['category', 'getAttributes'],
      this.state,
    );
    // $FlowIgnore
    const baseProductCategoryAttributes = pathOr(
      [],
      ['baseProduct', 'category', 'getAttributes'],
      this.props,
    );
    // $FlowIgnore
    const customAttributes = pathOr(
      [],
      ['baseProduct', 'customAttributes'],
      this.props,
    );
    return (
      <ProductFormContext.Provider
        value={{
          isLoading,
          handleSaveBaseProductWithVariant: this.handleSave,
          onChangeVariantForm,
          variantFormErrors,
        }}
      >
        <div styleName="container">
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
            <div styleName="categorySelector">
              <CategorySelector
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
            {baseProduct &&
              baseProduct.category &&
              !isLoadingAttributes && (
                <div styleName="formItem additionalAttributes">
                  <AdditionalAttributes
                    customAttributes={customAttributes}
                    attributes={attributes}
                    categoryAttributes={categoryAttributes}
                    baseProductCategoryAttributes={
                      baseProductCategoryAttributes
                    }
                    onCreateAttribute={onCreateAttribute}
                    onDeleteAttribute={onDeleteAttribute}
                  />
                </div>
              )}
            {baseProduct &&
              baseProduct.category &&
              isLoadingAttributes && (
                <div styleName="spinner">
                  <SpinnerCircle />
                </div>
              )}
          </div>
          {category &&
            !baseProduct && (
              <Variants
                variants={[]}
                category={category}
                comeResponse={comeResponse}
                resetComeResponse={resetComeResponse}
                closedVariantFormAnnunciator={closedVariantFormAnnunciator}
              />
            )}

          {baseProduct && (
            <Variants
              productRawId={baseProduct.rawId}
              productId={baseProduct.id}
              category={category || baseProduct.category}
              customAttributes={baseProduct.customAttributes}
              variants={filteredVariants}
              storeID={storeID}
              comeResponse={comeResponse}
              resetComeResponse={resetComeResponse}
              closedVariantFormAnnunciator={closedVariantFormAnnunciator}
            />
          )}
          {!isLoadingPackages &&
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
            )}
          {isLoadingPackages && (
            <div styleName="spinner">
              <SpinnerCircle />
            </div>
          )}
          {
            <div styleName="button">
              <Button
                big
                fullWidth
                onClick={this.handleSave}
                dataTest="saveProductButton"
                isLoading={isLoading}
              >
                Save
              </Button>
            </div>
          }
        </div>
      </ProductFormContext.Provider>
    );
  }
}

// $FlowIgnoreMe
export default withErrorBoundary(Form);
