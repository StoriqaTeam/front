// @flow

import React, { PureComponent } from 'react';
import { pathOr } from 'ramda';

import { Button } from 'components/Button';

import { log } from 'utils';

import './Form.scss';

type PropsTypes = {
  user: {
    id: string,
    firstName: string,
    lastName: string,
  },
};

type StateType = {
  firstName: string,
  lastName: string,
};

class Form extends PureComponent<PropsTypes, StateType> {
  state: StateType = {
    firstName: '',
    lastName: '',
  };

  componentWillMount() {
    const { user } = this.props;
    const firstName = pathOr('', ['firstName'], user);
    const lastName = pathOr('', ['lastName'], user);
    this.setState({ firstName, lastName });
  }

  componentWillReceiveProps({ user }) {
    if (user && user !== this.props.user) {
      this.setState({
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  }

  handleInputChange = (e: Object) => {
    const { target } = e;
    this.setState({ [target.name]: target.value });
  };

  saveData = () => {
    const { firstName, lastName } = this.state;
    log.info('      firstName: ', firstName, ', lastName: ', lastName);
  }

  render() {
    const { firstName, lastName } = this.state;
    return (
      <div styleName="container">
        First name<br />
        <input
          type="text"
          name="firstName"
          value={firstName}
          onChange={this.handleInputChange}
        /><br /><br />
        Last name<br />
        <input
          type="text"
          name="lastName"
          value={lastName}
          onChange={this.handleInputChange}
        /><br /><br />
        <div>
          <Button
            title="Save"
            onClick={this.saveData}
          />
        </div>
      </div>
    );
  }
}

export default Form;
