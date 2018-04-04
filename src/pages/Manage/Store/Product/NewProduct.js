// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import { routerShape, withRouter } from 'found';

import { Page } from 'components/App';
import { Container, Row, Col } from 'layout';
import { log, fromRelayError } from 'utils';
import { CreateBaseProductMutation } from 'relay/mutations';

import Form from './Form';

import Menu from '../Menu';

type StateType = {
  formErrors: ?{},
};

type PropsType = {
  storeId: number,
  router: routerShape,
};

class NewProduct extends Component<PropsType, StateType> {
  constructor(props: PropTypes) {
    super(props);

    // const product = pathOr(null, ['me', 'baseProduct'], this.props);
    // if (!product) {
    //   return;
    // }

    this.state = {
      // form: {
      //   name: pathOr('', ['name', 0, 'text'], product),
      //   seoTitle: pathOr('', ['seoTitle', 0, 'text'], product),
      //   seoDescription: pathOr('', ['seoDescription', 0, 'text'], product),
      //   shortDescription: pathOr('', ['shortDescription', 0, 'text'], product),
      //   fullDesc: pathOr('', ['longDescription', 0, 'text'], product),
      //   categoryId: product.categoryId,
      // },
      formErrors: {},
    };
  }

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
    CreateBaseProductMutation.commit({
      name: [{ lang: 'EN', text: name }],
      storeId: parseInt(this.props.storeId, 10),
      shortDescription: [{ lang: 'EN', text: shortDescription }],
      longDescription: [{ lang: 'EN', text: fullDesc }],
      currencyId: 1,
      categoryId,
      seoTitle,
      seoDescription,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<Error>) => {
        log.debug({ response, errors });
        const { storeId } = this.props;
        const productId = pathOr(null, ['createBaseProduct', 'rawId'], response);
        this.props.router.push(`/manage/store/${storeId}/products/${productId}`);
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
        alert('Something going wrong :(');
      },
    });
  };

  render() {
    // const productId = pathOr(null, ['me', 'baseProduct', 'rawId'], this.props);
    // const categoryId = pathOr(null, ['me', 'baseProduct', 'categoryId'], this.props);
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

NewProduct.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object.isRequired,
};

export default withRouter(Page(NewProduct));
