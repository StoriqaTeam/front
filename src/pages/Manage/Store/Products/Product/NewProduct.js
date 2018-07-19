// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { routerShape, withRouter, matchShape } from 'found';
import { pathOr, isEmpty, path } from 'ramda';

import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { log, fromRelayError } from 'utils';
import { CreateBaseProductMutation } from 'relay/mutations';
import { createFragmentContainer, graphql } from 'react-relay';
import { withShowAlert } from 'components/App/AlertContext';

import type { AddAlertInputType } from 'components/App/AlertContext';
import type { NewProduct_me as NewProductMeType } from './__generated__/NewProduct_me.graphql';

import Form from './Form';

type FormType = {
  name: string,
  seoTitle: string,
  seoDescription: string,
  shortDescription: string,
  longDescription: string,
  categoryId: ?number,
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

  handleSave = (form: FormType) => {
    if (!form) {
      return;
    }
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
      currencyId: 6,
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
        this.setState(() => ({ isLoading: false }));

        log.debug({ response, errors });
        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        log.debug({ validationErrors });

        // $FlowIgnoreMe
        const status: string = pathOr('', ['100', 'status'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.setState({ formErrors: validationErrors });
          return;
        } else if (status) {
          this.props.showAlert({
            type: 'danger',
            text: `Error: "${status}"`,
            link: { text: 'Close.' },
          });
          return;
        } else if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          return;
        }

        const { storeId } = this.props.match.params;
        const productId = pathOr(-1, ['createBaseProduct', 'rawId'], response);
        if (productId) {
          this.props.router.push(
            `/manage/store/${storeId}/products/${parseInt(productId, 10)}`,
          );
          this.props.showAlert({
            type: 'success',
            text: 'Product created!',
            link: { text: '' },
          });
        }
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        this.setState(() => ({ isLoading: false }));
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

  render() {
    const { isLoading } = this.state;

    return (
      <Form
        onSave={this.handleSave}
        validationErrors={this.state.formErrors}
        categories={this.context.directories.categories}
        baseProduct={null}
        isLoading={isLoading}
      />
    );
  }
}

NewProduct.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object.isRequired,
};

export default createFragmentContainer(
  withRouter(withShowAlert(Page(ManageStore(NewProduct, 'Goods')))),
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
              currencyId
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
