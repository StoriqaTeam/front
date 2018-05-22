// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { assocPath, pathOr, toUpper, isEmpty } from 'ramda';
import { withRouter, routerShape } from 'found';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { CreateStoreMutation } from 'relay/mutations';
import { Container, Row, Col } from 'layout';
import { log, fromRelayError } from 'utils';
import { withShowAlert } from 'components/App/AlertContext';

import type { AddAlertInputType } from 'components/App/AlertContext';

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
  showAlert: (input: AddAlertInputType) => void,
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
    const { environment, currentUser } = this.context;
    const {
      name,
      longDescription,
      shortDescription,
      defaultLanguage,
      slug,
      slogan,
    } = form;
    const { logoUrl } = this.state;
    this.setState(() => ({ isLoading: true, serverValidationErrors: {} }));

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
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState(() => ({ isLoading: false }));
        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
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
        this.props.showAlert({
          type: 'success',
          text: 'Store created!',
          link: { text: 'Ok!' },
        });
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.setState({ serverValidationErrors: validationErrors });
          return;
        }

        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong :(',
          link: { text: 'Got it!' },
        });
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

export default withShowAlert(withRouter(Page(NewStore)));

NewStore.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object,
  currentUser: currentUserShape,
  showAlert: PropTypes.func,
};
