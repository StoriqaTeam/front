// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  assocPath,
  propOr,
  toUpper,
  toLower,
  find,
  propEq,
  isEmpty,
  pathOr,
  omit,
} from 'ramda';
import { createFragmentContainer, graphql } from 'react-relay';
import copy from 'copy-to-clipboard';
import { validate } from '@storiqa/shared';
import uuidv4 from 'uuid/v4';

import { Input, Button, Select } from 'components/common';
import { Icon } from 'components/Icon';
import { BirthdateSelect } from 'components/common/BirthdateSelect';
import { withShowAlert } from 'components/Alerts/AlertContext';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';

import { log, fromRelayError } from 'utils';
import { renameKeys } from 'utils/ramda';

import { UpdateUserMutation } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/UpdateUserMutation';

import '../../Profile.scss';

import t from './i18n';

type DataType = {
  firstName: string,
  lastName: string,
  phone: ?string,
  birthdate: ?string,
  gender: 'MALE' | 'FEMALE' | 'UNDEFINED',
};

type PropsType = {
  me: {
    id: string,
    rawId: number,
    firstName: string,
    lastName: string,
    phone: ?string,
    birthdate: ?string,
    gender: 'MALE' | 'FEMALE' | 'UNDEFINED',
  },
  subtitle: string,
  showAlert: (input: AddAlertInputType) => void,
};

type StateType = {
  data: DataType,
  formErrors: {
    [string]: ?any,
  },
  isLoading: boolean,
  isCopiedRef: boolean,
};

const genderItems = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
];

let timer;

