// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pathOr, toUpper, isEmpty } from 'ramda';
import { createFragmentContainer, graphql } from 'react-relay';

import { withShowAlert } from 'components/Alerts/AlertContext';
import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { log, fromRelayError } from 'utils';

import { UpdateStoreMainMutation } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/UpdateStoreMainMutation';
import type { AddAlertInputType } from 'components/Alerts/AlertContext';
import type { EditStore_me as EditStoreMeType } from './__generated__/EditStore_me.graphql';

import Form from './Form';

type PropsType = {
  me: EditStoreMeType,
  showAlert: (input: AddAlertInputType) => void,
};

type StateType = {
  serverValidationErrors: any,
  logoUrl?: string,
  isLoading: boolean,
};

class EditStore extends Component<PropsType, StateType> {
  state: StateType = {
    serverValidationErrors: {},
    isLoading: false,
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
      cover,
      slogan,
    } = form;
    this.setState(() => ({ isLoading: true }));
    // $FlowIgnoreMe
    const id = pathOr(null, ['me', 'myStore', 'id'], this.props);
    const params: MutationParamsType = {
      input: {
        clientMutationId: '',
        id,
        name: [{ lang: optionLanguage, text: name }],
        // $FlowIgnoreMe
        defaultLanguage: toUpper(defaultLanguage),
        longDescription: [{ lang: optionLanguage, text: longDescription }],
        shortDescription: [{ lang: optionLanguage, text: shortDescription }],
        slug,
        cover,
        slogan,
        logo: logoUrl,
        addressFull: {},
      },
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
        // $FlowIgnoreMe
        const statusError: string = pathOr({}, ['100', 'status'], relayErrors);
        if (!isEmpty(statusError)) {
          this.props.showAlert({
            type: 'danger',
            text: `Error: "${statusError}"`,
            link: { text: 'Close.' },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Saved!',
          link: { text: '' },
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
    };
    UpdateStoreMainMutation.commit(params);
  };

  render() {
    const { isLoading } = this.state;
    // $FlowIgnoreMe
    const store = pathOr(null, ['myStore'], this.props.me);
    if (!store) {
      return <div>Store not found :(</div>;
    }
    return (
      <Form
        store={store}
        onSave={this.handleSave}
        isLoading={isLoading}
        serverValidationErrors={this.state.serverValidationErrors}
      />
    );
  }
}

export default createFragmentContainer(
  Page(withShowAlert(ManageStore(EditStore, 'Settings')), true),
  graphql`
    fragment EditStore_me on User {
      myStore {
        id
        rawId
        name {
          lang
          text
        }
        logo
        cover
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
