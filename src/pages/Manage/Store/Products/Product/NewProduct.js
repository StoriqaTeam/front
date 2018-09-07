// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { routerShape, withRouter, matchShape } from 'found';
import { pathOr, isEmpty, path } from 'ramda';

import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { log, fromRelayError } from 'utils';
import {
  CreateBaseProductMutation,
  CreateProductWithAttributesMutation,
} from 'relay/mutations';
import { createFragmentContainer, graphql } from 'react-relay';
import { withShowAlert } from 'components/App/AlertContext';

import type { AddAlertInputType } from 'components/App/AlertContext';
import type { MutationParamsType as CreateProductWithAttributesMutationType } from 'relay/mutations/CreateProductWithAttributesMutation';
import type { NewProduct_me as NewProductMeType } from './__generated__/NewProduct_me.graphql';

import Form from './Form';

import './Product.scss';

type AttributeValueType = {
  attrId: number,
  value: string,
  metaField?: ?string,
};

type VariantType = {
  productRawId: ?string,
  vendorCode: string,
  price: number,
  cashback?: ?number,
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
  currencyId: number,
};

type PropsType = {
  me: NewProductMeType,
  showAlert: (input: AddAlertInputType) => void,
  match: {
    params: {
      storeId: string,
    },
  },
  router: routerShape,
  match: matchShape,
};

type StateType = {
  formErrors: {
    [string]: Array<string>,
  },
  isLoading: boolean,
};

class NewProduct extends Component<PropsType, StateType> {
  state: StateType = {
    formErrors: {},
    isLoading: false,
  };

  handleSave = (form: FormType, variantData: VariantType) => {
    this.setState({ formErrors: {} });
    const { me } = this.props;
    const {
      name,
      categoryId,
      seoTitle,
      seoDescription,
      shortDescription,
      longDescription,
    } = form;
    const storeID = path(['myStore', 'id'], me);
    this.setState(() => ({ isLoading: true }));

    CreateBaseProductMutation.commit({
      parentID: storeID,
      name: [{ lang: 'EN', text: name }],
      storeId: parseInt(this.props.match.params.storeId, 10),
      shortDescription: [{ lang: 'EN', text: shortDescription }],
      longDescription: [{ lang: 'EN', text: longDescription }],
      currency: 'STQ',
      categoryId,
      seoTitle:
        !seoTitle || seoTitle.length === 0
          ? null
          : [{ lang: 'EN', text: seoTitle }],
      seoDescription:
        !seoDescription || seoDescription.length === 0
          ? null
          : [{ lang: 'EN', text: seoDescription }],
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
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
        if (!isEmpty(validationErrors)) {
          this.setState({ formErrors: validationErrors });
          return;
        }
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

        const baseProductId = pathOr(
          null,
          ['createBaseProduct', 'id'],
          response,
        );
        const baseProductRawId = pathOr(
          null,
          ['createBaseProduct', 'rawId'],
          response,
        );
        if (baseProductId && baseProductRawId) {
          this.handleCreateVariant({
            // $FlowIgnore
            baseProductId,
            // $FlowIgnore
            baseProductRawId,
            variantData,
          });
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

  handleCreateVariant = (props: {
    baseProductId: string,
    baseProductRawId: number,
    variantData: VariantType,
  }) => {
    const { storeId } = this.props.match.params;
    const { baseProductId, baseProductRawId, variantData } = props;
    const {
      price,
      vendorCode,
      mainPhoto: photoMain,
      photos: additionalPhotos,
      cashback,
      attributeValues: attributes,
    } = variantData;
    const params: CreateProductWithAttributesMutationType = {
      input: {
        clientMutationId: '',
        product: {
          baseProductId: baseProductRawId,
          price,
          vendorCode,
          photoMain,
          additionalPhotos,
          cashback: cashback ? cashback / 100 : null,
        },
        attributes,
      },
      parentID: baseProductId,
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
        this.props.router.push(
          `/manage/store/${storeId}/products/${parseInt(baseProductRawId, 10)}`,
        );
        this.props.showAlert({
          type: 'success',
          text: 'Product created!',
          link: { text: '' },
        });
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
    CreateProductWithAttributesMutation.commit(params);
  };

  render() {
    const { isLoading } = this.state;

    return (
      <div styleName="wrap">
        <Form
          onSave={this.handleSave}
          validationErrors={this.state.formErrors}
          categories={this.context.directories.categories}
          baseProduct={null}
          isLoading={isLoading}
        />
      </div>
    );
  }
}

NewProduct.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object.isRequired,
};

export default createFragmentContainer(
  withRouter(withShowAlert(Page(ManageStore(NewProduct, 'Goods'), true))),
  graphql`
    fragment NewProduct_me on User {
      myStore {
        id
        logo
        name {
          text
          lang
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
