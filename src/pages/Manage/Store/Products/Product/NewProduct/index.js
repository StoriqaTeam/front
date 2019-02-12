// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { routerShape, withRouter, matchShape } from 'found';
import { pathOr, isEmpty, head, filter, prepend, map } from 'ramda';
import { Environment } from 'relay-runtime';
import { createFragmentContainer, graphql } from 'react-relay';
import uuidv4 from 'uuid/v4';

import { AppContext, Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { log, fromRelayError } from 'utils';
import {
  CreateBaseProductWithVariantsMutation,
  UpsertShippingMutation,
} from 'relay/mutations';
import { withShowAlert } from 'components/Alerts/AlertContext';
import { renameKeys } from 'utils/ramda';

import type { CategoryType } from 'types';
import type {
  FormErrorsType,
  CustomAttributeType,
  FormType,
} from 'pages/Manage/Store/Products/types';
import type { FromRelayErrorType } from 'utils/fromRelayError';
import type { AddAlertInputType } from 'components/Alerts/AlertContext';
import type { MutationParamsType as UpsertShippingMutationType } from 'relay/mutations/UpsertShippingMutation';
import type { MutationResponseType as CreateBaseProductWithVariantsResponseType } from 'relay/mutations/CreateBaseProductWithVariantsMutation';

import type { NewProduct_me as NewProductMeType } from './__generated__/NewProduct_me.graphql';
import type {
  AvailablePackagesType,
  FullShippingType,
} from '../Shipping/types';

import fetchPackages from '../fetchPackages';
import Form from '../Form';

import '../Product.scss';

import t from './i18n';

type PropsType = {
  me: NewProductMeType,
  showAlert: (input: AddAlertInputType) => void,
  router: routerShape,
  match: matchShape,
  environment: Environment,
  allCategories: Array<CategoryType>,
};

type StateType = {
  formErrors: FormErrorsType,
  isLoading: boolean,
  availablePackages: ?AvailablePackagesType,
  shippingData: ?FullShippingType,
  customAttributes: Array<CustomAttributeType>,
  isLoadingPackages: boolean,
};

class NewProduct extends Component<PropsType, StateType> {
  state: StateType = {
    formErrors: {},
    isLoading: false,
    availablePackages: null,
    shippingData: null,
    customAttributes: [],
    isLoadingPackages: false,
  };

  componentDidMount() {
    this.handleFetchPackages();
  }

  handleFetchPackages = (metrics?: {
    lengthCm: number,
    widthCm: number,
    heightCm: number,
    weightG: number,
  }) => {
    const size = metrics
      ? metrics.lengthCm * metrics.widthCm * metrics.heightCm
      : 0;
    const weight = metrics ? metrics.weightG : 0;
    this.setState({ isLoadingPackages: true });
    // $FlowIgnore
    const warehouses = pathOr(
      null,
      ['me', 'myStore', 'warehouses'],
      this.props,
    );
    const warehouse =
      warehouses && !isEmpty(warehouses) ? head(warehouses) : null;
    const countryCode = pathOr(null, ['addressFull', 'countryCode'], warehouse);

    if (countryCode && process.env.BROWSER) {
      const variables = {
        countryCode: 'RUS',
        size,
        weight,
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
            text: t.somethingGoingWrongWithShipping,
            link: { text: t.close },
          });
        });
    }
  };

  handleSave = (
    form: FormType & { currency: string },
    isAddVariant?: boolean,
  ) => {
    this.setState({ formErrors: {} });
    const { environment } = this.props;
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

    if (!categoryId) {
      this.props.showAlert({
        type: 'danger',
        text: t.noCategory,
        link: { text: t.close },
      });
      return;
    }

    const { customAttributes } = this.state;
    // $FlowIgnoreMe
    const storeRawId = pathOr(null, ['match', 'params', 'storeId'], this.props);
    this.setState(() => ({ isLoading: true }));

    CreateBaseProductWithVariantsMutation({
      environment,
      variables: {
        input: {
          clientMutationId: uuidv4(),
          name: [{ lang: 'EN', text: name }],
          storeId: parseInt(storeRawId, 10),
          shortDescription: [{ lang: 'EN', text: shortDescription }],
          longDescription: [{ lang: 'EN', text: longDescription }],
          seoTitle:
            !seoTitle || seoTitle.length === 0
              ? null
              : [{ lang: 'EN', text: seoTitle }],
          seoDescription:
            !seoDescription || seoDescription.length === 0
              ? null
              : [{ lang: 'EN', text: seoDescription }],
          currency,
          categoryId,
          selectedAttributes: map(item => item.rawId, customAttributes),
          variants: [
            {
              clientMutationId: uuidv4(),
              product: {
                price: form.price,
                vendorCode: form.vendorCode,
                photoMain: form.photoMain,
                additionalPhotos: form.photos,
                cashback: form.cashback ? form.cashback / 100 : 0,
                discount: form.discount ? form.discount / 100 : 0,
                preOrder: form.preOrder,
                preOrderDays: Number(form.preOrderDays),
              },
              attributes: form.attributeValues,
            },
          ],
          lengthCm: metrics.lengthCm || null,
          widthCm: metrics.widthCm || null,
          heightCm: metrics.heightCm || null,
          weightG: metrics.weightG || null,
        },
      },
    })
      .then((response: CreateBaseProductWithVariantsResponseType) => {
        this.setState(() => ({ isLoading: false }));
        log.debug({ response });

        if (response) {
          const { createBaseProductWithVariants } = response;
          const baseProductRawId = createBaseProductWithVariants.rawId;
          this.handleSaveShipping({
            baseProductRawId,
            storeId: storeRawId,
            isAddVariant,
          });
          return true;
        }
        return true;
      })
      .catch((error: FromRelayErrorType) => {
        this.setState(() => ({ isLoading: false }));
        const relayErrors = fromRelayError({ source: { errors: [error] } });
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
          this.setState({
            formErrors,
            isLoading: false,
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
          this.setState({ isLoading: false });
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
          this.setState({ isLoading: false });
          return;
        }
        this.props.showAlert({
          type: 'danger',
          text: t.somethingGoingWrong,
          link: { text: t.close },
        });
      });
  };

  handleSaveShipping = (props: {
    baseProductRawId: number,
    storeId: number,
    isAddVariant?: boolean,
  }) => {
    const { baseProductRawId, storeId, isAddVariant } = props;
    const { shippingData } = this.state;
    if (!shippingData) {
      this.props.showAlert({
        type: 'danger',
        text: t.somethingGoingWrong,
        link: { text: t.close },
      });
      return;
    }
    const {
      local,
      international,
      pickup,
      withoutInter,
      withoutLocal,
    } = shippingData;
    const params: UpsertShippingMutationType = {
      input: {
        clientMutationId: uuidv4(),
        local: withoutLocal ? [] : local,
        international: withoutInter ? [] : international,
        pickup: withoutLocal ? { pickup: false, price: 0 } : pickup,
        baseProductId: baseProductRawId,
        storeId: parseInt(storeId, 10),
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
        this.props.showAlert({
          type: 'success',
          text: t.productCreated,
          link: { text: '' },
        });
        this.props.router.push(
          `/manage/store/${storeId}/products/${parseInt(baseProductRawId, 10)}${
            isAddVariant ? '/variant/new' : ''
          }`,
        );
      },
      onError: (error: Error) => {
        this.setState({ isLoading: false });
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

  handleResetAttribute = () => {
    this.setState({ customAttributes: [] });
  };

  render() {
    const {
      isLoading,
      availablePackages,
      shippingData,
      customAttributes,
      formErrors,
      isLoadingPackages,
    } = this.state;
    return (
      <AppContext.Consumer>
        {({ directories }) => (
          <div styleName="wrap">
            <Form
              baseProduct={null}
              isLoading={isLoading}
              availablePackages={availablePackages}
              shippingData={shippingData}
              customAttributes={customAttributes}
              formErrors={formErrors}
              onSave={this.handleSave}
              allCategories={this.props.allCategories}
              currencies={directories.sellerCurrencies}
              onChangeShipping={this.handleChangeShipping}
              onCreateAttribute={this.handleCreateAttribute}
              onRemoveAttribute={this.handleRemoveAttribute}
              onResetAttribute={this.handleResetAttribute}
              isLoadingPackages={isLoadingPackages}
              onFetchPackages={this.handleFetchPackages}
              handleFetchPackages={this.handleFetchPackages}
            />
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

NewProduct.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object.isRequired,
};

export default createFragmentContainer(
  withRouter(
    withShowAlert(
      Page(
        ManageStore({
          OriginalComponent: NewProduct,
          active: 'goods',
          title: 'Goods',
        }),
      ),
    ),
  ),
  graphql`
    fragment NewProduct_me on User {
      myStore {
        id
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
        baseProducts(first: 100) @connection(key: "Wizard_baseProducts") {
          edges {
            node {
              id
              rawId
              name {
                text
                lang
              }
              shortDescription {
                lang
                text
              }
              category {
                id
                rawId
              }
              storeId
              currency
              products(first: 1) @connection(key: "Wizard_products") {
                edges {
                  node {
                    id
                    rawId
                    price
                    preOrder
                    preOrderDays
                    discount
                    photoMain
                    additionalPhotos
                    vendorCode
                    cashback
                    price
                    attributes {
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
            }
          }
        }
      }
    }
  `,
);
