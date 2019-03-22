// @flow strict

import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import classNames from 'classnames';
import { pathOr } from 'ramda';
// $FlowIgnore
import copy from 'copy-to-clipboard';

import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { Tabs } from 'components/common';
import { Icon } from 'components/Icon';

import type { CardBrandType } from 'types';

import { Cards, PaymentAccount, Balance, WalletCode } from './';

import './Finances.scss';

import t from './i18n';

type PropsType = {
  me: {
    firstName: string,
    lastName: string,
    email: string,
    stripeCustomer: {
      id: string,
      cards: Array<{
        id: string,
        brand: CardBrandType,
        country: string,
        customer: string,
        expMonth: number,
        expYear: number,
        last4: string,
        name: string,
      }>,
    },
  },
};

type StateType = {
  selectedTab: number,
  isCopiedWalletAddress: boolean,
};

class Finances extends Component<PropsType, StateType> {
  state: StateType = {
    selectedTab: 0,
    isCopiedWalletAddress: false,
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  timer: TimeoutID;

  handleClickTab = (selectedTab: number) => {
    this.setState({ selectedTab });
  };

  handleCopyWalletAddress = (walletAddress: string) => {
    clearTimeout(this.timer);

    this.setState({ isCopiedWalletAddress: true });

    this.timer = setTimeout(() => {
      this.setState({ isCopiedWalletAddress: false });
    }, 3000);

    copy(walletAddress);
  };

  render() {
    const { me } = this.props;
    const { selectedTab, isCopiedWalletAddress } = this.state;
    // $FlowIgnore
    const walletAddress = pathOr(
      null,
      ['myStore', 'storeSubscription', 'walletAddress'],
      me,
    );

    // const walletAddress = '67s6s67s6fs67gs67g679df67gd78';

    return (
      <div styleName="container">
        <div styleName="wrap">
          <div styleName="tabs">
            <Tabs selected={selectedTab} onClick={this.handleClickTab}>
              <div label={t.paymentOptions} styleName="paymentOptions">
                <div styleName="title">
                  <strong>{t.bankCards}</strong>
                </div>
                <div styleName="cards">
                  <Cards me={me} />
                </div>
                {walletAddress && (
                  <div styleName="storeSubscription">
                    <div styleName="title">
                      <strong>{t.addressCrypto}</strong>
                    </div>
                    <div styleName="walletAddress">
                      {walletAddress}
                      <button
                        styleName={classNames('copyWalletAddressButton', {
                          isCopiedWalletAddress,
                        })}
                        onClick={() => {
                          this.handleCopyWalletAddress(walletAddress);
                        }}
                        data-test="copyWalletAddressButton"
                      >
                        <Icon type="copy" size={32} />
                      </button>
                      <div
                        styleName={classNames('copyMessage', {
                          isCopiedWalletAddress,
                        })}
                        data-test="copyRefButton"
                      >
                        {t.copied}
                      </div>
                    </div>
                  </div>
                )}
                <div styleName="walletCode">
                  <WalletCode />
                </div>
              </div>
              <div label={t.paymentAccount} styleName="paymentAccount">
                <PaymentAccount me={me} />
              </div>
              <div label={t.balance} styleName="balance">
                <Balance me={me} />
              </div>
            </Tabs>
          </div>
        </div>
      </div>
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
      myStore {
        storeSubscription {
          walletAddress
        }
        productsCount
      }
      ...Cards_me
      ...PaymentAccount_me
      ...Balance_me
    }
  `,
);
