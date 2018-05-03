// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import { routerShape, withRouter } from 'found';

import { Page } from 'components/App';
import { Container, Row, Col } from 'layout';
import { log, fromRelayError } from 'utils';
import { CreateBaseProductMutation } from 'relay/mutations';
import { createFragmentContainer, graphql } from 'react-relay';

import Form from './Form';

import Menu from '../Menu';

type StateType = {
  formErrors: ?{},
  isLoading: boolean,
};

type PropsType = {
  match: {
    params: {
      storeId: string,
    },
  },
  router: routerShape,
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
    this.setState(() => ({ isLoading: true }));
    CreateBaseProductMutation.commit({
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
      onCompleted: (response: ?Object, errors: ?Array<Error>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        this.setState(() => ({ isLoading: false }));

        const validationErrors = pathOr(null, ['100', 'messages'], relayErrors);
        if (validationErrors) {
          this.setState({ formErrors: validationErrors });
        }

        const { storeId } = this.props.match.params;
        // $FlowIgnoreMe
        const productId: ?number = pathOr(
          null,
          ['createBaseProduct', 'rawId'],
          response,
        );
        if (productId) {
          this.props.router.push(
            `/manage/store/${storeId}/products/${productId}`,
          );
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
        alert('Something going wrong :('); // eslint-disable-line
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
  withRouter(Page(NewProduct)),
  graphql`
    fragment NewProduct_me on User
      @argumentDefinitions(storeId: { type: "Int!" }) {
      store(id: $storeId) {
        logo
      }
    }
  `,
);
