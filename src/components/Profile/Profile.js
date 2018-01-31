// @flow

import React, { PureComponent } from 'react';

import './Profile.scss';

class Profile extends PureComponent {
  render() {
    return (
      <div styleName="container">
        Profile settings<br />
        First name<br />
        <input type="text" /><br />
        Last name<br />
        <input type="text" />
      </div>
    );
  }
}

export default Profile;
