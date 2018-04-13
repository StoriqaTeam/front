// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { specs, validate } from '@storiqa/shared';

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

type StateType = {
  formErrors: {},
};

class Profile extends Component<PropsTypes, StateType> {
  state: StateType = {
    formErrors: {},
  };

  handleSave = (data: {}) => {
    const { errors: formErrors } = validate(specs.profile, data);
    if (formErrors) {
      this.setState({ formErrors });
      return;
    }
    this.setState({ formErrors: {} });
    UpdateUserMutation.commit({
      input: {
        clientMutationId: '',
        id: this.props.me.id,
        ...data,
      },
      environment: this.context.environment,
      onCompleted: (response: ?Object, mutationErrors: ?Array<Error>) => {
        log.debug({ response, mutationErrors });
        this.context.showAlert('Success');
      },
      onError: (error: Error) => {
        log.debug({ error });
        this.context.showAlert('Something going wrong', true);
      },
    });
  };
  render() {
    const { admin, users } = this.props;
    const { formErrors } = this.state;
    return (
      <div styleName="container">
        Profile settings {admin && '(admin)'}<br /><br />
        {admin && <UsersTable users={users} />}<br /><br />
        {!admin && (
          <Form
            onSaveClick={this.handleSave}
            profileData={this.props.me || {}}
            errors={formErrors}
          />
        )}
      </div>
    );
  }
}

Profile.contextTypes = {
  environment: PropTypes.object.isRequired,
  showAlert: PropTypes.func,
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
