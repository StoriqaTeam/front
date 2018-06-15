// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pathOr, isEmpty } from 'ramda';
import { createFragmentContainer, graphql } from 'react-relay';
import { routerShape } from 'found';

import { withShowAlert } from 'components/App/AlertContext';
import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { log, fromRelayError } from 'utils';

import { UpdateWarehouseMutation } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/UpdateWarehouseMutation';

import type { AddAlertInputType } from 'components/App/AlertContext';

import Form from './Form';

import './EditStorage.scss';
import storage from './storage.json';

type AddressFullType = {
  administrativeAreaLevel1: ?string,
  administrativeAreaLevel2: ?string,
  country: string,
  locality: ?string,
  political: ?string,
  postalCode: string,
  route: ?string,
  streetNumber: ?string,
  value: ?string,
};

type PropsType = {
  router: routerShape,
  showAlert: (input: AddAlertInputType) => void,
};

type StateType = {
  isLoading: boolean,
  formErrors: {
    [string]: string,
  },
  name: string,
  addressFull: AddressFullType,
};

class EditStorage extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      isLoading: false,
      formErrors: {},
      name: storage.name,
      addressFull: storage.addressFull,
    };
  }

  handleSave = (data: { name: string, addressFull: AddressFullType }) => {
    log.info('---data', data);
    // return;
    const { environment } = this.context;
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['match', 'params', 'storeId'], this.props);
    const params: MutationParamsType = {
      input: {
        clientMutationId: '',
        storeId: parseInt(storeId, 10),
        id: storage.id,
        name: data.name,
        addressFull: {
          ...data.addressFull,
        },
        kind: 'STORE',
      },
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState(() => ({ isLoading: false }));
        log.debug({ response, errors });
        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.setState({ formErrors: validationErrors });
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
          text: 'Storage update!',
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        log.debug({ error });
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong :(',
          link: { text: 'Close.' },
        });
      },
    };
    UpdateWarehouseMutation.commit(params);
  };

  handleCancel = () => {
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['match', 'params', 'storeId'], this.props);
    if (storeId) {
      this.props.router.push(`/manage/store/${storeId}/storages`);
    }
  };

  render() {
    // const storeId = pathOr(null, ['match', 'params', 'storeId'], this.props);
    const { name, addressFull, isLoading, formErrors } = this.state;
    return (
      <div styleName="container">
        <Form
          isLoading={isLoading}
          name={name}
          addressFull={addressFull}
          handleCancel={this.handleCancel}
          formErrors={formErrors}
          handleSave={this.handleSave}
        />
      </div>
    );
  }
}

EditStorage.contextTypes = {
  environment: PropTypes.object.isRequired,
};

// export default withShowAlert(Page(ManageStore(EditStorage, 'Storages', 'Add new storage')));

export default createFragmentContainer(
  withShowAlert(Page(ManageStore(EditStorage, 'Storages', 'Add new storage'))),
  graphql`
    fragment EditStorage_me on User
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
