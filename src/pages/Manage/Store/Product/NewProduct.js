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
  state: StateType = {
    formErrors: {},
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
    CreateBaseProductMutation.commit({
      name: [{ lang: 'EN', text: name }],
      storeId: parseInt(this.props.storeId, 10),
      shortDescription: [{ lang: 'EN', text: shortDescription }],
      longDescription: [{ lang: 'EN', text: fullDesc }],
      currencyId: 1,
      categoryId,
      seoTitle: [{ lang: 'EN', text: seoTitle }],
      seoDescription: [{ lang: 'EN', text: seoDescription }],
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
        alert('Something going wrong :('); // eslint-disable-line
      },
    });
  };

  render() {
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
              onSave={this.handleSave}
              validationErrors={this.state.formErrors}
              categories={this.context.directories.categories}
              baseProduct={null}
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
