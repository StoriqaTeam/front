// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import { log } from 'utils';
import { Form, UsersTable } from 'components/Profile';

import './Profile.scss';

type GraphQLUserType = {
  id: string,
  email: string,
  firstName: ?string,
  lastName: ?string,
  middleName: ?string,
  isActive: boolean,
  phone: ?string,
  birthdate: ?string,
  gender: "MALE" | "FEMALE" | "UNDEFINED"
};

type PropsTypes = {
  // me: GraphQLUserType,
  admin: boolean,
  users: Array<GraphQLUserType>,
};

class Profile extends PureComponent<PropsTypes> {
  render() {
    const { admin, users } = this.props;
    return (
      <div styleName="container">
        Profile settings {admin && '(admin)'}<br /><br />
        {admin && <UsersTable users={users} />}<br /><br />
        {!admin && <Form onSaveClick={data => log.debug({ data })} />}
      </div>
    );
  }
}

export default createFragmentContainer(
  Profile,
  graphql`
    fragment Profile_me on User {
      id
      email
      phone
      firstName
      lastName
      middleName
      birthdate
      gender
      isActive
    }
  `,
);
