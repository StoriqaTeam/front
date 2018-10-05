// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { Environment } from 'relay-runtime';
import { pathOr, isEmpty, path, head, map, filter } from 'ramda';

import { AppContext, Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { log, fromRelayError } from 'utils';
import {
  UpdateBaseProductMutation,
  UpdateProductMutation,
  CreateProductWithAttributesMutation,
  UpsertShippingMutation,
  CreateCustomAttributeMutation,
  DeleteCustomAttributeMutation,
} from 'relay/mutations';
import { withShowAlert } from 'components/App/AlertContext';

import type { AddAlertInputType } from 'components/App/AlertContext';
import type { MutationParamsType as UpdateProductMutationType } from 'relay/mutations/UpdateProductMutation';
import type { MutationParamsType as CreateProductWithAttributesMutationType } from 'relay/mutations/CreateProductWithAttributesMutation';
import type { MutationParamsType as UpsertShippingMutationType } from 'relay/mutations/UpsertShippingMutation';
import type { MutationParamsType as CreateCustomAttributeMutationType } from 'relay/mutations/CreateCustomAttributeMutation';
import type { MutationParamsType as DeleteCustomAttributeMutationType } from 'relay/mutations/DeleteCustomAttributeMutation';
import type { EditProduct_me as EditProductMeType } from './__generated__/EditProduct_me.graphql';
import type { AvailablePackagesType, FullShippingType } from './Shipping/types';

import fetchPackages from './fetchPackages';
import fetchAttributes from './fetchAttributes';
import Form from './Form';

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

type VariantType = {
  variantId: string,
  vendorCode: string,
  price: number,
  cashback?: ?number,
  discount?: ?number,
  mainPhoto?: ?string,
  photos?: Array<string>,
  attributeValues: Array<AttributeValueType>,
  preOrder: boolean,
  preOrderDays: string,
  customAttributeValues: Array<AttributeValueType>,
};

type FormType = {
  name: string,
  seoTitle: string,
  seoDescription: string,
  shortDescription: string,
  longDescription: string,
  categoryId: ?number,
  currencyId: number,
};

type PropsType = {
  me: EditProductMeType,
  showAlert: (input: AddAlertInputType) => void,
  environment: Environment,
};

type StateType = {
  formErrors: {
    [string]: Array<string>,
  },
  isLoading: boolean,
  comeResponse: boolean,
  availablePackages: ?AvailablePackagesType,
  isLoadingPackages: boolean,
  isLoadingAttributes: boolean,
  variantData: ?VariantType,
  closedVariantFormAnnunciator: boolean,
  shippingData: ?FullShippingType,
  attributes: Array<AttributeType>,
};

class EditProduct extends Component<PropsType, StateType> {
  state: StateType = {
    formErrors: {},
    isLoading: false,
    comeResponse: false,
    availablePackages: null,
    isLoadingPackages: true,
    isLoadingAttributes: true,
    variantData: null,
    closedVariantFormAnnunciator: false,
    shippingData: null,
    attributes: [],
  };

  componentDidMount() {
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
        size: 0,
        weight: 0,
      };

      fetchPackages(this.props.environment, variables)
        .then(({ availablePackages }) => {
          this.setState({
            availablePackages: availablePackages || null,
            isLoadingPackages: false,
          });
        })
        .catch(() => {
          this.setState({
            availablePackages: null,
            isLoadingPackages: false,
          });
          this.props.showAlert({
            type: 'danger',
            text: 'Shipping packages loading error',
            link: { text: 'Close.' },
          });
        });

      fetchAttributes(this.props.environment)
        .then(({ attributes }) => {
          this.setState({
            attributes,
            isLoadingAttributes: false,
          });
        })
        .catch(() => {
          this.setState({
            attributes: [],
            isLoadingAttributes: false,
          });
          this.props.showAlert({
            type: 'danger',
            text: 'Attributes loading error',
            link: { text: 'Close.' },
          });
        });
    } else {
      this.handlerOffLoadingPackages();
    }
  }

  setLoadingPackages = (value: boolean) => {
    this.setState({ isLoadingPackages: value });
  };

  handlerOffLoadingPackages = () => {
    this.setState({ isLoadingPackages: false });
  };

  handleSave = (form: FormType) => {
    this.setState({ formErrors: {} });
    const baseProduct = path(['me', 'baseProduct'], this.props);
    if (!baseProduct || !baseProduct.id) {
      this.props.showAlert({
        type: 'danger',
        text: 'Something going wrong :(',
        link: { text: 'Close.' },
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
      currencyId,
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
      currencyId,
      environment: this.props.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });
        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.setState({
            formErrors: validationErrors,
            isLoading: false,
          });
          return;
        }
        log.debug({ validationErrors });

        // $FlowIgnoreMe
        const status: string = pathOr('', ['100', 'status'], relayErrors);
        if (status) {
          this.props.showAlert({
            type: 'danger',
            text: `Error: "${status}"`,
            link: { text: 'Close.' },
          });
          this.setState({ isLoading: false });
          return;
        }
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          this.setState({ isLoading: false });
          return;
        }
        const { variantData } = this.state;
        if (variantData) {
          if (variantData.variantId) {
            this.handleUpdateVariant(variantData);
          } else {
            this.handleCreateVariant(variantData);
          }
        } else {
          this.handleShippingSave();
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
          text: 'Something going wrong :(',
          link: { text: 'Close.' },
        });
      },
    });
  };

  handleUpdateVariant = (variantData: VariantType) => {
    // $FlowIgnore
    const baseProductCustomAttributes = pathOr(
      [],
      ['me', 'baseProduct', 'customAttributes'],
      this.props,
    );
    console.log('---baseProductCustomAttributes', baseProductCustomAttributes);
    const variantDataCustomAttributeValues = variantData.customAttributeValues;
    console.log(
      '---variantDataCustomAttributeValues',
      variantDataCustomAttributeValues,
    );
    // const customAttributes = map(item => { customAttributeId }, variantData.customAttributes);

    const customAttributes = map(
      item => ({
        customAttributeId: head(
          filter(
            customAttribute => customAttribute.attribute.rawId === item.attrId,
            baseProductCustomAttributes,
          ),
        ).rawId,
        value: item.value,
      }),
      variantDataCustomAttributeValues,
    );

    console.log('---customAttributes', customAttributes);

    const params: UpdateProductMutationType = {
      input: {
        clientMutationId: '',
        id: variantData.variantId,
        product: {
          price: variantData.price,
          vendorCode: variantData.vendorCode,
          photoMain: variantData.mainPhoto,
          additionalPhotos: variantData.photos,
          cashback: variantData.cashback ? variantData.cashback / 100 : null,
          discount: variantData.discount ? variantData.discount / 100 : null,
          preOrder: variantData.preOrder,
          preOrderDays: Number(variantData.preOrderDays),
        },
        attributes: variantData.attributeValues,
        customAttributes,
      },
      environment: this.props.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.props.showAlert({
            type: 'danger',
            text: 'Validation Error!',
            link: { text: 'Close.' },
          });
          this.setState({ isLoading: false });
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
          this.setState({ isLoading: false });
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
          this.setState({ isLoading: false });
          return;
        }
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          this.setState({ isLoading: false });
          return;
        }
        this.handleShippingSave();
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

  handleCreateVariant = (variantData: VariantType) => {
    // $FlowIgnore
    const productRawId = pathOr(
      null,
      ['me', 'baseProduct', 'rawId'],
      this.props,
    );
    // $FlowIgnore
    const productId = pathOr(null, ['me', 'baseProduct', 'id'], this.props);
    const params: CreateProductWithAttributesMutationType = {
      input: {
        clientMutationId: '',
        product: {
          baseProductId: productRawId,
          price: variantData.price,
          vendorCode: variantData.vendorCode,
          photoMain: variantData.mainPhoto,
          additionalPhotos: variantData.photos,
          cashback: variantData.cashback ? variantData.cashback / 100 : null,
          discount: variantData.discount ? variantData.discount / 100 : null,
          preOrder: variantData.preOrder,
          preOrderDays: Number(variantData.preOrderDays),
        },
        attributes: variantData.attributeValues,
      },
      parentID: productId,
      environment: this.props.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.setState({
            formErrors: validationErrors,
            isLoading: false,
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
          this.setState({ isLoading: false });
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
          this.setState({ isLoading: false });
          return;
        }
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          this.setState({ isLoading: false });
          return;
        }
        this.handleShippingSave();
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

  handleShippingSave = () => {
    const { shippingData } = this.state;
    if (!shippingData) {
      this.props.showAlert({
        type: 'danger',
        text: 'Something going wrong.',
        link: { text: 'Close.' },
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
    const params: UpsertShippingMutationType = {
      input: {
        clientMutationId: '',
        local: withoutLocal ? [] : local,
        international: withoutInter ? [] : international,
        pickup: withoutLocal ? { pickup: false, price: 0 } : pickup,
        baseProductId: productRawId,
        storeId: storeRawId,
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
          this.props.showAlert({
            type: 'danger',
            text: 'Validation Error!',
            link: { text: 'Close.' },
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
          text: 'Product update!',
          link: { text: '' },
        });
        this.setState((prevState: StateType) => ({
          comeResponse: true,
          closedVariantFormAnnunciator: !prevState.closedVariantFormAnnunciator,
          variantData: null,
        }));
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
    UpsertShippingMutation.commit(params);
  };

  handleCreateAttribute = (attributeId: number) => {
    // $FlowIgnore
    const baseProductId = pathOr(null, ['me', 'baseProduct', 'id'], this.props);
    // $FlowIgnore
    const baseProductRawId = pathOr(
      null,
      ['me', 'baseProduct', 'rawId'],
      this.props,
    );
    const params: CreateCustomAttributeMutationType = {
      input: {
        clientMutationId: '',
        attributeId,
        baseProductId: baseProductRawId,
      },
      baseProductId,
      environment: this.props.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState({ isLoading: false });
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.props.showAlert({
            type: 'danger',
            text: 'Validation Error!',
            link: { text: 'Close.' },
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
          text: 'Attribute added!',
          link: { text: '' },
        });
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
    CreateCustomAttributeMutation.commit(params);
  };

  handleDeleteAttribute = (attributeId: number) => {
    // $FlowIgnore
    const baseProductId = pathOr(null, ['me', 'baseProduct', 'id'], this.props);
    const params: DeleteCustomAttributeMutationType = {
      input: {
        clientMutationId: '',
        customAttributeId: attributeId,
      },
      baseProductId,
      environment: this.props.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState({ isLoading: false });
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.props.showAlert({
            type: 'danger',
            text: 'Validation Error!',
            link: { text: 'Close.' },
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
          text: 'Attribute deleted!',
          link: { text: '' },
        });
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
    DeleteCustomAttributeMutation.commit(params);
  };

  handleOnChangeVariantForm = (variantData: ?VariantType) => {
    this.setState({ variantData });
  };

  handleOnChangeShipping = (shippingData: ?FullShippingType) => {
    this.setState({ shippingData });
  };

  resetComeResponse = () => {
    this.setState({ comeResponse: false });
  };

  render() {
    const { me } = this.props;
    const {
      isLoading,
      comeResponse,
      availablePackages,
      isLoadingPackages,
      isLoadingAttributes,
      variantData,
      closedVariantFormAnnunciator,
      shippingData,
      attributes,
    } = this.state;
    let baseProduct = null;
    if (me && me.baseProduct) {
      ({ baseProduct } = me);
    } else {
      return <span>Product not found</span>;
    }
    return (
      <AppContext.Consumer>
        {({ directories }) => (
          <div styleName="wrap">
            <Form
              baseProduct={baseProduct}
              onSave={this.handleSave}
              validationErrors={this.state.formErrors}
              categories={this.context.directories.categories}
              isLoading={isLoading}
              comeResponse={comeResponse}
              resetComeResponse={this.resetComeResponse}
              currencies={directories.currencies}
              availablePackages={availablePackages}
              isLoadingPackages={isLoadingPackages}
              isLoadingAttributes={isLoadingAttributes}
              onChangeVariantForm={this.handleOnChangeVariantForm}
              variantData={variantData}
              closedVariantFormAnnunciator={closedVariantFormAnnunciator}
              onChangeShipping={this.handleOnChangeShipping}
              shippingData={shippingData}
              attributes={attributes}
              onCreateAttribute={this.handleCreateAttribute}
              onDeleteAttribute={this.handleDeleteAttribute}
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
  withShowAlert(Page(ManageStore(EditProduct, 'Goods'), true)),
  graphql`
    fragment EditProduct_me on User
      @argumentDefinitions(productId: { type: "Int!" }) {
      baseProduct(id: $productID) {
        id
        rawId
        status
        currency
        ...Shipping_baseProduct
        customAttributes {
          id
          rawId
          attribute {
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
              customAttributes {
                customAttribute {
                  id
                  rawId
                  attributeId
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
                customAttributeId
                productId
                value
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
        store {
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
      }
    }
  `,
);
