// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { assocPath, map, assoc, pathOr } from 'ramda';
import { createFragmentContainer, graphql } from 'react-relay';
import uuidv4 from 'uuid/v4';

import { AddressForm } from 'components/AddressAutocomplete';
import { Checkbox } from 'components/common/Checkbox';
import { Button } from 'components/common/Button';
import { withShowAlert } from 'components/Alerts/AlertContext';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';

import { log, fromRelayError } from 'utils';
import {
  CreateUserDeliveryAddressFullMutation,
  DeleteUserDeliveryAddressFullMutation,
  UpdateUserDeliveryAddressFullMutation,
} from 'relay/mutations';

import type { MutationParamsType as UpdateMutationParamsType } from 'relay/mutations/UpdateUserDeliveryAddressFullMutation';
import type { MutationParamsType as CreateMutationParamsType } from 'relay/mutations/CreateUserDeliveryAddressFullMutation';
import type { MutationParamsType as DeleteMutationParamsType } from 'relay/mutations/DeleteUserDeliveryAddressFullMutation';

import '../../Profile.scss';

import t from './i18n';

type DeliveryAddressesFullType = {
  id: string,
  rawId: number,
  isPriority: boolean,
  userId: number,
  address: {
    country: string,
    countryCode: string,
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
    deliveryAddressesFull: Array<DeliveryAddressesFullType>,
  },
  showAlert: (input: AddAlertInputType) => void,
};

type FormType = {
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
  countryCode: '',
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
      countryCode,
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

    if (!country || !postalCode || !countryCode) {
      if (!country)
        assoc('country', t.countryIsRequiredParameter, availabilityErrors);
      if (!postalCode)
        assoc(
          'postalCode',
          t.postalCodeIsRequiredParameter,
          availabilityErrors,
        );
      this.props.showAlert({
        type: 'danger',
        text: t.countryAndPostalCodeIsRequiredParameter,
        link: { text: '' },
      });
      return;
    }

    this.setState(() => ({ isLoading: true }));

    const input = {
      clientMutationId: uuidv4(),
      addressFull: {
        country,
        countryCode,
        administrativeAreaLevel1: administrativeAreaLevel1 || null,
        administrativeAreaLevel2: administrativeAreaLevel2 || null,
        political: political || null,
        postalCode,
        streetNumber: streetNumber || null,
        value: value || null,
        route: route || null,
        locality: locality || null,
      },
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
        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        log.debug({ validationErrors });
        // $FlowIgnoreMe
        const status: string = pathOr('', ['100', 'status'], relayErrors);
        if (status) {
          this.props.showAlert({
            type: 'danger',
            text: `${t.error} "${status}"`,
            link: { text: t.close },
          });
          return;
        }
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: t.somethingWentWrong,
            link: { text: t.close },
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
          text: t.somethingWentWrong,
          link: { text: t.close },
        });
      },
    };
    if (id) {
      UpdateUserDeliveryAddressFullMutation.commit(params);
    } else {
      CreateUserDeliveryAddressFullMutation.commit(params);
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
        this.setState(() => ({
          isLoading: false,
          editableAddressId: null,
        }));
        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        log.debug({ validationErrors });
        // $FlowIgnoreMe
        const status: string = pathOr('', ['100', 'status'], relayErrors);
        if (status) {
          this.props.showAlert({
            type: 'danger',
            text: `${t.error} "${status}"`,
            link: { text: t.close },
          });
          return;
        }
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: t.somethingWentWrong,
            link: { text: t.close },
          });
          return;
        }
        this.resetForm();
        this.props.showAlert({
          type: 'success',
          text: t.addressDeleted,
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        this.props.showAlert({
          type: 'danger',
          text: t.somethingWentWrong,
          link: { text: t.close },
        });
      },
    };
    DeleteUserDeliveryAddressFullMutation.commit(params);
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

  toggleEditAddressForm = (id: number, data: DeliveryAddressesFullType) => {
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
            dataTest="priorityAddressCheckbox"
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
            {editableAddressId ? t.save : t.add}
          </Button>
          {(editableAddressId || isOpenNewForm) && (
            <button
              styleName="cancelButton"
              onClick={
                isOpenNewForm
                  ? this.toggleNewAddressForm
                  : this.toggleEditAddressForm
              }
              data-test="cancelShippingAddressButton"
            >
              {t.cancel}
            </button>
          )}
        </div>
      </div>
    );
  };

  render() {
    const { me } = this.props;
    const { editableAddressId, isOpenNewForm } = this.state;
    const { deliveryAddressesFull = [] } = me;
    return (
      <div styleName="shippingAddresses">
        {deliveryAddressesFull.length === 0 && (
          <div styleName="subtitle">
            <strong>{t.shippingAddress}</strong>
          </div>
        )}
        {deliveryAddressesFull.length > 0 && (
          <div styleName="addButton">
            <Button
              disabled={isOpenNewForm}
              wireframe
              big
              onClick={this.toggleNewAddressForm}
              dataTest="addShippingAddressButton"
            >
              {t.addAddress}
            </Button>
          </div>
        )}
        {(deliveryAddressesFull.length === 0 || isOpenNewForm) &&
          this.renderAddressForm()}
        {deliveryAddressesFull.length > 0 && (
          <div styleName={classNames('addressesWrap', { isOpenNewForm })}>
            <div styleName="subtitle">
              <strong>{t.savedAddresses}</strong>
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
                        <div styleName="priorityText">{t.priorityAddress}</div>
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
                          {t.edit}
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
                            {t.delete}
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
              }, deliveryAddressesFull)}
            </div>
            {deliveryAddressesFull.length > 0 && (
              <div styleName="addButtonMobile">
                <Button
                  disabled={isOpenNewForm}
                  wireframe
                  big
                  onClick={this.toggleNewAddressForm}
                  dataTest="addShippingAddressButton"
                >
                  {t.addAddress}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
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
      deliveryAddressesFull {
        rawId
        id
        userId
        isPriority
        address {
          country
          countryCode
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
