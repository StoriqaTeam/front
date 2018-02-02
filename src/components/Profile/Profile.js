// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr } from 'ramda';

import { Button } from 'components/Button';
import { log } from 'utils';

import './Profile.scss';

type PropsTypes = {
  currentUser: {
    firstName: string,
    lastName: string,
  },
  admin: boolean,
};

type StateTypes = {
  firstName: string,
  lastName: string,
};

class Profile extends PureComponent<PropsTypes, StateTypes> {
  state: StateType = {
    firstName: '',
    lastName: '',
  };

  componentWillMount() {
    // console.log('-----process.env', process.env);
    const { currentUser } = this.props;
    const firstName = pathOr('', ['firstName'], currentUser);
    const lastName = pathOr('', ['lastName'], currentUser);
    this.setState({ firstName, lastName });
  }

  handleInputChange = (e: Object) => {
    const { target } = e;
    this.setState({ [target.name]: target.value });
  };

  saveData = () => {
    const { firstName, lastName } = this.state;
    log.info('firstName: ', firstName, ', lastName: ', lastName);
  }

  render() {
    const { admin } = this.props;
    const { firstName, lastName } = this.state;
    log.info('-----this.props.currentUser', this.props.currentUser);
    return (
      <div styleName="container">
        Profile settings ({admin && 'admin'})<br /><br />
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
        />
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

export default createFragmentContainer(
  Profile,
  graphql`
    fragment Profile_currentUser on User {
      firstName
      lastName
    }
  `,
);
