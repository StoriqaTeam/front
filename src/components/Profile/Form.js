// @flow

import React, { Component } from 'react';
import { assocPath } from 'ramda';

import { log } from 'utils';
import { Button } from 'components/Button';
import { Text, Checkbox } from 'components/Forms';

import './Form.scss';

type PropsTypes = {
  onSaveClick: Function,
};

type StateTypes = {
  form: {
    [key: string]: ?any
  },
};

class Form extends Component<PropsTypes, StateTypes> {
  state = {
    form: {},
  };
  handleInputChange = (id: string) => (value: any) => {
    this.setState(prevState => assocPath(['form', id], value, prevState));
  };

  handleClick = () => {
    this.props.onSaveClick(this.state.form);
  };

  render() {
    log.debug({ form: this.state.form });
    return (
      <form styleName="container" noValidate>
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
        <Checkbox
          id="active"
          label="Is active"
          checked={!!this.state.form.active}
          onChange={this.handleInputChange('active')}
        />
        <Button onClick={this.handleClick}>Save</Button>
      </form>
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
