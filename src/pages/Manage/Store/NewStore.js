// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  assocPath,
  pathOr,
  toUpper,
} from 'ramda';
import { withRouter, routerShape } from 'found';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { CreateStoreMutation } from 'relay/mutations';
import { Container, Row, Col } from 'layout';
import { log, fromRelayError } from 'utils';

import Form from './Form';
import Menu from './Menu';

import './EditStore.scss';

type StateType = {
  activeItem: string,
  serverValidationErrors: any,
};

type PropsType = {
  router: routerShape,
};

class NewStore extends Component<PropsType, StateType> {
  state = {
    activeItem: 'settings',
    serverValidationErrors: {},
  };

  handleShopCurrency = (shopCurrency: { id: string, label: string }) => {
    this.setState(assocPath(['form', 'currencyId'], +shopCurrency.id));
  };

  handleSave = ({ form, optionLanguage }) => {
    const {
      environment,
      currentUser,
    } = this.context;
    const {
      name,
      longDescription,
      shortDescription,
      defaultLanguage,
      slug,
      slogan,
    } = form;

    CreateStoreMutation.commit({
      userId: parseInt(currentUser.rawId, 10),
      name: [
        { lang: optionLanguage, text: name },
      ],
      defaultLanguage: toUpper(defaultLanguage),
      longDescription: [
        { lang: optionLanguage, text: longDescription },
      ],
      shortDescription: [
        { lang: optionLanguage, text: shortDescription },
      ],
      slug,
      slogan,
      environment,
      onCompleted: (response: ?Object) => {
        const storeId = pathOr(null, ['createStore', 'rawId'], response);
        this.props.router.push(`/manage/store/${storeId}`);
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });

        const validationErrors = pathOr(null, ['100', 'messages'], relayErrors);
        if (validationErrors) {
          this.setState({ serverValidationErrors: validationErrors });
          return;
        }

        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          return;
        }
        // eslint-disable-next-line
        alert('Something going wrong :(');
      },
    });
  };

  switchMenu = (activeItem) => {
    this.setState({ activeItem });
  };

  render() {
    const {
      activeItem,
    } = this.state;

    return (
      <Container>
        <Row>
          <Col size={2}>
            <Menu
              activeItem={activeItem}
              switchMenu={this.switchMenu}
              storeName=""
            />
          </Col>
          <Col size={10}>
            <div styleName="container">
              <Form
                onSave={this.handleSave}
                serverValidationErrors={this.state.serverValidationErrors}
              />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(Page(NewStore));

NewStore.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object,
  currentUser: currentUserShape,
};
