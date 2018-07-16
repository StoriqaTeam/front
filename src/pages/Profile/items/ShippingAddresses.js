// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { assocPath, map, assoc } from 'ramda';
import { createFragmentContainer, graphql } from 'react-relay';

import { AddressForm } from 'components/AddressAutocomplete';
import { Checkbox } from 'components/common/Checkbox';
import { Button } from 'components/common/Button';
import { withShowAlert } from 'components/App/AlertContext';

import type { AddAlertInputType } from 'components/App/AlertContext';

import { log, fromRelayError } from 'utils';
import {
  CreateUserDeliveryAddressMutation,
  DeleteUserDeliveryAddressMutation,
  UpdateUserDeliveryAddressMutation,
} from 'relay/mutations';

import type { MutationParamsType as UpdateMutationParamsType } from 'relay/mutations/UpdateUserDeliveryAddressMutation';
import type { MutationParamsType as CreateMutationParamsType } from 'relay/mutations/CreateUserDeliveryAddressMutation';
import type { MutationParamsType as DeleteMutationParamsType } from 'relay/mutations/DeleteUserDeliveryAddressMutation';

import '../Profile.scss';

type DeliveryAddressesType = {
  id: string,
  rawId: number,
  isPriority: boolean,
  userId: number,
  address: {
    country: string,
    administrativeAreaLevel1: ?string,
    administrativeAreaLevel2: ?string,
    political: ?string,
    postalCode: string,
    streetNumber: ?string,
    value: ?string,
    route: ?string,
    locality: ?string,
  },
};

type PropsType = {
  me: {
    rawId: number,
    firstName: string,
    lastName: string,
    email: string,
    deliveryAddresses: Array<DeliveryAddressesType>,
  },
  showAlert: (input: AddAlertInputType) => void,
};

type FormType = {
  administrativeAreaLevel1: ?string,
  administrativeAreaLevel2: ?string,
  country: string,
  locality: ?string,
  political: ?string,
  postalCode: string,
  route: ?string,
  streetNumber: ?string,
  value: ?string,
  isPriority: boolean,
};

type StateType = {
  isLoading: boolean,
  form: FormType,
  isOpenNewForm: boolean,
  editableAddressId: ?number,
};

const resetForm = {
  administrativeAreaLevel1: '',
  administrativeAreaLevel2: '',
  country: '',
  locality: '',
  political: '',
  postalCode: '',
  route: '',
  streetNumber: '',
  value: '',
  isPriority: true,
};

class ShippingAddresses extends Component<PropsType, StateType> {
  state = {
    form: resetForm,
    isLoading: false,
    isOpenNewForm: false,
    editableAddressId: null,
  };

