// @flow

import React, { Component, Fragment } from 'react';
import { routerShape, matchShape, withRouter } from 'found';
import {
  propOr,
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
  // values,
} from 'ramda';
import { validate } from '@storiqa/shared';
import classNames from 'classnames';
import { Environment } from 'relay-runtime';
import { createFragmentContainer, graphql } from 'react-relay';
import debounce from 'lodash.debounce';

import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { Select, SpinnerCircle, Button, InputPrice } from 'components/common';
import { CategorySelector } from 'components/CategorySelector';
import { Icon } from 'components/Icon';
import { Textarea } from 'components/common/Textarea';
import { Input } from 'components/common/Input';
import { withShowAlert } from 'components/Alerts/AlertContext';
import ModerationStatus from 'pages/common/ModerationStatus';
import { Modal } from 'components/Modal';
import { RichEditor } from 'components/RichEditor';

import {
  getNameText,
  findCategory,
  convertCurrenciesForSelect,
  log,
  vendorCodeGenerator,
} from 'utils';
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
  MetricsType,
} from 'pages/Manage/Store/Products/types';
import type { SelectItemType, CategoryType } from 'types';
import type { AddAlertInputType } from 'components/Alerts/AlertContext';

import { Shipping } from '../Shipping';
import Variants from '../Variants';
import Photos from '../Photos';
import Warehouses from '../Warehouses';
import Tabs from '../Tabs';
import Characteristics from '../Characteristics';
import VariantForm from '../VariantForm';
import AdditionalAttributes from '../AdditionalAttributes';
import PreOrder from '../PreOrder';
// import Metrics from '../Metrics';
import sendProductToModerationMutation from '../mutations/SendProductToModerationMutation';

import type {
  AvailablePackagesType,
  FullShippingType,
} from '../Shipping/types';

import '../Product.scss';

import t from './i18n';

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
  allCategories: Array<CategoryType>,
  currencies: Array<string>,
  onChangeShipping: (shippingData: ?FullShippingType) => void,
  onCreateAttribute: (attribute: GetAttributeType) => void,
  onRemoveAttribute: (id: string) => void,
  onResetAttribute: (categoryId?: number) => void,
  onSaveShipping: (onlyShippingSave?: boolean) => void,
  showAlert: (input: AddAlertInputType) => void,
  onFetchPackages?: (metrics: MetricsType) => void,
};

