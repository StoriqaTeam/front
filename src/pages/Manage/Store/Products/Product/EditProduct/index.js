// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { Environment } from 'relay-runtime';
import { matchShape, routerShape } from 'found';
import {
  pathOr,
  isEmpty,
  path,
  head,
  filter,
  prepend,
  find,
  propEq,
} from 'ramda';
import uuidv4 from 'uuid/v4';

import { AppContext, Page } from 'components/App';
import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { ManageStore } from 'pages/Manage/Store';
import { log, fromRelayError } from 'utils';
import { renameKeys } from 'utils/ramda';
import {
  UpdateBaseProductMutation,
  UpdateProductMutation,
  UpsertShippingMutation,
} from 'relay/mutations';
import { withShowAlert } from 'components/Alerts/AlertContext';

import type { CategoryType } from 'types';
import type {
  FormErrorsType,
  CustomAttributeType,
  FormType,
  VariantType,
} from 'pages/Manage/Store/Products/types';
import type { AddAlertInputType } from 'components/Alerts/AlertContext';
import type { MutationParamsType as UpdateProductMutationType } from 'relay/mutations/UpdateProductMutation';
import type { MutationParamsType as UpsertShippingMutationType } from 'relay/mutations/UpsertShippingMutation';

import type { EditProduct_me as EditProductMeType } from './__generated__/EditProduct_me.graphql';
import type {
  AvailablePackagesType,
  FullShippingType,
} from '../Shipping/types';

import fetchPackages from '../fetchPackages';
import Form from '../Form';

// import sendProductToDraftMutation from './mutations/SendProductToDraftMutation';

import '../Product.scss';

import t from './i18n';

type PropsType = {
  me: EditProductMeType,
  showAlert: (input: AddAlertInputType) => void,
  router: routerShape,
  environment: Environment,
  match: matchShape,
  allCategories: Array<CategoryType>,
};

type StateType = {
  formErrors: FormErrorsType,
  isLoading: boolean,
  availablePackages: ?AvailablePackagesType,
  isLoadingPackages: boolean,
  isLoadingShipping: boolean,
  shippingData: ?FullShippingType,
  customAttributes: Array<CustomAttributeType>,
};

