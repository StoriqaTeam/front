// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { assocPath, pathOr, map } from 'ramda';

import { AddressForm } from 'components/AddressAutocomplete';
import { Checkbox } from 'components/common/Checkbox';
import { SpinnerButton } from 'components/common/SpinnerButton';
import { Button } from 'components/common/Button';
import { log, fromRelayError } from 'utils';
import {
  createUserDeliveryAddress,
  deleteUserDeliveryAddress,
  updateUserDeliveryAddress,
} from 'relay/mutations';

import type { MutationParamsType as UpdateMutationParamsType } from 'relay/mutations/updateUserDeliveryAddress';
import type { MutationParamsType as CreateMutationParamsType } from 'relay/mutations/createUserDeliveryAddress';
import type { MutationParamsType as DeleteMutationParamsType } from 'relay/mutations/deleteUserDeliveryAddress';

import '../Profile.scss';

type DeliveryAddressesType = {
  id: string,
  rawId: number,
  isPriority: boolean,
  userId: number,
  address: {
    administrativeAreaLevel1: ?string,
    administrativeAreaLevel2: ?string,
    country: string,
    locality: ?string,
    political: ?string,
    postalCode: string,
    route: ?string,
    streetNumber: ?string,
    value: ?string,
  },
};

type PropsType = {
  data: {
    rawId: number,
    firstName: string,
    lastName: string,
    email: string,
    deliveryAddresses: Array<DeliveryAddressesType>,
  },
};

type StateType = {
  isLoading: boolean,
  form: {
    administrativeAreaLevel1: ?string,
    administrativeAreaLevel2: ?string,
    country: string,
    locality: ?string,
    political: ?string,
    postalCode: string,
    route: ?string,
    streetNumber: ?string,
    address: ?string,
    value: ?string,
    isPriority: boolean,
  },
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
  address: '',
  value: '',
  isPriority: true,
};

class ShippingAddresses extends Component<PropsType, StateType> {
  state = {
    form: { ...resetForm },
    isLoading: false,
    isOpenNewForm: false,
    editableAddressId: null,
  };

  handleSave = (id: ?number) => {
    this.setState(() => ({ isLoading: true }));
    const { environment } = this.context;
    const { data } = this.props;
    const { form } = this.state;
    const {
      country,
      administrativeAreaLevel1,
      administrativeAreaLevel2,
      political,
      postalCode,
      streetNumber,
      address,
      route,
      locality,
      isPriority,
    } = form;

    const input = {
      clientMutationId: '',
      country: country || null,
      administrativeAreaLevel1: administrativeAreaLevel1 || null,
      administrativeAreaLevel2: administrativeAreaLevel2 || null,
      political: political || null,
      postalCode: postalCode || null,
      streetNumber: streetNumber || null,
      address: address || null,
      route: route || null,
      locality: locality || null,
      isPriority,
    };

    const createInput = { ...input, userId: data.rawId };
    const updateInput = { ...input, id };

    // $FlowIgnoreMe
    const params: UpdateMutationParamsType | CreateMutationParamsType = {
      input: id ? updateInput : createInput,
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        this.setState(() => ({
          isLoading: false,
          isOpenNewForm: false,
          editableAddressId: null,
        }));
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });

        this.setState(() => ({ isLoading: false }));

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          return;
        }
        // eslint-disable-next-line
        alert('Something going wrong :(');
      },
    };
    if (id) {
      updateUserDeliveryAddress.commit(params);
    } else {
      createUserDeliveryAddress.commit(params);
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
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        // eslint-disable-next-line
        alert('Something going wrong :(');
      },
    };
    deleteUserDeliveryAddress.commit(params);
  };

  handleUpdateForm = (form: any) => {
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
    this.setState({ form: { ...resetForm } });
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
          <SpinnerButton
            white
            onClick={() => {
              this.handleSave(editableAddressId || null);
            }}
            isLoading={isLoading}
          >
            {editableAddressId ? 'Save' : 'Add'}
          </SpinnerButton>
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
    const { data } = this.props;
    const { editableAddressId, isOpenNewForm } = this.state;
    const { deliveryAddresses } = data;
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
                        <div styleName="preorityText">Priority address</div>
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
                        {`${data.firstName} ${data.lastName}`}
                      </div>
                      <div styleName="email">
                        <i>{data.email}</i>
                      </div>
                      <div styleName="editButtons">
                        <Button
                          wireframe
                          big
                          onClick={() => {
                            this.toggleEditAddressForm(item.rawId, item);
                          }}
                        >
                          Edit
                        </Button>
                        <div
                          styleName="cancelButton"
                          onClick={() => {
                            this.handleDelete(item.rawId);
                          }}
                          onKeyDown={() => {}}
                          role="button"
                          tabIndex="0"
                        >
                          Delete address
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
              }, [...deliveryAddresses].reverse())}
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

export default ShippingAddresses;
