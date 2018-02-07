// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import { log } from 'utils';
import { Form, UsersTable } from 'components/Profile';

import './Profile.scss';

type PropsTypes = {
  admin: boolean,
  users: Array<{
    id: string,
    firstName: string,
    lastName: string,
    isActive: boolean,
  }>,
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
    fragment Profile_viewer on Viewer {
      currentUser {
        id
        email
        firstName
        lastName
      }
    }
  `,
);
