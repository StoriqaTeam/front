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
  find,
  propEq,
} from 'ramda';
import { validate } from '@storiqa/shared';
import classNames from 'classnames';

import { AppContext } from 'components/App';
import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { Select } from 'components/common';
import { Button } from 'components/common/Button';
import { CategorySelector } from 'components/CategorySelector';
import { Textarea } from 'components/common/Textarea';
import { Input } from 'components/common/Input';
import { renameKeys } from 'utils/ramda';
import { getNameText, findCategory, convertCurrenciesForSelect } from 'utils';

import type { CurrenciesType, SelectType } from 'types';

import { ProductFormContext, LocalShipping, InterShipping } from './index';

import Variants from './Variants/Variants';

import './Product.scss';

const currenciesFromBack = [
  { key: 1, name: 'rouble', alias: 'RUB' },
  { key: 2, name: 'euro', alias: 'EUR' },
  { key: 3, name: 'dollar', alias: 'USD' },
  { key: 4, name: 'bitcoin', alias: 'BTC' },
  { key: 5, name: 'etherium', alias: 'ETH' },
  { key: 6, name: 'stq', alias: 'STQ' },
];

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
};

type PropsType = {
  baseProduct: ?BaseProductType,
  onSave: Function,
  validationErrors: ?{},
  categories: Array<{}>,
  isLoading: boolean,
  comeResponse: boolean,
  resetComeResponse: () => void,
  currencies: CurrenciesType,
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
  category: ?{
    id: string,
    rawId: number,
    getAttributes: ?Array<*>,
  },
  currencies: Array<SelectType>,
  currency: SelectType,
};

class Form extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { baseProduct, currencies } = this.props;
    // $FlowIgnore
    const currencyId = pathOr(6, ['baseProduct', 'currencyId'], props);
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
      currencies: convertCurrenciesForSelect(currenciesFromBack),
      currency: find(propEq('id', `${currencyId}`))(
        convertCurrenciesForSelect(currenciesFromBack),
      ),
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
      },
      this.state.form,
    );
    return errors;
  };

  handleSave = (props: { variantData: VariantType, isCanCreate: boolean }) => {
    const { form, currency } = this.state;
    const { variantData, isCanCreate } = props;
    this.setState({ formErrors: {} });
    const preValidationErrors = this.validate();
    if (preValidationErrors) {
      this.setState({
        formErrors: preValidationErrors,
      });
      return;
    }
    if (!isCanCreate) {
      return;
    }
    this.props.onSave(
      { ...form, currencyId: Number(currency.id) },
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
    this.setState({
      form: {
        ...this.state.form,
        categoryId,
      },
      category: {
        id: category.id,
        rawId: category.rawId,
        getAttributes: category.getAttributes,
      },
    });
  };

  handleOnSelectCurrency = (currency: SelectType) => {
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
    } = this.props;
    const { category, currencies, currency } = this.state;
    console.log('---currencies, currency', currencies, currency);
    const status = baseProduct ? baseProduct.status : 'Draft';
    const currencyId = baseProduct ? baseProduct.currencyId : 6;
    // $FlowIgnore
    const variants = pathOr([], ['products', 'edges'], baseProduct);
    const filteredVariants = map(item => item.node, variants);
    // $FlowIgnore
    const storeID = pathOr(null, ['store', 'id'], baseProduct);
    return (
      <AppContext.Consumer>
        {({ directories }) => (
          <ProductFormContext.Provider
            value={{
              isLoading,
              handleSaveBaseProductWithVariant: this.handleSave,
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
                    categories={this.props.categories}
                    category={baseProduct && baseProduct.category}
                    onSelect={itemId => {
                      this.handleSelectedCategory(itemId);
                    }}
                  />
                </div>
              </div>
              {category &&
                !baseProduct && (
                  <Variants
                    variants={[]}
                    category={category}
                    comeResponse={comeResponse}
                    resetComeResponse={resetComeResponse}
                  />
                )}

              {baseProduct && (
                <Variants
                  productRawId={baseProduct.rawId}
                  productId={baseProduct.id}
                  category={baseProduct.category}
                  variants={filteredVariants}
                  storeID={storeID}
                  comeResponse={comeResponse}
                  resetComeResponse={resetComeResponse}
                />
              )}
              {baseProduct && (
                <LocalShipping
                  currencies={directories.currencies}
                  currencyId={currencyId}
                />
              )}
              {baseProduct && (
                <InterShipping
                  currencies={directories.currencies}
                  currencyId={currencyId}
                />
              )}
              {baseProduct && (
                <div styleName="button">
                  <Button
                    big
                    fullWidth
                    onClick={() => {
                      this.handleSave({ variantData: null, isCanCreate: true });
                    }}
                    dataTest="saveProductButton"
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>
          </ProductFormContext.Provider>
        )}
      </AppContext.Consumer>
    );
  }
}

// $FlowIgnoreMe
export default withErrorBoundary(Form);
