// @flow

import React, { Component } from 'react';

import { Button } from 'components/Button';
import { Text } from 'components/Forms';

import './Form.scss';

type PropsTypes = {
  onSaveClick: Function,
};

type StateTypes = {
  [key: string]: ?any,
};

class Form extends Component<PropsTypes, StateTypes> {
  state = {};
  handleInputChange = (e: Object) => {
    const { target } = e;
    this.setState({ [target.name]: target.value });
  };

  handleClick = () => {
    this.props.onSaveClick(this.state);
  };

  // gender, isActive
  render() {
    return (
      <form styleName="container">
        <Text
          id="phone"
          label="Phone"
          value={this.state.phone}
          onChange={this.handleInputChange}
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
