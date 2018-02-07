// @flow

import React, { Component } from 'react';

import { Button } from 'components/Button';

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

  renderInput = (id: string) => {
    const value = this.state[id] || '';
    return (
      <label htmlFor={id}>
        {id}
        <br />
        <input
          id={id}
          type="text"
          name={id}
          value={value}
          onChange={this.handleInputChange}
        />
      </label>
    );
  };

  render() {
    return (
      <div styleName="container">
        {this.renderInput('phone')}
        <br />
        {this.renderInput('firstName')}
        <br />
        {this.renderInput('lastName')}
        <br />
        {this.renderInput('middleName')}
        <br />
        {this.renderInput('birthdate')}
        <br />
        <div>
          <Button
            title="Save"
            onClick={this.handleClick}
          />
        </div>
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