  handleSave = (id: ?number) => {
    const { environment } = this.context;
    const { me } = this.props;
    const { form } = this.state;
    const {
      country,
      administrativeAreaLevel1,
      administrativeAreaLevel2,
      political,
      postalCode,
      streetNumber,
      value,
      route,
      locality,
      isPriority,
    } = form;

    const availabilityErrors = {};

    if (!country || !postalCode) {
      if (!country)
        assoc('country', 'Country is required parameter', availabilityErrors);
      if (!postalCode)
        assoc(
          'postalCode',
          'Postal code is required parameter',
          availabilityErrors,
        );
      this.props.showAlert({
        type: 'danger',
        text: 'Country and postal code are required parameters',
        link: { text: '' },
      });
      return;
    }

    this.setState(() => ({ isLoading: true }));

    const input = {
      clientMutationId: '',
      country,
      administrativeAreaLevel1: administrativeAreaLevel1 || null,
      administrativeAreaLevel2: administrativeAreaLevel2 || null,
      political: political || null,
      postalCode,
      streetNumber: streetNumber || null,
      address: value || null,
      route: route || null,
      locality: locality || null,
      isPriority,
    };

    const createInput = { ...input, userId: me.rawId };
    const updateInput = { ...input, id };

    // $FlowIgnoreMe
    const params: UpdateMutationParamsType | CreateMutationParamsType = {
      input: id ? updateInput : createInput,
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState(() => ({ isLoading: false }));
        log.debug({ response, errors });
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong.',
            link: { text: 'Close.' },
          });
          return;
        }
        this.resetForm();
        this.setState(() => ({
          isLoading: false,
          isOpenNewForm: false,
          editableAddressId: null,
        }));
        this.props.showAlert({
          type: 'success',
          text: id ? 'Address updated!' : 'Address created!',
          link: { text: '' },
        });
        this.resetForm();
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong.',
          link: { text: 'Close.' },
        });
      },
    };
    if (id) {
      UpdateUserDeliveryAddressMutation.commit(params);
    } else {
      CreateUserDeliveryAddressMutation.commit(params);
    }
  };

  handleDelete = (id: number) => {
    const { environment } = this.context;

    this.setState(() => ({ isLoading: true }));

    const params: DeleteMutationParamsType = {
      id,
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });
        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        this.setState(() => ({
          isLoading: false,
          editableAddressId: null,
        }));
        this.resetForm();
        this.props.showAlert({
          type: 'success',
          text: 'Address deleted!',
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong.',
          link: { text: 'Close.' },
        });
      },
    };
    DeleteUserDeliveryAddressMutation.commit(params);
  };

  handleUpdateForm = (form: FormType) => {
    this.setState(() => ({
      form: {
        ...this.state.form,
        ...form,
      },
    }));
  };

  handleCheckboxClick = () => {
    this.setState(prevState =>
      assocPath(['form', 'isPriority'], !prevState.form.isPriority, this.state),
    );
  };

  toggleEditAddressForm = (id: number, data: DeliveryAddressesType) => {
    if (data) {
      const { address, isPriority } = data;
      this.handleUpdateForm({ ...address, isPriority });
    }
    this.setState(prevState => ({
      editableAddressId: id || null,
      isOpenNewForm: id ? false : prevState.isOpenNewForm,
    }));
  };

  toggleNewAddressForm = () => {
    this.resetForm();
    this.setState(prevState => ({
      editableAddressId: prevState.isOpenNewForm
        ? prevState.editableAddressId
        : null,
      isOpenNewForm: !this.state.isOpenNewForm,
    }));
  };

  resetForm = () => {
    this.setState({
      form: resetForm,
    });
  };

  renderAddressForm = () => {
    const { form, isOpenNewForm, editableAddressId, isLoading } = this.state;
    return (
      <div styleName="addressForm">
        <AddressForm
          isOpen
          onChangeData={this.handleUpdateForm}
          country={form.country}
          address={form.value}
          addressFull={form}
        />
        <div styleName="priorityCheckbox">
          <Checkbox
            id="priority"
            isChecked={form.isPriority}
            onChange={this.handleCheckboxClick}
            label="Priority address"
          />
        </div>
        <div styleName="saveButtons">
          <Button
            big
            wireframe={!editableAddressId}
            onClick={() => {
              this.handleSave(editableAddressId || null);
            }}
            isLoading={isLoading}
            dataTest="saveShippingAddressButton"
          >
            {editableAddressId ? 'Save' : 'Add'}
          </Button>
          {(editableAddressId || isOpenNewForm) && (
            <div
              styleName="cancelButton"
              onClick={
                isOpenNewForm
                  ? this.toggleNewAddressForm
                  : this.toggleEditAddressForm
              }
              onKeyDown={() => {}}
              role="button"
              tabIndex="0"
            >
              Cancel
            </div>
          )}
        </div>
      </div>
    );
  };

  render() {
    const { me } = this.props;
    const { editableAddressId, isOpenNewForm } = this.state;
    const { deliveryAddresses = [] } = me;
    return (
      <Fragment>
        {deliveryAddresses.length === 0 && (
          <div styleName="subtitle">
            <strong>Shipping address</strong>
          </div>
        )}
        {deliveryAddresses.length > 0 && (
          <div styleName="addButton">
            <Button
              disabled={isOpenNewForm}
              wireframe
              big
              onClick={this.toggleNewAddressForm}
              dataTest="addShippingAddressButton"
            >
              Add address
            </Button>
          </div>
        )}
        {(deliveryAddresses.length === 0 || isOpenNewForm) &&
          this.renderAddressForm()}
        {deliveryAddresses.length > 0 && (
          <div styleName={classNames('addressesWrap', { isOpenNewForm })}>
            <div styleName="subtitle">
              <strong>Saved addresses</strong>
            </div>
            <div styleName="addresses">
              {map(item => {
                const {
                  country,
                  streetNumber,
                  locality,
                  route,
                  postalCode,
                } = item.address;
                return (
                  <Fragment key={item.rawId}>
                    <div styleName="item">
                      {item.isPriority && (
                        <div styleName="priorityText">Priority address</div>
                      )}
                      <div styleName="address">
                        {`${country}, `}
                        {locality && `${locality}`}
                        {(streetNumber || route) && <br />}
                        {streetNumber && `${streetNumber}, `}
                        {route && `${route}`}
                        <br />
                        {postalCode && `${postalCode}`}
                      </div>
                      <div styleName="name">
                        {`${me.firstName} ${me.lastName}`}
                      </div>
                      <div styleName="email">
                        <i>{me.email}</i>
                      </div>
                      <div styleName="editButtons">
                        <Button
                          wireframe
                          big
                          onClick={() => {
                            this.toggleEditAddressForm(item.rawId, item);
                          }}
                          dataTest="editShippingAddressButton"
                        >
                          Edit
                        </Button>
                        <div styleName="deleteButton">
                          <Button
                            big
                            pink
                            wireframe
                            onClick={() => {
                              this.handleDelete(item.rawId);
                            }}
                            dataTest="deleteShippingAddressButton"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                    {editableAddressId === item.rawId && (
                      <div styleName="editAddressForm">
                        {this.renderAddressForm()}
                      </div>
                    )}
                  </Fragment>
                );
              }, deliveryAddresses)}
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

ShippingAddresses.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default createFragmentContainer(
  withShowAlert(ShippingAddresses),
  graphql`
    fragment ShippingAddresses_me on User {
      rawId
      firstName
      lastName
      email
      deliveryAddresses {
        rawId
        id
        userId
        isPriority
        address {
          country
          administrativeAreaLevel1
          administrativeAreaLevel2
          political
          postalCode
          streetNumber
          value
          route
          locality
        }
      }
    }
  `,
);
