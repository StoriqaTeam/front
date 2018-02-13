// @flow

import React, { Component } from 'react';
import { assocPath, pick } from 'ramda';

// import { log } from 'utils';
import { Button } from 'components/Button';
import { Text, Checkbox, RadioGroup } from 'components/Forms';

import './Form.scss';

type PropsType = {
  onSaveClick: Function,
  profileData: {},
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
    this.props.onSaveClick(this.state.form);
  };

  render() {
    return (
      <div styleName="container">
        <Text
          id="phone"
          label="Phone"
          value={this.state.form.phone || ''}
          onChange={this.handleInputChange('phone')}
        />
        <br />
        <Text
          id="firstName"
          label="First name"
          value={this.state.form.firstName || ''}
          onChange={this.handleInputChange('firstName')}
        />
        <br />
        <Text
          id="lastName"
          label="Last name"
          value={this.state.form.lastName || ''}
          onChange={this.handleInputChange('lastName')}
        />
        <br />
        <Text
          id="middleName"
          label="Middle name"
          value={this.state.form.middleName || ''}
          onChange={this.handleInputChange('middleName')}
        />
        <br />
        <RadioGroup
          id="gender"
          label="Gender"
          items={['MALE', 'FEMALE', 'UNDEFINED'].map(val => ({ id: val, value: val }))}
          checked={this.state.form.gender}
          onChange={this.handleInputChange('gender')}
        />
        <br />
        <Checkbox
          id="active"
          label="Is active"
          checked={!!this.state.form.isActive}
          onChange={this.handleInputChange('isActive')}
        />
        <Button onClick={this.handleClick}>Save</Button>
      </div>
    );
  }
}

/*
updateUser(
  id: ID!
  email: String!
  phone: String = null
  firstName: String = null
  lastName: String = null
  middleName: String = null
  gender: Gender = null
  birthdate: String = null
): User!
*/

export default Form;