class PersonalData extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { me } = props;
    this.state = {
      data: {
        phone: me.phone || '',
        firstName: me.firstName || '',
        lastName: me.lastName || '',
        birthdate: me.birthdate || '',
        gender: me.gender || 'UNDEFINED',
      },
      formErrors: {},
      isLoading: false,
      isCopiedRef: false,
    };
  }

  componentWillUnmount() {
    clearTimeout(timer);
  }

  handleSave = () => {
    const { environment } = this.context;
    const { me: propsData } = this.props;
    const { data } = this.state;
    const { phone, firstName, lastName, birthdate, gender } = data;

    const { errors: formErrors } = validate(
      {
        firstName: [
          [
            (value: string) => value && value.length > 0,
            t.firstNameMustNotBeEmpty,
          ],
        ],
        lastName: [
          [
            (value: string) => value && value.length > 0,
            t.lastNameMustNotBeEmpty,
          ],
        ],
      },
      {
        firstName,
        lastName,
      },
    );

    if (formErrors) {
      this.setState({ formErrors });
      return;
    }

    this.setState(() => ({ isLoading: true }));

    const params: MutationParamsType = {
      input: {
        clientMutationId: uuidv4(),
        id: propsData.id,
        phone: phone || null,
        firstName: firstName || null,
        lastName: lastName || null,
        birthdate: birthdate || null,
        gender: gender || null,
        avatar: null,
      },
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });
        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        // $FlowIgnoreMe
        const status: string = pathOr('', ['100', 'status'], relayErrors);
        this.setState(() => ({ isLoading: false }));
        if (!isEmpty(validationErrors)) {
          this.setState({
            formErrors: renameKeys(
              {
                first_name: 'firstName',
                last_name: 'lastName',
              },
              validationErrors,
            ),
          });
          return;
        } else if (status) {
          this.props.showAlert({
            type: 'danger',
            text: `${t.error} "${status}"`,
            link: { text: t.close },
          });
          return;
        } else if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: t.userUpdated,
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        this.setState(() => ({ isLoading: false }));
        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.setState({
            formErrors: renameKeys(
              {
                first_name: 'firstName',
                last_name: 'lastName',
              },
              validationErrors,
            ),
          });
          return;
        }
        this.props.showAlert({
          type: 'danger',
          text: t.somethingGoingWrong,
          link: { text: t.close },
        });
      },
    };
    UpdateUserMutation.commit(params);
  };

  handleInputChange = (id: string) => (e: any) => {
    this.setState({ formErrors: omit([id], this.state.formErrors) });
    const { value } = e.target;
    if (id === 'phone' && !/^\+?\d*$/.test(value)) {
      return;
    }
    this.setState((prevState: StateType) =>
      assocPath(['data', id], value, prevState),
    );
  };

  handleGenderSelect = (genderValue: { id: string, label: string }) => {
    this.setState((prevState: StateType) =>
      assocPath(['data', 'gender'], toUpper(genderValue.id), prevState),
    );
  };

  handleBirthdateSelect = (value: string) => {
    this.setState((prevState: StateType) =>
      assocPath(['data', 'birthdate'], value, prevState),
    );
  };

  /* eslint-disable */
  renderInput = ({
    id,
    label,
    limit,
  }: {
    id: string,
    label: string,
    limit?: number,
  }) => (
    <div styleName="formItem">
      <Input
        id={id}
        // $FlowIgnoreMe
        value={propOr('', id, this.state.data)}
        label={label}
        onChange={this.handleInputChange(id)}
        errors={propOr(null, id, this.state.formErrors)}
        limit={limit}
        fullWidth
        dataTest={`${id}Input`}
      />
    </div>
  );

  handleCopyRefLink = (refLink: string) => {
    clearTimeout(timer);

    this.setState({ isCopiedRef: true });

    timer = setTimeout(() => {
      this.setState({ isCopiedRef: false });
    }, 3000);

    copy(refLink);
  };

  render() {
    const { subtitle } = this.props;
    const { data, isLoading, formErrors, isCopiedRef } = this.state;
    // $FlowIgnoreMe
    const refNum = pathOr('', ['me', 'rawId'], this.props);
    const genderValue = find(propEq('id', toLower(data.gender)))(genderItems);

    const refLink = process.env.REACT_APP_HOST
      ? `${process.env.REACT_APP_HOST}?ref=${refNum}`
      : '';
    return (
      <div styleName="personalData">
        <div styleName="personalDataWrap">
          <div styleName="subtitle">
            <strong>{t.personalDataSettings}</strong>
          </div>
          {this.renderInput({
            id: 'firstName',
            label: t.labelFirstName,
            limit: 50,
          })}
          {this.renderInput({
            id: 'lastName',
            label: t.labelLastName,
            limit: 50,
          })}
          <div styleName="formItem">
            <Select
              forForm
              label={t.labelGender}
              activeItem={genderValue}
              items={genderItems}
              onSelect={this.handleGenderSelect}
              dataTest="profileGenderSelect"
              fullWidth
            />
          </div>
          <div styleName="formItem">
            <BirthdateSelect
              label={t.labelBirthdate}
              birthdate={data.birthdate}
              handleBirthdateSelect={this.handleBirthdateSelect}
              errors={propOr(null, 'birthdate', formErrors)}
              dataTest="profileBirthdate"
            />
          </div>
          {this.renderInput({
            id: 'phone',
            label: t.labelPhone,
          })}
          <div styleName="formItem">
            <div styleName="inputRef">
              <button
                styleName={classNames('copyRefButton', { isCopiedRef })}
                onClick={() => {
                  this.handleCopyRefLink(refLink);
                }}
                data-test="copyRefButton"
              >
                <Icon type="copy" size={32} />
              </button>
              <Input
                id="ref"
                disabled
                value={refLink}
                label={t.labelRefLink}
                onChange={() => {}}
                fullWidth
              />
              <div
                styleName={classNames('copyMessage', { isCopiedRef })}
                data-test="copyRefButton"
              >
                {t.copied}
              </div>
            </div>
          </div>
          <div styleName="formItem">
            <div styleName="button">
              <Button
                big
                fullWidth
                onClick={this.handleSave}
                isLoading={isLoading}
                dataTest="savePersonalDataButton"
              >
                {t.save}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PersonalData.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default createFragmentContainer(
  withShowAlert(PersonalData),
  graphql`
    fragment PersonalData_me on User {
      id
      rawId
      phone
      firstName
      lastName
      birthdate
      gender
    }
  `,
);
