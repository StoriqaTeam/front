// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  pathOr,
  toUpper,
} from 'ramda';
import { createFragmentContainer, graphql } from 'react-relay';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { UpdateStoreMainMutation } from 'relay/mutations';
import { Container, Row, Col } from 'layout';
import { log, fromRelayError } from 'utils';

import Form from './Form';
import Menu from './Menu';

import './EditStore.scss';

type PropsType = {
  me?: { store?: {} }, // eslint-disable-line
};

type StateType = {
  activeItem: string,
  serverValidationErrors: any,
  activeItem: string,
  logoUrl?: string,
};

class EditStore extends Component<PropsType, StateType> {
  state: StateType = {
    activeItem: 'settings',
    serverValidationErrors: {},
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
    const id = pathOr(null, ['me', 'store', 'id'], this.props);
    UpdateStoreMainMutation.commit({
      id,
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
      logo: logoUrl,
      environment,
      onCompleted: (response: ?Object, errors: ?Array<Error>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        const validationErrors = pathOr(null, ['100', 'messages'], relayErrors);
        if (validationErrors) {
          this.setState({ serverValidationErrors: validationErrors });
        }
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
    const { activeItem, logoUrl } = this.state;

    const store = pathOr(null, ['me', 'store'], this.props);

    if (!store) {
      return (<div>Store not found :(</div>);
    }

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
  Page(EditStore),
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
