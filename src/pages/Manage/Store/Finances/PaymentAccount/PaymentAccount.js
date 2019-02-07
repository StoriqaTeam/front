// @flow

import React, { Component, Fragment } from 'react';
import { isEmpty, pathOr, path, assocPath, assoc, omit, isNil } from 'ramda';
import { Environment } from 'relay-runtime';
import { createFragmentContainer, graphql } from 'react-relay';
import uuidv4 from 'uuid/v4';

import { Checkbox, Input, Button, Select } from 'components/common';

import {
  CreateInternationalBillingInfoMutation,
  CreateRussiaBillingInfoMutation,
  UpdateInternationalBillingInfoMutation,
  UpdateRussiaBillingInfoMutation,
} from 'relay/mutations';
import { withShowAlert } from 'components/Alerts/AlertContext';
import { log, fromRelayError } from 'utils';

import type { CreateInternationalBillingInfoMutationType } from 'relay/mutations/CreateInternationalBillingInfoMutation';
import type { CreateRussiaBillingInfoMutationType } from 'relay/mutations/CreateRussiaBillingInfoMutation';
import type { AddAlertInputType } from 'components/Alerts/AlertContext';
import type { SelectItemType } from 'types';

import './PaymentAccount.scss';

import t from './i18n';

type RussianFormType = {
  id: ?string,
  bankName: string,
  branchName: string,
  swiftBic: string,
  taxId: string,
  correspondentAccount: string,
  currentAccount: string,
  personalAccount: string,
  beneficiaryFullName: string,
};

type InternationalFormType = {
  id: ?string,
  account: string,
  currency: SelectItemType,
  name: string,
  bank: string,
  swift: string,
  bankAddress: string,
  country: string,
  city: string,
  recipientAddress: string,
};

type StateType = {
  isLoading: boolean,
  paymentAccountType: 'international' | 'russian',
  russianForm: RussianFormType,
  internationalForm: InternationalFormType,
  isOpenForm: boolean,
};

type PropsType = {
  me: {
    myStore: {
      rawId: number,
      warehouses: {
        addressFull: {
          countryCode: string,
        },
      },
      russiaBillingInfo: ?{
        id: string,
        rawId: number,
        bankName: string,
        branchName: string,
        swiftBic: string,
        taxId: string,
        correspondentAccount: string,
        currentAccount: string,
        personalAccount: string,
        beneficiaryFullName: string,
      },
      internationalBillingInfo: ?{
        id: string,
        rawId: number,
        account: string,
        currency: string,
        name: string,
        bank: string,
        swift: string,
        bankAddress: string,
        country: string,
        city: string,
        recipientAddress: string,
      },
    },
  },
  showAlert: (input: AddAlertInputType) => void,
  environment: Environment,
};

