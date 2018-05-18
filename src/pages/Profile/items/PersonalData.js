// @flow

import React, { Component, Fragment } from 'react';
import { assocPath, propOr, toUpper, toLower, find, propEq } from 'ramda';

import { Input } from 'components/common/Input';
import { Select } from 'components/common/Select';
import { BirthdateSelect } from 'pages/Profile/items/BirthdateSelect';
import { SpinnerButton } from 'components/common/SpinnerButton';

import '../Profile.scss';

type DataType = {
  first_name: string,
  last_name: string,
  phone: ?string,
  birthdate: ?string,
  gender: 'MALE' | 'FEMALE' | 'UNDEFINED',
};

type PropsType = {
  handleSave: (data: DataType) => void,
  updateFormErrors: (id: string) => void,
  data: {
    firstName: string,
    lastName: string,
    phone: ?string,
    birthdate: ?string,
    gender: 'MALE' | 'FEMALE' | 'UNDEFINED',
  },
  isLoading: boolean,
  formErrors: {
    [string]: ?any,
  },
  subtitle: string,
};

type StateType = {
  data: DataType,
};

const genderItems = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
];

class PersonalData extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { data } = props;
    this.state = {
      data: {
        phone: data.phone || '',
        first_name: data.firstName || '',
        last_name: data.lastName || '',
        birthdate: data.birthdate || '',
        gender: data.gender || 'UNDEFINED',
      },
    };
  }

  handleSave = () => {
    const { data } = this.state;
    this.props.handleSave(data);
  };

  handleInputChange = (id: string) => (e: any) => {
    this.props.updateFormErrors(id);
    const { value } = e.target;
    if (id === 'phone' && !/^\+?\d*$/.test(value)) {
      return;
    }
    if (value.length <= 50) {
      this.setState((prevState: StateType) =>
        assocPath(['data', id], value.replace(/\s\s/, ' '), prevState),
      );
    }
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
    /* eslint-enable */
    <div styleName="formItem">
      <Input
        id={id}
        // $FlowIgnoreMe
        value={propOr('', id, this.state.data)}
        label={label}
        onChange={this.handleInputChange(id)}
        errors={propOr(null, id, this.props.formErrors)}
        limit={limit}
      />
    </div>
  );

  render() {
    const { isLoading, formErrors, subtitle } = this.props;
    const { data } = this.state;
    const genderValue = find(propEq('id', toLower(data.gender)))(genderItems);
    return (
      <Fragment>
        <div styleName="subtitle">
          <strong>{subtitle}</strong>
        </div>
        {this.renderInput({
          id: 'first_name',
          label: 'First name',
          limit: 50,
        })}
        {this.renderInput({
          id: 'last_name',
          label: 'Last name',
          limit: 50,
        })}
        <div styleName="formItem">
          <Select
            forForm
            label="Gender"
            activeItem={genderValue}
            items={genderItems}
            onSelect={this.handleGenderSelect}
            dataTest="profileGenderSelect"
          />
        </div>
        <div styleName="formItem">
          <BirthdateSelect
            birthdate={data.birthdate}
            handleBirthdateSelect={this.handleBirthdateSelect}
            errors={propOr(null, 'birthdate', formErrors)}
          />
        </div>
        {this.renderInput({
          id: 'phone',
          label: 'Phone',
        })}
        <div styleName="formItem">
          <SpinnerButton
            onClick={this.handleSave}
            isLoading={isLoading}
            dataTest="saveButton"
          >
            Save
          </SpinnerButton>
        </div>
      </Fragment>
    );
  }
}

export default PersonalData;
