// @flow

import React, { Component } from 'react';
import { assocPath, omit, pick } from 'ramda';
import DatePicker from 'react-datepicker';

import { Button } from 'components/Button';
import { Text, Checkbox, RadioGroup } from 'components/Forms';

import './Form.scss';

type PropsType = {
  onSaveClick: Function,
  profileData: {},
  errors: ?{}
};

type StateType = {
  form: {
    [key: string]: ?any
  },
};

class Form extends Component<PropsType, StateType> {
  state = {
    form: pick(
      [
        'phone',
        'firstName',
        'lastName',
        'middleName',
        'birthdate',
        'gender',
        'isActive',
      ],
      this.props.profileData,
    ),
  };
  handleInputChange = (id: string) => (value: any) => {
    this.setState(prevState => assocPath(['form', id], value, prevState));
  };

  handleClick = () => {
    this.props.onSaveClick(omit(['birthdateRaw'], this.state.form));
  };

  render() {
    const { errors = {} } = this.props;
    return (
      <div styleName="container">
        <Text
          id="phone"
          label="Phone"
          value={this.state.form.phone || ''}
          onChange={this.handleInputChange('phone')}
          errors={errors.phone}
        />
        <br />
        <Text
          id="firstName"
          label="First name"
          value={this.state.form.firstName || ''}
          onChange={this.handleInputChange('firstName')}
          errors={errors.firstName}
        />
        <br />
        <Text
          id="lastName"
          label="Last name"
          value={this.state.form.lastName || ''}
          onChange={this.handleInputChange('lastName')}
          errors={errors.lastName}
        />
        <br />
        <Text
          id="middleName"
          label="Middle name"
          value={this.state.form.middleName || ''}
          onChange={this.handleInputChange('middleName')}
          errors={errors.middleName}
        />
        <br />
        <RadioGroup
          id="gender"
          label="Gender"
          items={['MALE', 'FEMALE', 'UNDEFINED'].map(val => ({ id: val, value: val }))}
          checked={this.state.form.gender}
          onChange={this.handleInputChange('gender')}
          errors={errors.gender}
        />
        <br />
        <DatePicker
          onChange={(e:any) => {
            this.handleInputChange('birthdate')(e.toDate().toISOString());
            this.handleInputChange('birthdateRaw')(e);
          }}
          selected={this.state.form.birthdateRaw}
          errors={errors.birthdate}
        />
        <br />
        <Checkbox
          id="active"
          label="Is active"
          checked={!!this.state.form.isActive}
          onChange={this.handleInputChange('isActive')}
          errors={errors.isActive}
        />
        <Button onClick={this.handleClick}>Save</Button>
      </div>
    );
  }
}

export default Form;
