// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr, isEmpty } from 'ramda';

import { Page } from 'components/App';
import { Container, Row, Col } from 'layout';
import { log, fromRelayError } from 'utils';
import { UpdateBaseProductMutation } from 'relay/mutations';

import Variants from './Variants/Variants';
import Form from './Form';

import Menu from '../Menu';

type PropsType = {
  //
};

type StateType = {
  formErrors: {},
};

const baseProductFromProps = pathOr(null, ['me', 'baseProductWithVariants', 'baseProduct']);
const variantsFromProps = pathOr(null, ['me', 'baseProductWithVariants', 'variants']);

class EditProduct extends Component<PropsType, StateType> {
  state: StateType = {
    formErrors: {},
  };

  handleSave = (form: ?{}) => {
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
    const id = pathOr(null, ['id'], baseProductFromProps(this.props));
    UpdateBaseProductMutation.commit({
      id,
      name: [{ lang: 'EN', text: name }],
      shortDescription: isEmpty(shortDescription) ? [] : [{ lang: 'EN', text: shortDescription }],
      longDescription: isEmpty(fullDesc) ? [] : [{ lang: 'EN', text: fullDesc }],
      categoryId,
      seoTitle: isEmpty(seoTitle) ? [] : [{ lang: 'EN', text: seoTitle }],
      seoDescription: isEmpty(seoDescription) ? [] : [{ lang: 'EN', text: seoDescription }],
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<Error>) => {
        log.debug({ response, errors });
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        const validationErrors = pathOr(null, ['100', 'messages'], relayErrors);
        if (validationErrors) {
          this.setState({ formErrors: validationErrors });
          return;
        }
        // eslint-disable-next-line
        alert('Something going wrong :(');
      },
    });
  };

  render() {
    const baseProduct = baseProductFromProps(this.props);
    return (
      <Container>
        <Row>
          <Col size={2}>
            <Menu
              activeItem=""
              switchMenu={() => {}}
            />
          </Col>
          <Col size={10}>
            <Form
              baseProduct={baseProduct}
              onSave={this.handleSave}
              validationErrors={this.state.formErrors}
              categories={this.context.directories.categories}
            />
            <Variants
              productId={baseProduct.rawId}
              category={baseProduct.category}
              variants={variantsFromProps(this.props)}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

EditProduct.contextTypes = {
  directories: PropTypes.object.isRequired,
  environment: PropTypes.object.isRequired,
};

export default createFragmentContainer(
  Page(EditProduct),
  graphql`
    fragment EditProduct_me on User
    @argumentDefinitions(productId: { type: "Int!" }) {
      baseProductWithVariants(id: $productID) {
        baseProduct {
          id
          rawId
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
                  lang
                  text
                }
                uiElement
              }
            }
          }
          storeId
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
        variants {
          id
          rawId
          product {
            id
            rawId
            isActive
            discount
            photoMain
            additionalPhotos
            vendorCode
            price
            cashback
          }
          attributes {
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
                  lang
                  text
                }
                uiElement
              }
            }
          }
        }
      }
    }
    `,
);
