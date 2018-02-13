// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';

import { log } from 'utils';
import { UpdateUserMutation } from 'relay/mutations';
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
  me: GraphQLUserType,
  admin: boolean,
  users: Array<GraphQLUserType>,
};

class Profile extends PureComponent<PropsTypes> {
  handleSave = (data: {}) => {
    UpdateUserMutation.commit({
      input: {
        clientMutationId: '',
        id: this.props.me.id,
        ...data,
      },
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<Error>) => {
        log.debug({ response, errors });
      },
      onError: (error: Error) => {
        log.debug({ error });
      },
    });
  };
  render() {
    const { admin, users } = this.props;
    return (
      <div styleName="container">
        Profile settings {admin && '(admin)'}<br /><br />
        {admin && <UsersTable users={users} />}<br /><br />
        {!admin && (
          <Form
            onSaveClick={this.handleSave}
            profileData={this.props.me}
          />
        )}
      </div>
    );
  }
}

Profile.contextTypes = {
  environment: PropTypes.object.isRequired,
};

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
