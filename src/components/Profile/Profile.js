// @flow

import React, { PureComponent } from 'react';
import { pathOr } from 'ramda';

import { Button } from 'components/Button';
import { log } from 'utils';

import './Profile.scss';

type PropsTypes = {
  profileData: {
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
    const { profileData } = this.props;
    const firstName = pathOr('', ['firstName'], profileData);
    const lastName = pathOr('', ['lastName'], profileData);
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

export default Profile;
