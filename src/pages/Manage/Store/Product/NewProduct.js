// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { routerShape, withRouter, matchShape } from 'found';
import { pathOr, isEmpty, path } from 'ramda';

import { Page } from 'components/App';
import { Container, Row, Col } from 'layout';
import { log, fromRelayError } from 'utils';
import { CreateBaseProductMutation } from 'relay/mutations';
import { createFragmentContainer, graphql } from 'react-relay';
import { withShowAlert } from 'components/App/AlertContext';

import type { AddAlertInputType } from 'components/App/AlertContext';

import Form from './Form';

import Menu from '../Menu';

type StateType = {
  formErrors: ?{},
  isLoading: boolean,
};

type PropsType = {
  showAlert: (input: AddAlertInputType) => void,
  match: {
    params: {
      storeId: string,
    },
  },
  router: routerShape,
  match: matchShape,
};

const storeLogoFromProps = pathOr(null, ['me', 'store', 'logo']);

class NewProduct extends Component<PropsType, StateType> {
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
    const storeID = path(['me', 'store', 'id'], this.props);
    this.setState(() => ({ isLoading: true }));
    CreateBaseProductMutation.commit({
      parentID: storeID,
      name: [{ lang: 'EN', text: name }],
      storeId: parseInt(this.props.match.params.storeId, 10),
      shortDescription: [{ lang: 'EN', text: shortDescription }],
      longDescription: [{ lang: 'EN', text: fullDesc }],
      currencyId: 1,
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
            link: { text: 'Ok!' },
          });
        }
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        this.setState(() => ({ isLoading: false }));
        // $FlowIgnoreMe
        const validationErrors = pathOr(null, ['100', 'messages'], relayErrors);
        if (validationErrors) {
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
    // $FlowIgnoreMe
    const logo = storeLogoFromProps(this.props);

    return (
      <Container>
        <Row>
          <Col size={2}>
            <Menu activeItem="" switchMenu={() => {}} storeLogo={logo || ''} />
          </Col>
          <Col size={10}>
            <Form
              onSave={this.handleSave}
              validationErrors={this.state.formErrors}
              categories={this.context.directories.categories}
              baseProduct={null}
              isLoading={isLoading}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

NewProduct.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object.isRequired,
};

export default createFragmentContainer(
  withRouter(withShowAlert(Page(NewProduct))),
  graphql`
    fragment NewProduct_me on User
      @argumentDefinitions(storeId: { type: "Int!" }) {
      store(id: $storeId) {
        id
        logo
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
