// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pathOr, toUpper, isEmpty } from 'ramda';
import { createFragmentContainer, graphql } from 'react-relay';
import uuidv4 from 'uuid/v4';

import { withShowAlert } from 'components/Alerts/AlertContext';
import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { log, fromRelayError } from 'utils';
import { renameKeys } from 'utils/ramda';
import { UpdateStoreMainMutation } from 'relay/mutations';

import type { MutationParamsType } from 'relay/mutations/UpdateStoreMainMutation';
import type { AddAlertInputType } from 'components/Alerts/AlertContext';

// import draftStoreFromUserMutation from './mutations/DraftStoreFromUserMutation';
import sendStoreToModerationByUserMutation from '../mutations/SendStoreToModerationByUserMutation';
import type { EditStore_me as EditStoreMeType } from './__generated__/EditStore_me.graphql';
import Form from '../Form';

import t from './i18n';

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
    this.setState(() => ({ isLoading: true, serverValidationErrors: {} }));
    // $FlowIgnoreMe
    const id = pathOr(null, ['me', 'myStore', 'id'], this.props);
    const params: MutationParamsType = {
      input: {
        clientMutationId: uuidv4(),
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
          this.setState({
            serverValidationErrors: renameKeys(
              {
                long_description: 'longDescription',
                short_description: 'shortDescription',
              },
              validationErrors,
            ),
          });
          return;
        }
        // $FlowIgnoreMe
        const statusError: string = pathOr({}, ['100', 'status'], relayErrors);
        if (!isEmpty(statusError)) {
          this.props.showAlert({
            type: 'danger',
            text: `${t.error} "${statusError}"`,
            link: { text: t.close },
          });
          return;
        }

        this.props.showAlert({
          type: 'success',
          text: t.saved,
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
          text: t.somethingGoingWrong,
          link: { text: t.close },
        });
      },
    };
    UpdateStoreMainMutation.commit(params);
  };

  handleSendToModeration = () => {
    if (this.props.me && this.props.me.myStore) {
      this.setState({ isLoading: true });
      sendStoreToModerationByUserMutation({
        environment: this.context.environment,
        variables: {
          // $FlowIgnoreMe
          id: this.props.me.myStore.rawId,
        },
      })
        .then(() => {
          this.props.showAlert({
            type: 'success',
            text: t.storeHasBeenSentToModeration,
            link: { text: t.close },
          });
          return true;
        })
        .finally(() => {
          this.setState({ isLoading: false });
        })
        .catch(error => {
          const errMsg = pathOr(t.somethingGoingWrong, ['data', 'details'])(
            error,
          );
          this.props.showAlert({
            type: 'danger',
            text: errMsg,
            link: { text: t.close },
          });
        });
    }
  };

  render() {
    const { isLoading } = this.state;
    // $FlowIgnoreMe
    const store = pathOr(null, ['myStore'], this.props.me);
    if (!store) {
      return <div>{t.storeNotFound}</div>;
    }
    return (
      <Form
        store={store}
        onSave={this.handleSave}
        onClickOnSendToModeration={this.handleSendToModeration}
        isLoading={isLoading}
        serverValidationErrors={this.state.serverValidationErrors}
      />
    );
  }
}

export default createFragmentContainer(
  Page(
    withShowAlert(
      ManageStore({
        OriginalComponent: EditStore,
        active: 'settings',
        title: 'Settings',
      }),
    ),
  ),
  graphql`
    fragment EditStore_me on User {
      id
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
        status
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
