// @flow

import React, { PureComponent } from 'react';
import { find, propEq } from 'ramda';

import { Checkbox } from 'components/Checkbox';
import { log } from 'utils';

import { Form } from 'components/Profile';

type PropsTypes = {
  users: Array<{
    id: string,
    firstName: string,
    lastName: string,
    isActive: boolean,
  }>
};

class UsersTable extends PureComponent<PropsTypes> {
  state = {
    user: null,
  };

  componentWillMount() {
    this.setState({ user: this.props.users[0] });
  }

  handleCheckboxChange = (id) => {
    log.info('      User id', id);
  }

  handleUserChoice = (e) => {
    const user = find(propEq('id', e.target.id))(this.props.users);
    this.setState({ user });
  }

  render() {
    const { users } = this.props;
    const { user } = this.state;
    return (
      <div>
        {users.map(item => (
          <div key={item.id}>
            <Checkbox
              id={item.id}
              isChecked={item.isActive}
              handleCheckboxChange={this.handleCheckboxChange}
            />&nbsp;
            <button
              id={item.id}
              onClick={this.handleUserChoice}
            >
              {`${item.firstName} ${item.lastName}`}
            </button>&nbsp;
            <span>
              {item.isActive ? 'active' : 'not active'}
            </span>
          </div>
        ))}<br /><br />
        {user.id && <Form user={user} />}
      </div>
    );
  }
}

export default UsersTable;
