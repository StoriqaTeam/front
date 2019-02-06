// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pathOr, isEmpty } from 'ramda';
import { routerShape } from 'found';
import uuidv4 from 'uuid/v4';

import { withShowAlert } from 'components/Alerts/AlertContext';
import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { log, fromRelayError } from 'utils';

import { CreateWarehouseMutation } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/CreateWarehouseMutation';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';
import type { FormErrorsType } from 'types';

import Form from '../Form';

import './NewStorage.scss';

import t from './i18n';

type AddressFullType = {
  administrativeAreaLevel1: ?string,
  administrativeAreaLevel2: ?string,
  country: string,
  countryCode: string,
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
  formErrors: FormErrorsType,
  name: string,
  addressFull: AddressFullType,
};

class NewStorage extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      isLoading: false,
      formErrors: {},
      name: '',
      addressFull: {
        administrativeAreaLevel1: '',
        administrativeAreaLevel2: '',
        country: '',
        countryCode: '',
        locality: '',
        political: '',
        postalCode: '',
        route: '',
        streetNumber: '',
        value: '',
      },
    };
  }

  handleSave = (data: { name: string, addressFull: AddressFullType }) => {
    const { environment } = this.context;
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['match', 'params', 'storeId'], this.props);
    const params: MutationParamsType = {
      input: {
        clientMutationId: uuidv4(),
        storeId: parseInt(storeId, 10),
        name: data.name,
        addressFull: {
          ...data.addressFull,
        },
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
            text: `${t.error} "${statusError}"`,
            link: { text: t.close },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: t.storageCreated,
          link: { text: '' },
        });
        this.props.router.push(`/manage/store/${storeId}/storages`);
      },
      onError: (error: Error) => {
        log.debug({ error });
        this.props.showAlert({
          type: 'danger',
          text: t.somethingGoingWrong,
          link: { text: t.close },
        });
      },
    };
    CreateWarehouseMutation.commit(params);
  };

  handleCancel = () => {
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['match', 'params', 'storeId'], this.props);
    if (storeId) {
      this.props.router.push(`/manage/store/${storeId}/storages`);
    }
  };

  render() {
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

NewStorage.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default withShowAlert(
  Page(
    ManageStore({
      OriginalComponent: NewStorage,
      active: 'storages',
      title: 'Storages',
    }),
  ),
);
