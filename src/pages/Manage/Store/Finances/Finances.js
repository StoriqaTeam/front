// @flow strict

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { assocPath, pathOr, propOr, pick, isEmpty } from 'ramda';
import { createFragmentContainer, graphql } from 'react-relay';

import { AppContext, Page } from 'components/App';
import { withShowAlert } from 'components/Alerts/AlertContext';
import { ManageStore } from 'pages/Manage/Store';
import { Tabs } from 'components/common';

import type { CardBrandType } from 'types';

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
  me: {
    firstName: string,
    lastName: string,
    email: string,
    stripeCustomer: {
      id: string,
      cards: {
        id: string,
        brand: CardBrandType,
        country: string,
        customer: string,
        expMonth: number,
        expYear: number,
        last4: string,
        name: string,
      },
    },
  },
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
    const { me } = this.props;
    console.log('---me', me);
    const { firstName, lastName, email, stripeCustomer } = me;
    const { selectedTab } = this.state;

    return (
      <AppContext.Consumer>
        {({ environment }) => (
          <div styleName="container">
            <div styleName="wrap">
              <div styleName="tabs">
                <Tabs selected={selectedTab} onClick={this.handleClickTab}>
                  <div label="Your cards">
                    <Cards
                      firstName={firstName}
                      lastName={lastName}
                      email={email}
                      stripeCustomer={stripeCustomer}
                      environment={environment}
                    />
                  </div>
                  <div label="Payment account">
                    This is the Paymnet account panel
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

Finances.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default createFragmentContainer(
  Page(
    ManageStore({
      OriginalComponent: Finances,
      active: 'finances',
      title: 'Payment settings',
    }),
  ),
  graphql`
    fragment Finances_me on User {
      firstName
      lastName
      email
      stripeCustomer {
        id
        cards {
          id
          brand
          country
          customer
          expMonth
          expYear
          last4
          name
        }
      }
    }
  `,
);
