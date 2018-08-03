// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { assocPath, pathOr, toUpper, isEmpty } from 'ramda';
import { withRouter, routerShape } from 'found';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { log, fromRelayError } from 'utils';
import { withShowAlert } from 'components/App/AlertContext';

import { CreateStoreMutation } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/CreateStoreMutation';

import type { AddAlertInputType } from 'components/App/AlertContext';

import Form from './Form';

type StateType = {
  serverValidationErrors: any,
  logoUrl?: string,
  isLoading: boolean,
};

type PropsType = {
  router: routerShape,
  showAlert: (input: AddAlertInputType) => void,
  newStoreLogo: ?string,
  newStoreName: ?string,
  handleNewStoreNameChange: (value: string) => void,
};

class NewStore extends Component<PropsType, StateType> {
  state: StateType = {
    serverValidationErrors: {},
    isLoading: false,
  };

  handleShopCurrency = (shopCurrency: { id: string, label: string }) => {
    this.setState(assocPath(['form', 'currencyId'], +shopCurrency.id));
  };

  handleSave = ({ form, optionLanguage }) => {
    const { environment, currentUser } = this.context;
    const { newStoreName, newStoreLogo } = this.props;
    if (!newStoreName) {
      this.props.showAlert({
        type: 'danger',
        text: 'Something going wrong :(',
        link: { text: 'Close.' },
      });
      return;
    }
    const {
      longDescription,
      shortDescription,
      defaultLanguage,
      slug,
      slogan,
    } = form;
    this.setState(() => ({ isLoading: true, serverValidationErrors: {} }));

    const params: MutationParamsType = {
      input: {
        clientMutationId: '',
        userId: parseInt(currentUser.rawId, 10),
        name: [{ lang: optionLanguage, text: newStoreName }],
        // $FlowIgnoreMe
        defaultLanguage: toUpper(defaultLanguage),
        longDescription: [{ lang: optionLanguage, text: longDescription }],
        shortDescription: [{ lang: optionLanguage, text: shortDescription }],
        slug,
        slogan,
        logo: newStoreLogo,
        addressFull: {},
      },
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });
        this.setState({ isLoading: false });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.setState({ serverValidationErrors: validationErrors });
          return;
        }

        // $FlowIgnoreMe
        const statusError: string = pathOr('', ['100', 'status'], relayErrors);
        if (!isEmpty(statusError)) {
          this.props.showAlert({
            type: 'danger',
            text: `Error: "${statusError}"`,
            link: { text: 'Close.' },
          });
          return;
        }

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
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
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        log.error(error);
        this.setState({ isLoading: false });
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong.',
          link: { text: 'Close.' },
        });
      },
    };
    CreateStoreMutation.commit(params);
  };

  render() {
    const { isLoading, serverValidationErrors } = this.state;
    return (
      <Form
        onSave={this.handleSave}
        isLoading={isLoading}
        serverValidationErrors={serverValidationErrors}
        handleNewStoreNameChange={this.props.handleNewStoreNameChange}
      />
    );
  }
}

export default withShowAlert(
  Page(withRouter(ManageStore(NewStore, 'Settings')), true),
);

NewStore.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object,
  currentUser: currentUserShape,
  showAlert: PropTypes.func,
};
