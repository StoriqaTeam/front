// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr, isEmpty, map } from 'ramda';

import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { log, fromRelayError } from 'utils';
import { UpdateBaseProductMutation } from 'relay/mutations';
import { withShowAlert } from 'components/App/AlertContext';

import type { AddAlertInputType } from 'components/App/AlertContext';
import type { EditProduct_me as EditProductMeType } from './__generated__/EditProduct_me.graphql';

import Variants from './Variants/Variants';
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
  me: EditProductMeType,
  showAlert: (input: AddAlertInputType) => void,
};

type StateType = {
  formErrors: {
    [string]: Array<string>,
  },
  isLoading: boolean,
};

class EditProduct extends Component<PropsType, StateType> {
  state: StateType = {
    formErrors: {},
    isLoading: false,
  };

  handleSave = (form: FormType) => {
    this.setState({ formErrors: {} });
    if (!form) {
      return;
    }
    const { me } = this.props;
    let baseProduct = null;
    if (me && me.baseProduct) {
      ({ baseProduct } = me);
    } else {
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
    // $FlowIgnoreMe
    const id = pathOr(null, ['id'], baseProduct);
    UpdateBaseProductMutation.commit({
      id,
      name: name ? [{ lang: 'EN', text: name }] : null,
      shortDescription: shortDescription
        ? [{ lang: 'EN', text: shortDescription }]
        : null,
      longDescription: longDescription
        ? [{ lang: 'EN', text: longDescription }]
        : null,
      categoryId,
      seoTitle: seoTitle ? [{ lang: 'EN', text: seoTitle }] : null,
      seoDescription: seoDescription
        ? [{ lang: 'EN', text: seoDescription }]
        : null,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        this.setState(() => ({ isLoading: false }));
        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
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
        this.props.showAlert({
          type: 'success',
          text: 'Saved!',
          link: { text: '' },
        });
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
    const { me } = this.props;
    const { isLoading } = this.state;
    let baseProduct = null;
    if (me && me.baseProduct) {
      ({ baseProduct } = me);
    } else {
      return <span>Product not found</span>;
    }
    // $FlowIgnoreMe
    const storeID = pathOr(null, ['store', 'id'], baseProduct);
    // $FlowIgnoreMe
    const variants = pathOr([], ['baseProduct', 'products', 'edges'], me);
    const filteredVariants = map(item => item.node, variants);
    return (
      <Fragment>
        <Form
          baseProduct={baseProduct}
          onSave={this.handleSave}
          validationErrors={this.state.formErrors}
          categories={this.context.directories.categories}
          isLoading={isLoading}
        />
        <Variants
          productRawId={baseProduct.rawId}
          productId={baseProduct.id}
          // $FlowIgnoreMe
          category={baseProduct.category}
          variants={filteredVariants}
          storeID={storeID}
          showAlert={this.props.showAlert}
        />
      </Fragment>
    );
  }
}

EditProduct.contextTypes = {
  directories: PropTypes.object.isRequired,
  environment: PropTypes.object.isRequired,
};

export default createFragmentContainer(
  withShowAlert(Page(ManageStore(EditProduct, 'Goods'))),
  graphql`
    fragment EditProduct_me on User
      @argumentDefinitions(productId: { type: "Int!" }) {
      baseProduct(id: $productID) {
        id
        rawId
        products(first: 100) @connection(key: "Wizard_products") {
          edges {
            node {
              stocks {
                id
                productId
                warehouseId
                warehouse {
                  name
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
