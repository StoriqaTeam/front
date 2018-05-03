// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { assocPath, pathOr, toUpper } from 'ramda';
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
  logoUrl?: string,
  isLoading: boolean,
};

type PropsType = {
  router: routerShape,
};

class NewStore extends Component<PropsType, StateType> {
  state: StateType = {
    activeItem: 'settings',
    serverValidationErrors: {},
    isLoading: false,
  };

  handleShopCurrency = (shopCurrency: { id: string, label: string }) => {
    this.setState(assocPath(['form', 'currencyId'], +shopCurrency.id));
  };

  handleLogoUpload = (url: string) => {
    this.setState({ logoUrl: url });
  };

  handleSave = ({ form, optionLanguage }) => {
    const { environment, currentUser, showAlert } = this.context;
    const {
      name,
      longDescription,
      shortDescription,
      defaultLanguage,
      slug,
      slogan,
    } = form;
    const { logoUrl } = this.state;
    this.setState(() => ({ isLoading: true }));

    CreateStoreMutation.commit({
      userId: parseInt(currentUser.rawId, 10),
      name: [{ lang: optionLanguage, text: name }],
      defaultLanguage: toUpper(defaultLanguage),
      longDescription: [{ lang: optionLanguage, text: longDescription }],
      shortDescription: [{ lang: optionLanguage, text: shortDescription }],
      slug,
      slogan,
      logo: logoUrl,
      environment,
      onCompleted: (response: ?Object, errors: ?Array<Error>) => {
        this.setState(() => ({ isLoading: false }));
        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        const validationErrors = pathOr(null, ['100', 'messages'], relayErrors);
        if (validationErrors) {
          this.setState({ serverValidationErrors: validationErrors });
          return;
        }
        // $FlowIgnoreMe
        const storeId: ?number = pathOr(
          null,
          ['createStore', 'rawId'],
          response,
        );
        if (storeId) {
          this.props.router.push(`/manage/store/${storeId}`);
        }
        showAlert('Store created!', false);
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
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

  switchMenu = activeItem => {
    this.setState({ activeItem });
  };

  render() {
    const { activeItem, logoUrl, isLoading } = this.state;
    return (
      <Container>
        <Row>
          <Col size={2}>
            <Menu
              activeItem={activeItem}
              switchMenu={this.switchMenu}
              onLogoUpload={this.handleLogoUpload}
              storeLogo={logoUrl}
            />
          </Col>
          <Col size={10}>
            <div styleName="container">
              <Form
                onSave={this.handleSave}
                isLoading={isLoading}
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
  showAlert: PropTypes.func,
};
