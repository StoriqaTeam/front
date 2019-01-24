// @flow strict

import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import { AppContext, Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { Tabs } from 'components/common';

import type { CardBrandType } from 'types';

import { Cards } from './';

import './Finances.scss';

import t from './i18n';

type PropsType = {
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
  selectedTab: number,
};

class Finances extends Component<PropsType, StateType> {
  state: StateType = {
    selectedTab: 0,
  };

  handleClickTab = (selectedTab: number) => {
    this.setState({ selectedTab });
  };

  render() {
    const { me } = this.props;
    const { firstName, lastName, email, stripeCustomer } = me;
    const { selectedTab } = this.state;

    return (
      <AppContext.Consumer>
        {({ environment }) => (
          <div styleName="container">
            <div styleName="wrap">
              <div styleName="tabs">
                <Tabs selected={selectedTab} onClick={this.handleClickTab}>
                  <div label={t.yourCards} styleName="cards">
                    <Cards
                      firstName={firstName}
                      lastName={lastName}
                      email={email}
                      stripeCustomer={stripeCustomer}
                      environment={environment}
                    />
                  </div>
                  <div label={t.paymentAccount} styleName="paymentAccount">
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
