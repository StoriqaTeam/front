// @flow

import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr } from 'ramda';

import { Button } from 'components/Button';
import { log } from 'utils';

import './Profile.scss';

type PropsTypes = {
  // currentUser: {
  //   firstName: string,
  //   lastName: string,
  // },
  viewer: any, // eslint-disable-line
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
    const currentUser = pathOr(null, ['viewer', 'currentUser'], this.props);
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
  };

  render() {
    log.debug({ props: this.props });
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

export default createFragmentContainer(
  Profile,
  graphql`
    fragment Profile_viewer on Viewer {
      currentUser {
        id
        firstName
        lastName
      }
    }
  `,
);
