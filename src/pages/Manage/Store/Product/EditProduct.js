// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr } from 'ramda';

import { Page } from 'components/App';
import { Container, Row, Col } from 'layout';
import { log, fromRelayError } from 'utils';

import Form from './Form';

import Menu from '../Menu';

type PropsType = {
  //
};

type StateType = {
  //
};

class EditProduct extends Component<PropsType, StateType> {
  state: StateType = {
    //
  };
  render() {
    const baseProduct = pathOr(null, ['me', 'baseProduct'], this.props);
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
          </Col>
        </Row>
      </Container>
    );
  }
}

EditProduct.contextTypes = {
  directories: PropTypes.object.isRequired,
};

export default createFragmentContainer(
  Page(EditProduct),
  graphql`
    fragment EditProduct_me on User
    @argumentDefinitions(productId: { type: "Int!" }) {
      baseProduct(id:$productId) {
        id
        rawId
        categoryId
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
    }
  `,
);

/* categories {
  children {
    children {
      children {
        rawId
        name {
          lang
          text
        }
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
    }
  }
} */