class PaymentAccount extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    let paymentAccountType = 'russian';
    // $FlowIgnore
    const russianBillingInfo = pathOr(
      null,
      ['myStore', 'russiaBillingInfo'],
      props.me,
    );
    // $FlowIgnore
    const internationalBillingInfo = pathOr(
      null,
      ['myStore', 'internationalBillingInfo'],
      props.me,
    );

    if (russianBillingInfo === null && internationalBillingInfo === null) {
      // $FlowIgnore
      const countryCode = pathOr(
        null,
        ['myStore', 'warehouses', 0, 'addressFull', 'countryCode'],
        props.me,
      );
      paymentAccountType = countryCode === 'RUS' ? 'russian' : 'international';
    }

    if (internationalBillingInfo != null) {
      paymentAccountType = 'international';
    }

    this.state = {
      isLoading: false,
      paymentAccountType,
      russianForm: {
        id: russianBillingInfo ? russianBillingInfo.rawId : null,
        bankName: (russianBillingInfo && russianBillingInfo.bankName) || '',
        branchName: (russianBillingInfo && russianBillingInfo.branchName) || '',
        swiftBic: (russianBillingInfo && russianBillingInfo.swiftBic) || '',
        taxId: (russianBillingInfo && russianBillingInfo.taxId) || '',
        correspondentAccount:
          (russianBillingInfo && russianBillingInfo.correspondentAccount) || '',
        currentAccount:
          (russianBillingInfo && russianBillingInfo.currentAccount) || '',
        personalAccount:
          (russianBillingInfo && russianBillingInfo.personalAccount) || '',
        beneficiaryFullName:
          (russianBillingInfo && russianBillingInfo.beneficiaryFullName) || '',
      },
      internationalForm: {
        id: internationalBillingInfo ? internationalBillingInfo.rawId : null,
        account:
          (internationalBillingInfo && internationalBillingInfo.account) || '',
        currency:
          internationalBillingInfo && internationalBillingInfo.currency
            ? {
                id: internationalBillingInfo.currency,
                label: internationalBillingInfo.currency,
              }
            : { id: 'EUR', label: 'EUR' },
        name: (internationalBillingInfo && internationalBillingInfo.name) || '',
        bank: (internationalBillingInfo && internationalBillingInfo.bank) || '',
        swift:
          (internationalBillingInfo && internationalBillingInfo.swift) || '',
        bankAddress:
          (internationalBillingInfo && internationalBillingInfo.bankAddress) ||
          '',
        country:
          (internationalBillingInfo && internationalBillingInfo.country) || '',
        city: (internationalBillingInfo && internationalBillingInfo.city) || '',
        recipientAddress:
          (internationalBillingInfo &&
            internationalBillingInfo.recipientAddress) ||
          '',
      },
      isOpenForm: false,
    };
  }

  handleSaveRussiaBillingInfo = () => {
    // $FlowIgnore
    const storeId = pathOr(null, ['myStore', 'rawId'], this.props.me);
    // $FlowIgnore
    const russianBillingInfo = pathOr(
      null,
      ['myStore', 'russiaBillingInfo'],
      this.props.me,
    );
    const { russianForm } = this.state;
    if (!storeId) {
      this.props.showAlert({
        type: 'danger',
        text: t.somethingGoingWrong,
        link: { text: t.close },
      });
      return;
    }
    this.setState({ isLoading: true });

    let input = {
      clientMutationId: uuidv4(),
      ...omit(['id'], russianForm),
    };

    if (russianBillingInfo != null) {
      input = assoc('id', russianBillingInfo.rawId, input);
    } else {
      input = assoc('storeId', storeId, input);
    }

    const params: CreateRussiaBillingInfoMutationType = {
      input,
      environment: this.props.environment,
      // $FlowIgnore
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState({ isLoading: false });
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

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

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'success',
          link: { text: '' },
        });
        this.setState({ isOpenForm: false });
      },
      onError: (error: Error) => {
        this.setState(() => ({
          isLoading: false,
          isOpenForm: false,
        }));
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: t.somethingGoingWrong,
          link: { text: t.close },
        });
      },
    };
    if (russianBillingInfo != null) {
      UpdateRussiaBillingInfoMutation.commit(params);
    } else {
      CreateRussiaBillingInfoMutation.commit(params);
    }
  };

  handleSaveInternationalBillingInfo = () => {
    // $FlowIgnore
    const storeId = pathOr(null, ['myStore', 'rawId'], this.props.me);
    // $FlowIgnore
    const internationalBillingInfo = pathOr(
      null,
      ['myStore', 'internationalBillingInfo'],
      this.props.me,
    );
    const { internationalForm } = this.state;
    if (!storeId) {
      this.props.showAlert({
        type: 'danger',
        text: t.somethingGoingWrong,
        link: { text: t.close },
      });
      return;
    }

    this.setState({ isLoading: true });

    let input = {
      clientMutationId: uuidv4(),
      ...omit(['currency', 'id'], internationalForm),
      currency: internationalForm.currency.label,
    };

    if (internationalBillingInfo != null) {
      input = assoc('id', internationalBillingInfo.rawId, input);
    } else {
      input = assoc('storeId', storeId, input);
    }

    const params: CreateInternationalBillingInfoMutationType = {
      input,
      environment: this.props.environment,
      // $FlowIgnore
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState({ isLoading: false });
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

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

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'success',
          link: { text: '' },
        });
        this.setState({ isOpenForm: false });
      },
      onError: (error: Error) => {
        this.setState(() => ({
          isLoading: false,
          isOpenForm: false,
        }));
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: t.somethingGoingWrong,
          link: { text: t.close },
        });
      },
    };
    if (internationalBillingInfo != null) {
      UpdateInternationalBillingInfoMutation.commit(params);
    } else {
      CreateInternationalBillingInfoMutation.commit(params);
    }
  };

  handleChangePaymentAccountType = (id: string) => {
    this.setState({
      paymentAccountType:
        id === 'russianPaymentAccountCheckbox' ? 'russian' : 'international',
      isOpenForm: false,
    });
  };

  handleInputChange = (id: string, type: 'russian' | 'international') => (
    e: SyntheticInputEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;
    this.setState((prevState: StateType) =>
      assocPath([`${type}Form`, id], value, prevState),
    );
  };

  handleOpenEditForm = () => {
    this.setState({ isOpenForm: true });
  };

  handleClosedEditForm = () => {
    this.setState({ isOpenForm: false });
  };

  renderItem = (props: {
    id: string,
    label: string,
    type: 'russia' | 'international',
  }) => {
    const { id, label, type } = props;
    const { me } = this.props;
    const value = path([`${type}BillingInfo`, id], me.myStore);
    if (!value) {
      return null;
    }
    return (
      <tr styleName="item">
        <td styleName="label">{label}</td>
        <td styleName="value">{value}</td>
      </tr>
    );
  };

  renderInternatioanalItems = () => (
    <table>
      <tbody>
        {this.renderItem({
          id: 'account',
          label: 'Account',
          type: 'international',
        })}
        {this.renderItem({
          id: 'name',
          label: 'Name',
          type: 'international',
        })}
        {this.renderItem({
          id: 'bank',
          label: 'Bank',
          type: 'international',
        })}
        {this.renderItem({
          id: 'swift',
          label: 'Swift',
          type: 'international',
        })}
        {this.renderItem({
          id: 'bankAddress',
          label: 'Bank address',
          type: 'international',
        })}
        {this.renderItem({
          id: 'country',
          label: 'Country',
          type: 'international',
        })}
        {this.renderItem({
          id: 'city',
          label: 'City',
          type: 'international',
        })}
        {this.renderItem({
          id: 'recipientAddress',
          label: 'Recipient address',
          type: 'international',
        })}
        {this.renderItem({
          id: 'currency',
          label: 'Currency',
          type: 'international',
        })}
      </tbody>
    </table>
  );

  renderRussianItems = () => (
    <table>
      <tbody>
        {this.renderItem({
          id: 'bankName',
          label: 'Bank name',
          type: 'russia',
        })}
        {this.renderItem({
          id: 'branchName',
          label: 'Branch name',
          type: 'russia',
        })}
        {this.renderItem({
          id: 'swiftBic',
          label: 'SWIFT BIC',
          type: 'russia',
        })}
        {this.renderItem({
          id: 'taxId',
          label: 'Tax ID',
          type: 'russia',
        })}
        {this.renderItem({
          id: 'correspondentAccount',
          label: 'Correspondent account',
          type: 'russia',
        })}
        {this.renderItem({
          id: 'currentAccount',
          label: 'Current account',
          type: 'russia',
        })}
        {this.renderItem({
          id: 'personalAccount',
          label: 'Personal account',
          type: 'russia',
        })}
        {this.renderItem({
          id: 'beneficiaryFullName',
          label: 'Beneficiary’s full name',
          type: 'russia',
        })}
      </tbody>
    </table>
  );

  renderInput = (props: {
    id: string,
    label: string,
    type: 'russian' | 'international',
    required?: boolean,
  }) => {
    const { id, label, required, type } = props;
    const hereLabel =
      required === true ? (
        <span>
          {label} <span styleName="asterisk">*</span>
        </span>
      ) : (
        label
      );
    const value = path([`${type}Form`, id], this.state);
    return (
      <Input
        id={id}
        value={value || ''}
        label={hereLabel}
        onChange={this.handleInputChange(id, type)}
        fullWidth
      />
    );
  };

  renderRussianForm = () => (
    <Fragment>
      <div styleName="input">
        {this.renderInput({
          id: 'bankName',
          label: 'Bank name',
          type: 'russian',
        })}
      </div>
      <div styleName="input">
        {this.renderInput({
          id: 'branchName',
          label: 'Branch name',
          type: 'russian',
        })}
      </div>
      <div styleName="input">
        {this.renderInput({
          id: 'swiftBic',
          label: 'SWIFT BIC',
          type: 'russian',
        })}
      </div>
      <div styleName="input">
        {this.renderInput({
          id: 'taxId',
          label: 'Tax ID',
          type: 'russian',
        })}
      </div>
      <div styleName="input">
        {this.renderInput({
          id: 'correspondentAccount',
          label: 'Correspondent account',
          type: 'russian',
        })}
      </div>
      <div styleName="input">
        {this.renderInput({
          id: 'currentAccount',
          label: 'Current account',
          type: 'russian',
        })}
      </div>
      <div styleName="input">
        {this.renderInput({
          id: 'personalAccount',
          label: 'Personal account',
          type: 'russian',
        })}
      </div>
      <div styleName="input">
        {this.renderInput({
          id: 'beneficiaryFullName',
          label: 'Beneficiary’s full name',
          type: 'russian',
        })}
      </div>
    </Fragment>
  );

  renderInternatioanalForm = () => (
    <Fragment>
      {/* <div styleName="input">
        {this.renderInput({
          id: 'currency',
          label: 'Currency',
          type: 'international',
        })}
      </div> */}
      <div styleName="input">
        {this.renderInput({
          id: 'account',
          label: 'Account',
          type: 'international',
        })}
      </div>
      <div styleName="input">
        {this.renderInput({
          id: 'name',
          label: 'Name',
          type: 'international',
        })}
      </div>
      <div styleName="input">
        {this.renderInput({
          id: 'bank',
          label: 'Bank',
          type: 'international',
        })}
      </div>
      <div styleName="input">
        {this.renderInput({
          id: 'swift',
          label: 'Swift',
          type: 'international',
        })}
      </div>
      <div styleName="input">
        {this.renderInput({
          id: 'bankAddress',
          label: 'Bank address',
          type: 'international',
        })}
      </div>
      <div styleName="input">
        {this.renderInput({
          id: 'country',
          label: 'Country',
          type: 'international',
        })}
      </div>
      <div styleName="input">
        {this.renderInput({
          id: 'city',
          label: 'City',
          type: 'international',
        })}
      </div>
      <div styleName="input">
        {this.renderInput({
          id: 'recipientAddress',
          label: 'Recipient address',
          type: 'international',
        })}
      </div>
      <div styleName="input">
        <Select
          forForm
          fullWidth
          label="Currency"
          items={[
            { id: 'EUR', label: 'EUR' },
            { id: 'USD', label: 'USD' },
            { id: 'RUB', label: 'RUB' },
          ]}
          activeItem={this.state.internationalForm.currency}
          onSelect={(selected: SelectItemType) => {
            this.setState({
              internationalForm: assoc(
                'currency',
                selected,
                this.state.internationalForm,
              ),
            });
          }}
          dataTest="internationalBillingInfoCurrency"
        />
      </div>
    </Fragment>
  );

  render() {
    // $FlowIgnore
    const russianBillingInfo = pathOr(
      null,
      ['myStore', 'russiaBillingInfo'],
      this.props.me,
    );
    // $FlowIgnore
    const internationalBillingInfo = pathOr(
      null,
      ['myStore', 'internationalBillingInfo'],
      this.props.me,
    );
    const { paymentAccountType, isLoading, isOpenForm } = this.state;
    let isNilData = isNil(internationalBillingInfo);

    if (paymentAccountType === 'russian') {
      isNilData = isNil(russianBillingInfo);
    }

    return (
      <div styleName="container">
        <div styleName="checkboxes">
          <div styleName="checkbox">
            <Checkbox
              id="internationalPaymentAccountCheckbox"
              label={t.international}
              isRadio
              isChecked={paymentAccountType !== 'russian'}
              onChange={this.handleChangePaymentAccountType}
            />
          </div>
          <div styleName="checkbox">
            <Checkbox
              id="russianPaymentAccountCheckbox"
              label={t.russian}
              isRadio
              isChecked={paymentAccountType === 'russian'}
              onChange={this.handleChangePaymentAccountType}
            />
          </div>
        </div>
        <div styleName="items">
          {paymentAccountType === 'russian'
            ? this.renderRussianItems()
            : this.renderInternatioanalItems()}
        </div>
        {(isOpenForm || isNilData) && (
          <Fragment>
            <div styleName="form">
              {paymentAccountType === 'russian'
                ? this.renderRussianForm()
                : this.renderInternatioanalForm()}
            </div>
            <div styleName="buttons">
              <div className="button">
                <Button
                  fullWidth
                  dataTest="savePaymentAccountButton"
                  isLoading={isLoading}
                  onClick={
                    paymentAccountType === 'international'
                      ? this.handleSaveInternationalBillingInfo
                      : this.handleSaveRussiaBillingInfo
                  }
                >
                  {t.save}
                </Button>
              </div>
              {!isNilData && (
                <button
                  styleName="cancelButton"
                  onClick={this.handleClosedEditForm}
                >
                  {t.cancel}
                </button>
              )}
            </div>
          </Fragment>
        )}
        {!isOpenForm &&
          !isNilData && (
            <div styleName="buttons">
              <div styleName="button">
                <Button
                  fullWidth
                  dataTest="editPaymentAccountButton"
                  onClick={this.handleOpenEditForm}
                >
                  {t.edit}
                </Button>
              </div>
            </div>
          )}
      </div>
    );
  }
}

export default createFragmentContainer(
  withShowAlert(PaymentAccount),
  graphql`
    fragment PaymentAccount_me on User {
      myStore {
        rawId
        warehouses {
          addressFull {
            countryCode
          }
        }
        russiaBillingInfo {
          id
          rawId
          bankName
          branchName
          swiftBic
          taxId
          correspondentAccount
          currentAccount
          personalAccount
          beneficiaryFullName
        }
        internationalBillingInfo {
          id
          rawId
          account
          currency
          name
          bank
          swift
          bankAddress
          country
          city
          recipientAddress
        }
      }
    }
  `,
);
