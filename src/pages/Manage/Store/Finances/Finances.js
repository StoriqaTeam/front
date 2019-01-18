// @flow strict

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { assocPath, pathOr, propOr, pick, isEmpty } from 'ramda';
// import { createFragmentContainer, graphql } from 'react-relay';

import { withShowAlert } from 'components/Alerts/AlertContext';
import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { Tabs } from 'components/common';
import { Cards } from './';
// import { Button, Input } from 'components/common';
// import { AddressForm } from 'components/AddressAutocomplete';
// import ModerationStatus from 'pages/common/ModerationStatus';
// import { UpdateStoreMutation, UpdateStoreMainMutation } from 'relay/mutations';
// import { log, fromRelayError } from 'utils';

// import type { AddAlertInputType } from 'components/Alerts/AlertContext';
// import type { MutationParamsType } from 'relay/mutations/UpdateStoreMutation';
// import type { Contacts_me as ContactsMeType } from './__generated__/Contacts_me.graphql';

import './Finances.scss';

// import t from './i18n';

type PropsType = {
  // showAlert: (input: AddAlertInputType) => void,
  // me: ContactsMeType,
};

type StateType = {
  isLoading: boolean,
  selectedTab: number,
};

class Finances extends Component<PropsType, StateType> {
  state: StateType = {
    isLoading: false,
    selectedTab: 0,
  };

  handleClickTab = (selectedTab: number) => {
    this.setState({ selectedTab });
  };

  render() {
    const { selectedTab } = this.state;

    return (
      <div styleName="container">
        <div styleName="wrap">
          <div styleName="tabs">
            <Tabs
              selected={selectedTab}
              onClick={this.handleClickTab}
            >
              <div label="Your cards">
                <Cards />
              </div>
              <div label="Paymnets">This is the Paymnets panel</div>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

Finances.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default withShowAlert(Page(ManageStore({
  OriginalComponent: Finances,
  active: 'finances',
  title: 'Payment settings',
})));