class EditProduct extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    // $FlowIgnore
    const baseProduct = pathOr(null, ['me', 'baseProduct'], props);
    const { category, customAttributes } = baseProduct;
    const newCustomAttributes = filter(
      item =>
        Boolean(find(propEq('attributeId', item.rawId))(customAttributes)),
      category.getAttributes,
    );

    this.state = {
      formErrors: {},
      isLoading: false,
      availablePackages: null,
      isLoadingPackages: false,
      isLoadingShipping: false,
      shippingData: null,
      customAttributes: newCustomAttributes,
    };
  }

  componentDidMount() {
    this.handleFetchPackages();
  }

  setLoadingPackages = (value: boolean) => {
    this.setState({ isLoadingPackages: value });
  };

  handleFetchPackages = (metrics?: {
    lengthCm: number,
    widthCm: number,
    heightCm: number,
    weightG: number,
  }) => {
    this.setState({ isLoadingPackages: true });
    const size = metrics
      ? metrics.lengthCm * metrics.widthCm * metrics.heightCm
      : 0;
    const weight = metrics ? metrics.weightG : 0;
    // $FlowIgnore
    const baseProduct = pathOr(null, ['me', 'baseProduct'], this.props);
    // $FlowIgnore
    const warehouses = pathOr(
      null,
      ['me', 'baseProduct', 'store', 'warehouses'],
      this.props,
    );
    const warehouse =
      warehouses && !isEmpty(warehouses) ? head(warehouses) : null;
    const countryCode = pathOr(null, ['addressFull', 'countryCode'], warehouse);

    if (countryCode && process.env.BROWSER) {
      this.setLoadingPackages(true);
      const variables = {
        countryCode,
        size: metrics ? size : baseProduct.volumeCubicCm || 0,
        weight: metrics ? weight : baseProduct.weightG || 0,
      };

      fetchPackages(this.props.environment, variables)
        .then(({ availablePackages }) => {
          this.setState({
            availablePackages: availablePackages || null,
            isLoadingPackages: false,
          });
          return true;
        })
        .catch(() => {
          this.setState({
            availablePackages: null,
            isLoadingPackages: false,
          });
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
        });
    } else {
      this.handlerOffLoadingPackages();
    }
  };

  handlerOffLoadingPackages = () => {
    this.setState({ isLoadingPackages: false });
  };

  handleSave = (
    form: FormType & { currency: string },
    withSavingShipping?: boolean,
  ) => {
    this.setState({ formErrors: {} });
    const baseProduct = path(['me', 'baseProduct'], this.props);
    if (!baseProduct || !baseProduct.id) {
      this.props.showAlert({
        type: 'danger',
        text: t.somethingGoingWrong,
        link: { text: t.close },
      });
      return;
    }
    const {
      name,
      categoryId,
      seoTitle,
      seoDescription,
      shortDescription,
      longDescription,
      currency,
      metrics,
    } = form;
    this.setState(() => ({ isLoading: true }));
    UpdateBaseProductMutation.commit({
      id: baseProduct.id,
      name: name ? [{ lang: 'EN', text: name }] : null,
      shortDescription: shortDescription
        ? [{ lang: 'EN', text: shortDescription }]
        : null,
      longDescription: [{ lang: 'EN', text: longDescription }],
      categoryId,
      seoTitle: seoTitle ? [{ lang: 'EN', text: seoTitle }] : null,
      seoDescription: seoDescription
        ? [{ lang: 'EN', text: seoDescription }]
        : null,
      currency,
      lengthCm: metrics.lengthCm || null,
      widthCm: metrics.widthCm || null,
      heightCm: metrics.heightCm || null,
      weightG: metrics.weightG || null,
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
            formErrors: renameKeys(
              {
                long_description: 'longDescription',
                short_description: 'shortDescription',
              },
              validationErrors,
            ),
          });
          return;
        }

        // $FlowIgnoreMe
        const status: string = pathOr('', ['100', 'status'], relayErrors);
        if (status) {
          this.props.showAlert({
            type: 'danger',
            text: `${t.error} "${status}"`,
            link: { text: t.close },
          });
          return;
        }
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }

        if (form && form.rawIdMainVariant) {
          this.handleUpdateVariant(
            {
              idMainVariant: form.idMainVariant,
              rawIdMainVariant: form.rawIdMainVariant,
              photoMain: form.photoMain,
              photos: form.photos,
              vendorCode: form.vendorCode,
              price: form.price,
              cashback: form.cashback,
              discount: form.discount,
              preOrderDays: form.preOrderDays,
              preOrder: form.preOrder,
              attributeValues: form.attributeValues,
            },
            withSavingShipping,
          );
        }
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.setState({ formErrors: validationErrors });
          return;
        }
        this.props.showAlert({
          type: 'danger',
          text: t.somethingGoingWrong,
          link: { text: t.close },
        });
      },
    });
  };

  handleUpdateVariant = (
    variantData: VariantType,
    withSavingShipping?: boolean,
  ) => {
    if (!variantData.idMainVariant) {
      this.props.showAlert({
        type: 'danger',
        text: t.somethingGoingWrong,
        link: { text: t.close },
      });
      return;
    }
    this.setState({ isLoading: true });
    const params: UpdateProductMutationType = {
      input: {
        clientMutationId: uuidv4(),
        id: variantData.idMainVariant || '',
        product: {
          price: variantData.price,
          vendorCode: variantData.vendorCode,
          photoMain: variantData.photoMain || '',
          additionalPhotos: variantData.photos,
          cashback: variantData.cashback ? variantData.cashback / 100 : 0,
          discount: variantData.discount ? variantData.discount / 100 : 0,
          preOrder: variantData.preOrder,
          preOrderDays: Number(variantData.preOrderDays),
        },
        attributes: variantData.attributeValues,
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
            {
              long_description: 'longDescription',
              short_description: 'shortDescription',
              seo_title: 'seoTitle',
              seo_description: 'seoDescription',
              vendor_code: 'vendorCode',
            },
            validationErrors,
          );
          this.setState({ formErrors });
          return;
        }

        // $FlowIgnoreMe
        const statusError: string = pathOr({}, ['100', 'status'], relayErrors);
        if (!isEmpty(statusError)) {
          this.props.showAlert({
            type: 'danger',
            text: `${t.error} "${statusError}"`,
            link: { text: t.close },
          });
          return;
        }

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }

        // change state to DRAFT after saving product with PUBLISHED state
        /* const status = pathOr(null, ['updateProduct', 'baseProduct', 'status'])(
          response,
        );
        const baseProductId = pathOr(null, [
          'updateProduct',
          'baseProduct',
          'rawId',
        ])(response);
        if (baseProductId && status === 'PUBLISHED') {
          sendProductToDraftMutation({
            environment: this.props.environment,
            variables: {
              ids: [baseProductId],
            },
          });
        } */

        this.props.showAlert({
          type: 'success',
          text: t.productUpdated,
          link: { text: '' },
        });

        if (withSavingShipping) {
          this.handleSaveShipping();
        }
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: t.somethingGoingWrong,
          link: { text: t.close },
        });
      },
    };
    UpdateProductMutation.commit(params);
  };

  handleSaveShipping = (onlyShippingSave?: boolean) => {
    const { shippingData } = this.state;
    if (!shippingData) {
      this.props.showAlert({
        type: 'danger',
        text: t.somethingGoingWrong,
        link: { text: t.close },
      });
      return;
    }
    // $FlowIgnore
    const productRawId = pathOr(
      null,
      ['me', 'baseProduct', 'rawId'],
      this.props,
    );
    // $FlowIgnore
    const storeRawId = pathOr(
      null,
      ['me', 'baseProduct', 'store', 'rawId'],
      this.props,
    );
    const {
      local,
      international,
      pickup,
      withoutInter,
      withoutLocal,
    } = shippingData;
    if (onlyShippingSave) {
      this.setState({ isLoadingShipping: true });
    }
    const params: UpsertShippingMutationType = {
      input: {
        clientMutationId: uuidv4(),
        local: withoutLocal ? [] : local,
        international: withoutInter ? [] : international,
        pickup: withoutLocal ? { pickup: false, price: 0 } : pickup,
        baseProductId: productRawId,
        storeId: storeRawId,
      },
      environment: this.props.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState({
          isLoading: false,
          isLoadingShipping: false,
        });
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.props.showAlert({
            type: 'danger',
            text: t.validationError,
            link: { text: t.close },
          });
          return;
        }

        // $FlowIgnoreMe
        const statusError: string = pathOr({}, ['100', 'status'], relayErrors);
        if (!isEmpty(statusError)) {
          this.props.showAlert({
            type: 'danger',
            text: `${t.error} "${statusError}"`,
            link: { text: t.close },
          });
          return;
        }

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }
        if (onlyShippingSave) {
          this.props.showAlert({
            type: 'success',
            text: t.deliveryUpdated,
            link: { text: '' },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: t.deliveryUpdated,
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        this.setState({
          isLoading: false,
          isLoadingShipping: false,
        });
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: t.somethingGoingWrong,
          link: { text: t.close },
        });
      },
    };
    UpsertShippingMutation.commit(params);
  };

  handleChangeShipping = (shippingData: ?FullShippingType) => {
    this.setState({ shippingData });
  };

  handleCreateAttribute = (attribute: CustomAttributeType) => {
    this.setState((prevState: StateType) => ({
      customAttributes: prepend(attribute, prevState.customAttributes),
    }));
  };

  handleRemoveAttribute = (id: string) => {
    this.setState((prevState: StateType) => ({
      customAttributes: filter(
        item => item.id !== id,
        prevState.customAttributes,
      ),
    }));
  };

  handleResetAttribute = (newCategoryId: number) => {
    // $FlowIgnore
    const baseProduct = pathOr(null, ['me', 'baseProduct'], this.props);
    const { category, customAttributes } = baseProduct;
    let newCustomAttributes = filter(
      item =>
        Boolean(find(propEq('attributeId', item.rawId))(customAttributes)),
      category.getAttributes,
    );

    if (category.rawId !== newCategoryId) {
      newCustomAttributes = [];
    }

    this.setState({ customAttributes: newCustomAttributes });
  };

  render() {
    const { me, router, match, allCategories } = this.props;
    const {
      isLoading,
      availablePackages,
      isLoadingPackages,
      shippingData,
      formErrors,
      customAttributes,
      isLoadingShipping,
    } = this.state;
    let baseProduct = null;
    if (me && me.baseProduct) {
      ({ baseProduct } = me);
    } else {
      return <span>{t.productNotFound}</span>;
    }
    return (
      <AppContext.Consumer>
        {({ directories, environment }) => (
          <div styleName="wrap">
            <Form
              baseProduct={baseProduct}
              onSave={this.handleSave}
              formErrors={formErrors}
              allCategories={allCategories}
              currencies={directories.sellerCurrencies}
              isLoading={isLoading}
              availablePackages={availablePackages}
              isLoadingPackages={isLoadingPackages}
              onChangeShipping={this.handleChangeShipping}
              shippingData={shippingData}
              customAttributes={customAttributes}
              onResetAttribute={this.handleResetAttribute}
              onCreateAttribute={this.handleCreateAttribute}
              onRemoveAttribute={this.handleRemoveAttribute}
              environment={environment}
              onSaveShipping={this.handleSaveShipping}
              router={router}
              match={match}
              isLoadingShipping={isLoadingShipping}
              onFetchPackages={this.handleFetchPackages}
            />
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

EditProduct.contextTypes = {
  directories: PropTypes.object.isRequired,
  environment: PropTypes.object.isRequired,
};

export default createFragmentContainer(
  withShowAlert(
    withErrorBoundary(
      // $FlowIgnore
      Page(
        ManageStore({
          OriginalComponent: EditProduct,
          active: 'goods',
          title: 'Goods',
        }),
      ),
    ),
  ),
  graphql`
    fragment EditProduct_me on User
      @argumentDefinitions(productId: { type: "Int!" }) {
      baseProduct(id: $productID) {
        id
        rawId
        customAttributes {
          id
          rawId
          attributeId
          attribute {
            id
            rawId
          }
        }
        status
        currency
        ...Shipping_baseProduct
        products(first: 100) @connection(key: "Wizard_products") {
          edges {
            node {
              stocks {
                id
                productId
                warehouseId
                warehouse {
                  name
                  slug
                  addressFull {
                    country
                    administrativeAreaLevel1
                    administrativeAreaLevel2
                    political
                    postalCode
                    streetNumber
                    value
                    route
                    locality
                  }
                }
                quantity
              }
              id
              rawId
              price
              discount
              photoMain
              additionalPhotos
              vendorCode
              cashback
              price
              preOrder
              preOrderDays
              attributes {
                attrId
                value
                metaField
                attribute {
                  id
                  rawId
                  name {
                    lang
                    text
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
        category {
          rawId
          id
          getAttributes {
            id
            rawId
            name {
              lang
              text
            }
            valueType
            metaField {
              values
              translatedValues {
                translations {
                  lang
                  text
                }
              }
              uiElement
            }
          }
        }
        store(visibility: "active") {
          id
          rawId
          logo
          name {
            text
            lang
          }
          warehouses {
            addressFull {
              countryCode
            }
          }
        }
        name {
          lang
          text
        }
        shortDescription {
          lang
          text
        }
        longDescription {
          lang
          text
        }
        seoTitle {
          lang
          text
        }
        seoDescription {
          lang
          text
        }
        lengthCm
        widthCm
        heightCm
        weightG
        volumeCubicCm
      }
    }
  `,
);