type StateType = {
  activeTab: string,
  category: ?ProductCategoryType,
  currency: SelectItemType,
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
  isSendingToModeration: boolean,
  isShippingPopup: boolean,
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
    const {
      baseProduct,
      currencies,
      customAttributes,
      onFetchPackages,
    } = props;
    let currency = currencies[0];
    let form = {};
    let variantForForm = null;

    if (baseProduct) {
      ({ currency } = baseProduct);
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
        metrics: {
          weightG: baseProduct.weightG || 0,
          widthCm: baseProduct.widthCm || 0,
          lengthCm: baseProduct.lengthCm || 0,
          heightCm: baseProduct.heightCm || 0,
        },
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
        metrics: {
          weightG: 0,
          widthCm: 0,
          lengthCm: 0,
          heightCm: 0,
        },
      };
    }
    this.state = {
      form,
      formErrors: {},
      category: null,
      currency: { id: currency, label: currency },
      shippingErrors: null,
      scrollArr: [
        'name',
        'shortDescription',
        'longDescription',
        'vendorCode',
        'categoryId',
        'attributes',
        'price',
        'metrics',
      ],
      activeTab: 'variants',
      tabs: [
        {
          id: 'variants',
          label: t.labelVariants,
        },
        {
          id: 'delivery',
          label: t.labelDelivery,
        },
      ],
      variantForForm,
      isSendingToModeration: false,
      isShippingPopup: false,
    };
    if (onFetchPackages) {
      this.onFetchPackages = debounce(onFetchPackages, 1000);
    }
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

  onFetchPackages = undefined;

  onChangeValues = (attributeValues: Array<AttributeValueType>) => {
    this.setState((prevState: StateType) =>
      assocPath(['form', 'attributeValues'], attributeValues, prevState),
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
    const { values: attributeValues, translatedValues } = attr.metaField;
    if (attributeValues) {
      return {
        value: head(attributeValues) || '',
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
        name: [[val => Boolean(val), t.nameIsRequired]],
        shortDescription: [[val => Boolean(val), t.shortDescriptionIsRequired]],
        longDescription: [[val => Boolean(val), t.longDescriptionIsRequired]],
        categoryId: [[val => Boolean(val), t.categoryIsRequired]],
        vendorCode: [[val => Boolean(val), t.vendorCodeIsRequired]],
        price: [[val => Boolean(val), t.priceIsRequired]],
        // metrics: [[val => !contains(0, values(val)), t.metricsError]],
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
        t.addAtLeastOneDeliveryServiceOrPickup,
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
        t.addAtLeastOneDeliveryDelivery,
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

  handleUpdateProduct = () => {
    // const { baseProduct } = this.props;
    // if (!baseProduct) {
    //   this.handleSave();
    //   return;
    // }
    // const { form } = this.state;
    // if (
    //   baseProduct.weightG !== form.metrics.weightG ||
    //   baseProduct.widthCm !== form.metrics.widthCm ||
    //   baseProduct.lengthCm !== form.metrics.lengthCm ||
    //   baseProduct.heightCm !== form.metrics.heightCm
    // ) {
    //   this.setState({ isShippingPopup: true });
    //   return;
    // }
    this.handleSave();
  };

  handleSave = (isAddVariant?: boolean, withSavingShipping?: boolean) => {
    const { baseProduct } = this.props;
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
    const savingData = { ...form, currency: currency ? currency.id : null };
    if (baseProduct) {
      this.props.onSave(savingData, withSavingShipping);
      return;
    }
    this.props.onSave(savingData, isAddVariant);
  };

  sendToModeration = () => {
    if (
      this.props.baseProduct != null &&
      this.props.baseProduct.rawId != null
    ) {
      this.setState({ isSendingToModeration: true });
      sendProductToModerationMutation({
        environment: this.props.environment,
        variables: {
          // $FlowIgnoreMe i have no idea why
          id: this.props.baseProduct.rawId,
        },
      })
        .then(() => {
          this.props.showAlert({
            type: 'success',
            text: 'Product has been sent to moderation',
            link: { text: 'Close' },
          });
          return true;
        })
        .finally(() => {
          this.setState({ isSendingToModeration: false });
        })
        .catch(log.error);
    }
  };

  handleInputChange = (id: string) => (e: any) => {
    this.setState({ formErrors: omit([id], this.state.formErrors) });
    const { value } = e.target;
    this.setState((prevState: StateType) =>
      assocPath(['form', id], value, prevState),
    );
  };

  handleTextareaChange = (id: string) => (e: any) => {
    this.setState({ formErrors: omit([id], this.state.formErrors) });
    const { value } = e.target;
    this.setState((prevState: StateType) =>
      assocPath(['form', id], value, prevState),
    );
  };

  handleSelectedCategory = (categoryId: number) => {
    const { allCategories, onResetAttribute } = this.props;
    const category = findCategory(
      whereEq({ rawId: parseInt(categoryId, 10) }),
      allCategories,
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
      () => {
        if (onResetAttribute) {
          onResetAttribute(categoryId);
        }
      },
    );
  };

  handleOnSelectCurrency = (currency: SelectItemType) => {
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

  handleChangeValues = (attributeValues: Array<AttributeValueType>) => {
    this.setState((prevState: StateType) => {
      const formErrors = dissoc('attributes', prevState.formErrors);
      return {
        ...assocPath(['form', 'attributeValues'], attributeValues, prevState),
        formErrors,
      };
    });
  };

  handleChangeTab = (activeTab: string) => {
    this.setState({ activeTab });
  };

  addNewVariant = () => {
    this.setState({ variantForForm: 'new' });
    this.handleChangePathName('new');
  };

  handleCopyVariant = (variant: ProductType) => {
    this.setState(
      {
        variantForForm: { ...variant, vendorCode: vendorCodeGenerator() },
      },
      () => {
        this.handleChangePathName('new');
      },
    );
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

  isSaveAvailable = () => {
    // $FlowIgnoreMe
    const status = pathOr(null, ['baseProduct', 'status'], this.props);
    return status === 'DRAFT' || status === 'DECLINE' || status === 'PUBLISHED';
  };

  handleChangePreOrder = (data: {
    preOrderDays: string,
    preOrder: boolean,
  }) => {
    this.setState((prevState: StateType) => ({
      form: {
        ...prevState.form,
        preOrderDays: data.preOrderDays,
        preOrder: data.preOrder,
      },
    }));
  };

  handleChangeMetrics = (metrics: MetricsType) => {
    this.setState(
      (prevState: StateType) => ({
        form: {
          ...prevState.form,
          metrics,
        },
        formErrors: dissoc('metrics', prevState.formErrors),
      }),
      () => {
        if (this.onFetchPackages) {
          this.onFetchPackages(metrics);
        }
      },
    );
  };

  handleCloseShippingPopup = () => {
    this.setState({ isShippingPopup: false });
  };

  handleLongDescription = longDescription => {
    const { form } = this.state;
    this.setState({
      form: {
        ...form,
        longDescription,
      },
      formErrors: omit(['longDescription'], this.state.formErrors),
    });
  };

  handleError = (error: { message: string }): void => {
    const { showAlert } = this.props;
    showAlert({
      type: 'danger',
      text: error.message,
      link: { text: t.close },
    });
  };

  renderInput = (props: {
    id: string,
    label: string,
    limit?: number,
    required?: boolean,
  }) => {
    const { id, label, limit, required } = props;
    const hereLabel = required ? (
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
        label={hereLabel}
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
    limit?: number,
    required?: boolean,
  }) => {
    const { id, label, required, limit } = props;
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
        limit={limit}
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
      currencies,
    } = this.props;
    const {
      category,
      currency,
      shippingErrors,
      formErrors,
      form,
      activeTab,
      tabs,
      variantForForm,
      isSendingToModeration,
      isShippingPopup,
    } = this.state;

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
    const categoryEquality =
      !isNil(baseProduct) && baseProduct.category.rawId === form.categoryId;
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
    if (
      baseProductAttributes &&
      !isEmpty(baseProductAttributes) &&
      categoryEquality
    ) {
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
      // metrics,
    } = form;

    const longDescriptionError = propOr(
      null,
      'longDescription',
      this.state.formErrors,
    );
    return (
      <div styleName="container">
        {!variantForForm && (
          <div>
            {baseProduct && (
              <div styleName="status">
                <ModerationStatus
                  status={baseProduct.status}
                  dataTest={`productStatus_${baseProduct.status}`}
                />
              </div>
            )}
            <div styleName="form">
              <div styleName="title">
                <strong>{t.productPhotos}</strong>
              </div>
              <Photos
                photos={photos}
                photoMain={photoMain}
                onAddMainPhoto={this.handleAddMainPhoto}
                onAddPhoto={this.handleAddPhoto}
                onRemovePhoto={this.handleRemovePhoto}
              />
              <div styleName="title titleGeneral">
                <strong>{t.generalSettings}</strong>
              </div>
              <div styleName="formItem">
                {this.renderInput({
                  id: 'name',
                  label: t.labelProductName,
                  limit: 150,
                  required: true,
                })}
              </div>
              <div styleName="formItem textArea">
                {this.renderTextarea({
                  id: 'shortDescription',
                  label: t.labelShortDescription,
                  limit: 170,
                  required: true,
                })}
              </div>
              <div styleName="editor">
                <span id="longDescription" styleName="label">
                  {t.labelLongDescription} <span styleName="asterisk">*</span>
                </span>
                <RichEditor
                  content={this.state.form.longDescription}
                  onChange={this.handleLongDescription}
                  onError={this.handleError}
                />
                {longDescriptionError && (
                  <div styleName="error">
                    {this.state.formErrors.longDescription[0]}
                  </div>
                )}
              </div>
              <div styleName="formItem">
                <Select
                  forForm
                  label={t.labelCurrency}
                  activeItem={currency}
                  items={convertCurrenciesForSelect(currencies)}
                  onSelect={this.handleOnSelectCurrency}
                  dataTest="productCurrencySelect"
                  fullWidth
                />
              </div>
              <div styleName="formItem">
                {this.renderInput({
                  id: 'vendorCode',
                  label: t.labelVendorCode,
                  limit: 50,
                  required: true,
                })}
              </div>
              <div styleName="formItem">
                {this.renderInput({
                  id: 'seoTitle',
                  label: t.labelSEOTitle,
                  limit: 50,
                })}
              </div>
              <div styleName="formItem textArea">
                {this.renderTextarea({
                  id: 'seoDescription',
                  label: t.labelSEODescription,
                })}
              </div>
              <div styleName="categorySelector">
                <CategorySelector
                  id="categoryId"
                  categories={this.props.allCategories}
                  category={baseProduct && baseProduct.category}
                  onSelect={itemId => {
                    this.handleSelectedCategory(itemId);
                  }}
                />
                {!categoryEquality &&
                  baseProduct &&
                  restVariants && (
                    <div styleName="categoryWarn">{t.categoryWarn}</div>
                  )}
                {formErrors &&
                  formErrors.categoryId && (
                    <div styleName="categoryError">{formErrors.categoryId}</div>
                  )}
              </div>
              {defaultAttributes &&
                !isEmpty(defaultAttributes) && (
                  <Fragment>
                    <div styleName="title titleCharacteristics">
                      <strong>{t.characteristics}</strong>
                    </div>
                    <div styleName="formItem additionalAttributes">
                      <AdditionalAttributes
                        onlyView={categoryEquality}
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
              <div styleName="title titlePricing">
                <strong>{t.pricing}</strong>
              </div>
              <div styleName="formItem">
                <InputPrice
                  id="price"
                  required
                  label={t.labelPrice}
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
                  id="cashback"
                  label={t.labelCashback}
                  onChange={this.handlePercentChange('cashback')}
                  value={!isNil(cashback) ? `${cashback}` : ''}
                  dataTest="variantCashbackInput"
                />
                <span styleName="inputPostfix">{t.percent}</span>
              </div>
              <div styleName="formItem">
                <Input
                  fullWidth
                  id="discount"
                  label={t.labelDiscount}
                  onChange={this.handlePercentChange('discount')}
                  value={!isNil(discount) ? `${discount}` : ''}
                  dataTest="variantDiscountInput"
                />
                <span styleName="inputPostfix">{t.percent}</span>
              </div>
              {/*
                <div id="metrics" styleName="metrics">
                  <Metrics
                    {...metrics}
                    onChangeMetrics={this.handleChangeMetrics}
                  />
                  {formErrors &&
                    formErrors.metrics && (
                      <div styleName="metricsError">{formErrors.metrics}</div>
                    )}
                </div>
              */}
              <div styleName="preOrder">
                <PreOrder
                  preOrderDays={preOrderDays}
                  preOrder={preOrder}
                  onChangePreOrder={this.handleChangePreOrder}
                />
              </div>
              <div styleName="warehouses">
                {mainVariant && <Warehouses stocks={mainVariant.stocks} />}
              </div>
              <div styleName="buttonsWrapper">
                <div styleName="button">
                  <Button
                    big
                    fullWidth
                    onClick={
                      baseProduct
                        ? this.handleUpdateProduct
                        : () => {
                            this.handleSave();
                          }
                    }
                    disabled={baseProduct != null && !this.isSaveAvailable()}
                    dataTest="saveProductButton"
                    isLoading={isLoading || isSendingToModeration}
                  >
                    {baseProduct ? t.updateProduct : t.createProduct}
                  </Button>
                </div>
                {baseProduct &&
                  baseProduct.status === 'DRAFT' && (
                    <div styleName="button moderationButton">
                      <Button
                        big
                        fullWidth
                        onClick={this.sendToModeration}
                        dataTest="sendToModerationProductButton"
                        isLoading={isSendingToModeration || isLoading}
                      >
                        {t.sendToModeration}
                      </Button>
                    </div>
                  )}
                {baseProduct != null &&
                  baseProduct.status === 'MODERATION' && (
                    <div styleName="warnMessage">
                      {t.baseProductIsOnModeration}
                    </div>
                  )}
                {baseProduct != null &&
                  baseProduct.status === 'BLOCKED' && (
                    <div styleName="warnMessage">{t.baseProductIsBlocked}</div>
                  )}
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
                          {t.currentlyYouHaveNoVariantsForYourProduct}.<br />
                          {t.addVariantsIfYouNeedSome}
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
                            disabled={
                              isEmpty(customAttributes) ||
                              isEmpty(attributeValues) ||
                              (baseProduct != null &&
                                baseProduct.status === 'MODERATION') ||
                              (baseProduct != null &&
                                baseProduct.status === 'BLOCKED')
                            }
                            dataTest="addVariantButton"
                          >
                            {t.addVariant}
                          </Button>
                        </div>
                        {!baseProduct && (
                          <Fragment>
                            {(isEmpty(customAttributes) ||
                              isEmpty(attributeValues)) && (
                              <div styleName="variantsWarnText">
                                {t.variantTabWarnMessages.youCantAddVariant}
                              </div>
                            )}
                          </Fragment>
                        )}
                        {baseProduct && (
                          <Fragment>
                            {(isEmpty(customAttributes) ||
                              isEmpty(attributeValues)) && (
                              <div styleName="variantsWarnText">
                                {t.variantTabWarnMessages.thisCategory}
                                <br />
                                {t.variantTabWarnMessages.сurrentlyThisOption}
                              </div>
                            )}
                          </Fragment>
                        )}
                      </div>
                    )}
                    {restVariants &&
                      baseProduct && (
                        <div styleName="isVariants">
                          <Variants
                            variants={restVariants}
                            productId={baseProduct.id}
                            currency={currency}
                            environment={environment}
                            onExpandClick={this.expandClick}
                            showAlert={showAlert}
                            onCopyVariant={this.handleCopyVariant}
                          />
                          <div styleName="variantsButton">
                            <Button
                              big
                              wireframe
                              fullWidth
                              onClick={this.addNewVariant}
                              disabled={
                                isEmpty(customAttributes) ||
                                isEmpty(attributeValues) ||
                                (baseProduct != null &&
                                  baseProduct.status === 'MODERATION') ||
                                (baseProduct != null &&
                                  baseProduct.status === 'BLOCKED')
                              }
                              dataTest="addVariantButton"
                            >
                              {t.addVariant}
                            </Button>
                          </div>
                          <Fragment>
                            {(isEmpty(customAttributes) ||
                              isEmpty(attributeValues)) && (
                              <div styleName="variantsWarnText">
                                {t.variantTabWarnMessages.thisCategory}
                                <br />
                                {t.variantTabWarnMessages.сurrentlyThisOption}
                              </div>
                            )}
                          </Fragment>
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
                            {t.save}
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
        <Modal
          showModal={isShippingPopup}
          onClose={this.handleCloseShippingPopup}
        >
          <div styleName="shippingPopup">
            <div styleName="shippingPopupWrapper">
              <div styleName="shippingPopupDescription">
                After saving the lists of logistics companies will be updated.
                Do you want to continue?
              </div>
              <div styleName="shippingPopupButtons">
                <Button
                  onClick={this.handleCloseShippingPopup}
                  dataTest=""
                  wireframe
                  big
                >
                  <span>Cancel</span>
                </Button>
                <div styleName="shippingPopupOkButton">
                  <Button
                    onClick={() => {
                      this.setState({ isShippingPopup: false }, () => {
                        this.handleSave(undefined, true);
                      });
                    }}
                    dataTest=""
                    big
                    isLoading={isLoadingPackages}
                  >
                    <span>Ok</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default createFragmentContainer(
  // $FlowIgnore
  withRouter(withErrorBoundary(withShowAlert(Form))),
  graphql`
    fragment Form_allCategories on Category {
      name {
        lang
        text
      }
      children {
        id
        rawId
        parentId
        level
        name {
          lang
          text
        }
        children {
          id
          rawId
          parentId
          level
          name {
            lang
            text
          }
          children {
            id
            rawId
            parentId
            level
            name {
              lang
              text
            }
            getAttributes {
              id
              rawId
              name {
                text
                lang
              }
              metaField {
                values
                translatedValues {
                  translations {
                    text
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
);
