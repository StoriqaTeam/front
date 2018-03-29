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
  me?: { store?: {} },
};

type StateType = {
  activeItem: string,
  serverValidationErrors: any,
};

class EditStore extends Component<PropsType, StateType> {
  state = {
    activeItem: 'settings',
    serverValidationErrors: {},
  };

  handleSave = ({ form, optionLanguage }) => {
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
      environment,
      onCompleted: (response: ?Object, errors: ?Array<Error>) => {
        log.debug({ response, errors });
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

    let store;
    const { me } = this.props;
    if (me) {
      store = me.store; // eslint-disable-line
    }
    return (
      <Container>
        <Row>
          <Col size={2}>
            <Menu
              activeItem={activeItem}
              switchMenu={this.switchMenu}
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
    @argumentDefinitions(storeId: { type: "ID!" }) {
      store(id: $storeId) {
        id
        rawId
        name {
          lang
          text
        }
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
