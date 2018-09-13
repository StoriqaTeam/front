// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr, isEmpty, path } from 'ramda';

import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { log, fromRelayError } from 'utils';
import {
  UpdateBaseProductMutation,
  UpdateProductMutation,
} from 'relay/mutations';
import { withShowAlert } from 'components/App/AlertContext';

import type { AddAlertInputType } from 'components/App/AlertContext';
import type { MutationParamsType as UpdateProductMutationType } from 'relay/mutations/UpdateProductMutation';
import type { EditProduct_me as EditProductMeType } from './__generated__/EditProduct_me.graphql';

import Form from './Form';

import './Product.scss';

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
};

type FormType = {
  name: string,
  seoTitle: string,
  seoDescription: string,
  shortDescription: string,
  longDescription: string,
  categoryId: ?number,
};

type PropsType = {
  me: EditProductMeType,
  showAlert: (input: AddAlertInputType) => void,
};

type StateType = {
  formErrors: {
    [string]: Array<string>,
  },
  isLoading: boolean,
  comeResponse: boolean,
};

class EditProduct extends Component<PropsType, StateType> {
  state: StateType = {
    formErrors: {},
    isLoading: false,
    comeResponse: false,
  };

  handleSave = (form: FormType, variantData: VariantType) => {
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
    } = form;
    this.setState(() => ({ isLoading: true }));
    UpdateBaseProductMutation.commit({
      id: baseProduct.id,
      name: name ? [{ lang: 'EN', text: name }] : [],
      shortDescription: shortDescription
        ? [{ lang: 'EN', text: shortDescription }]
        : [],
      longDescription: [{ lang: 'EN', text: longDescription }],
      categoryId: categoryId || -1,
      seoTitle: seoTitle ? [{ lang: 'EN', text: seoTitle }] : [],
      seoDescription: seoDescription
        ? [{ lang: 'EN', text: seoDescription }]
        : [],
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState(() => ({ isLoading: false }));
        log.debug({ response, errors });
        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.setState({ formErrors: validationErrors });
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
        if (variantData) {
          this.handleUpdateVariant(variantData);
        } else {
          this.props.showAlert({
            type: 'success',
            text: 'Product update!',
            link: { text: '' },
          });
          this.setState({ comeResponse: true });
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
        },
        attributes: variantData.attributeValues,
      },
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState(() => ({ isLoading: false }));
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
        this.props.showAlert({
          type: 'success',
          text: 'Product update!',
          link: { text: '' },
        });
        this.setState({ comeResponse: true });
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

  resetComeResponse = () => {
    this.setState({ comeResponse: false });
  };

  render() {
    const { me } = this.props;
    const { isLoading, comeResponse } = this.state;
    let baseProduct = null;
    if (me && me.baseProduct) {
      ({ baseProduct } = me);
    } else {
      return <span>Product not found</span>;
    }
    return (
      <Fragment>
        <div styleName="wrap">
          <Form
            baseProduct={baseProduct}
            onSave={this.handleSave}
            validationErrors={this.state.formErrors}
            categories={this.context.directories.categories}
            isLoading={isLoading}
            comeResponse={comeResponse}
            resetComeResponse={this.resetComeResponse}
          />
        </div>
      </Fragment>
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
        store {
          id
          rawId
          logo
          name {
            text
            lang
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
