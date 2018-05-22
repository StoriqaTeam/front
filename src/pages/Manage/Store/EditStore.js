// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pathOr, toUpper, isEmpty } from 'ramda';
import { createFragmentContainer, graphql } from 'react-relay';

import { withShowAlert } from 'components/App/AlertContext';
import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { UpdateStoreMainMutation } from 'relay/mutations';
import { Container, Row, Col } from 'layout';
import { log, fromRelayError } from 'utils';

import type { AddAlertInputType } from 'components/App/AlertContext';

import Form from './Form';
import Menu from './Menu';

import './EditStore.scss';

type PropsType = {
  me?: { store?: { logo: string } },
  showAlert: (input: AddAlertInputType) => void,
};

type StateType = {
  activeItem: string,
  serverValidationErrors: any,
  activeItem: string,
  logoUrl?: string,
  isLoading: boolean,
};

class EditStore extends Component<PropsType, StateType> {
  state: StateType = {
    activeItem: 'settings',
    serverValidationErrors: {},
    isLoading: false,
  };

  handleLogoUpload = (url: string) => {
    this.setState({ logoUrl: url });
  };

  handleSave = ({ form, optionLanguage }) => {
    const { logoUrl } = this.state;
    const { environment } = this.context;
    const {
      name,
      longDescription,
      shortDescription,
      defaultLanguage,
      slug,
      slogan,
    } = form;
    this.setState(() => ({ isLoading: true }));
    // $FlowIgnoreMe
    const id = pathOr(null, ['me', 'store', 'id'], this.props);
    UpdateStoreMainMutation.commit({
      id,
      name: [{ lang: optionLanguage, text: name }],
      defaultLanguage: toUpper(defaultLanguage),
      longDescription: [{ lang: optionLanguage, text: longDescription }],
      shortDescription: [{ lang: optionLanguage, text: shortDescription }],
      slug,
      slogan,
      logo: logoUrl,
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        this.setState(() => ({ isLoading: false }));
        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.setState({ serverValidationErrors: validationErrors });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Saved!',
          link: { text: 'Ok!' },
        });
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });

        this.setState(() => ({ isLoading: false }));
        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.setState({ serverValidationErrors: validationErrors });
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

  switchMenu = activeItem => {
    this.setState({ activeItem });
  };

  render() {
    const { activeItem, logoUrl, isLoading } = this.state;
    // $FlowIgnoreMe
    const store = pathOr(null, ['store'], this.props.me);

    if (!store) {
      return <div>Store not found :(</div>;
    }

    // $FlowIgnoreMe
    const name = pathOr('', ['name', 0, 'text'], store);
    const { logo } = store;
    return (
      <Container>
        <Row>
          <Col size={2}>
            <Menu
              activeItem={activeItem}
              switchMenu={this.switchMenu}
              storeName={name}
              storeLogo={logoUrl || logo}
              onLogoUpload={this.handleLogoUpload}
            />
          </Col>
          <Col size={10}>
            <div styleName="container">
              <Form
                store={store}
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

export default createFragmentContainer(
  Page(withShowAlert(EditStore)),
  graphql`
    fragment EditStore_me on User
      @argumentDefinitions(storeId: { type: "Int!" }) {
      store(id: $storeId) {
        id
        rawId
        name {
          lang
          text
        }
        logo
        slogan
        defaultLanguage
        slug
        shortDescription {
          lang
          text
        }
        longDescription {
          lang
          text
        }
      }
    }
  `,
);

EditStore.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object,
  currentUser: currentUserShape,
};
