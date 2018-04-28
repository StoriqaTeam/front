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
  isLoading: boolean,
};

const baseProductFromProps = pathOr(null, ['me', 'baseProduct']);
const storeLogoFromProps = pathOr(null, ['me', 'baseProduct', 'store', 'logo']);
const variantsFromProps = pathOr(null, [
  'me',
  'baseProduct',
  'variants',
  'all',
]);

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
      onCompleted: (response: ?Object, errors: ?Array<Error>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        this.setState(() => ({ isLoading: false }));
        const validationErrors = pathOr(null, ['100', 'messages'], relayErrors);
        if (validationErrors) {
          this.setState({ formErrors: validationErrors });
        }
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        this.setState(() => ({ isLoading: false }));
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
    const { isLoading } = this.state;
    const baseProduct = baseProductFromProps(this.props);
    const logo = storeLogoFromProps(this.props);

    if (!baseProduct) {
      return <span>Product not found</span>;
    }
    return (
      <Container>
        <Row>
          <Col size={2}>
            <Menu
              activeItem=""
              switchMenu={() => {}}
              storeLogo={logo || ''}
            />
          </Col>
          <Col size={10}>
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
