// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr, isEmpty } from 'ramda';

import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { log, fromRelayError } from 'utils';
import {
  UpdateBaseProductMutation,
  UpdateStoreMainMutation,
} from 'relay/mutations';
import { withShowAlert } from 'components/App/AlertContext';

import type { AddAlertInputType } from 'components/App/AlertContext';

import Variants from './Variants/Variants';
import Form from './Form';

type PropsType = {
  showAlert: (input: AddAlertInputType) => void,
};

type StateType = {
  formErrors: {},
  isLoading: boolean,
};

const baseProductFromProps = pathOr(null, ['me', 'baseProduct']);
const variantsFromProps = pathOr([], ['me', 'baseProduct', 'variants', 'all']);

class EditProduct extends Component<PropsType, StateType> {
  state: StateType = {
    formErrors: {},
    isLoading: false,
  };

  handleSave = (form: ?{ [string]: any }) => {
    if (!form) {
      return;
    }
    const {
      name,
      categoryId,
      seoTitle,
      seoDescription,
      shortDescription,
      fullDesc,
    } = form;
    this.setState(() => ({ isLoading: true }));
    // $FlowIgnoreMe
    const id = pathOr(null, ['id'], baseProductFromProps(this.props));
    UpdateBaseProductMutation.commit({
      id,
      name: [{ lang: 'EN', text: name }],
      shortDescription: isEmpty(shortDescription)
        ? []
        : [{ lang: 'EN', text: shortDescription }],
      longDescription: isEmpty(fullDesc)
        ? []
        : [{ lang: 'EN', text: fullDesc }],
      categoryId,
      seoTitle: isEmpty(seoTitle) ? [] : [{ lang: 'EN', text: seoTitle }],
      seoDescription: isEmpty(seoDescription)
        ? []
        : [{ lang: 'EN', text: seoDescription }],
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

  handleLogoUpload = (url: string) => {
    const { environment } = this.context;
    const baseProduct = baseProductFromProps(this.props);
    const storeId = pathOr(null, ['store', 'id'], baseProduct);

    UpdateStoreMainMutation.commit({
      id: storeId,
      logo: url,
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

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
          text: 'Saved!',
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong.',
          link: { text: 'Close.' },
        });
      },
    });
  };

  render() {
    const { isLoading } = this.state;
    const baseProduct = baseProductFromProps(this.props);
    // $FlowIgnoreMe
    const storeID = pathOr(null, ['store', 'id'], baseProduct);

    if (!baseProduct) {
      return <span>Product not found</span>;
    }
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
          productId={baseProduct.rawId}
          category={baseProduct.category}
          // $FlowIgnoreMe
          variants={variantsFromProps(this.props)}
          storeID={storeID}
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
        variants {
          all {
            id
            rawId
            isActive
            discount
            photoMain
            additionalPhotos
            vendorCode
            price
            cashback
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