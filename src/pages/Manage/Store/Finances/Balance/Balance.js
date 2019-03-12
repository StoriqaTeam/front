/* eslint-disable */
import React, { Component, Fragment } from 'react';
import {
  isEmpty,
  pathOr,
  path,
  assocPath,
  assoc,
  omit,
  isNil,
  filter,
  take,
  map,
  clone,
  find,
  propEq,
} from 'ramda';
import { Environment } from 'relay-runtime';
import { createFragmentContainer, graphql } from 'react-relay';
import uuidv4 from 'uuid/v4';

import { ContextDecorator } from 'components/App';
import {
  Checkbox,
  Input,
  Button,
  Select,
  RadioButton,
} from 'components/common';
import { Confirmation } from 'components/Confirmation';
import { Modal } from 'components/Modal';
import { calculatePayout } from 'relay/queries';
import { PayOutCryptoToSellerMutation } from 'relay/mutations';
import { log, formatPrice } from 'utils';

// import {  } from 'relay/mutations';
import { withShowAlert } from 'components/Alerts/AlertContext';
// import { log, fromRelayError } from 'utils';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';
import type { CurrenciesType } from 'types';

import './Balance.scss';

import t from './i18n';

type StateType = {
  btcWallet: string,
  ethWallet: string,
  stqWallet: string,
  calculatePayoutLoading: ?CurrenciesType,
  showModal: boolean,
  calculatePayoutData: ?{
    blockchainFeeOptions: Array<{
      estimatedTimeSeconds: number,
      value: string,
    }>,
    currency: CurrenciesType,
    grossAmount: number,
    orderIds: Array<string>,
  },
  checkedFeeEstimatedTime: ?string,
  walletAddress: ?string,
};

type PropsType = {
  environment: Environment,
  me: {
    myuStore: {
      getBalances: {
        btc: number,
        eth: number,
        stq: number,
        eur: number,
      },
    },
  },
  showAlert: (input: AddAlertInputType) => void,
};

class Balance extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      btcWallet: '',
      ethWallet: '',
      stqWallet: '',
      calculatePayoutLoading: null,
      showModal: false,
      calculatePayoutData: null,
      checkedFeeEstimatedTime: null,
      walletAddress: null,
    };
  }

  sendPayout = (currency: CurrenciesType, walletAddress: string) => {
    this.setState({
      calculatePayoutLoading: currency,
      showModal: true,
    });
    // $FlowIgnore
    const storeId = pathOr(null, ['me', 'myStore', 'rawId'], this.props);

    calculatePayout({
      variables: {
        input: {
          storeId,
          currency,
          walletAddress,
        },
      },
      environment: this.props.environment,
    })
      .then(data => {
        if (data && data.calculatePayout) {
          // $FlowIgnore
          this.setState({
            calculatePayoutData: clone(data.calculatePayout),
            walletAddress,
          });
        }
        return true;
      })
      .finally(() => {
        this.setState({ calculatePayoutLoading: false });
      })
      .catch(error => {
        log.error(error);
      });
  };

  handleCreateTransaction = () => {
    const {
      calculatePayoutData,
      checkedFeeEstimatedTime,
      walletAddress,
    } = this.state;

    if (calculatePayoutData == null) {
      this.props.showAlert({
        type: 'danger',
        text: t.somethingGoingWrong,
        link: { text: t.close },
      });
      return;
    }

    const blockchainFeeData = find(
      propEq('estimatedTimeSeconds', parseFloat(checkedFeeEstimatedTime)),
    )(calculatePayoutData.blockchainFeeOptions);

    console.log('---blockchainFeeData', blockchainFeeData);

    if (blockchainFeeData == null) {
      this.props.showAlert({
        type: 'danger',
        text: t.somethingGoingWrong,
        link: { text: t.close },
      });
      return;
    }

    PayOutCryptoToSellerMutation({
      environment: this.props.environment,
      variables: {
        input: {
          clientMutationId: uuidv4(),
          orderIds: calculatePayoutData.orderIds,
          walletCurrency: calculatePayoutData.currency,
          walletAddress,
          blockchainFee: blockchainFeeData.value,
        },
      },
      // updater: relayStore => {
      //   const storeSubscription = relayStore.getRootField('updateStoreSubscription');
      //   const me = relayStore.getRoot().getLinkedRecord('me');
      //   const myStore = me.getLinkedRecord('myStore');
      //   myStore.setLinkedRecord(storeSubscription, 'storeSubscription');
      // },
    })
      .then(() => {
        this.props.showAlert({
          type: 'success',
          text: 'Все заебись!!!',
          link: { text: t.close },
        });
        return true;
      })
      .catch(() => {
        this.props.showAlert({
          type: 'danger',
          text: t.somethingGoingWrong,
          link: { text: t.close },
        });
      });
  };

  handleCloseModal = () => {
    this.setState({
      calculatePayoutData: null,
      checkedFeeEstimatedTime: null,
      walletAddress: null,
    });
  };

  handleCheckedFee = (id: string) => {
    this.setState({ checkedFeeEstimatedTime: id });
  };

  handleChangeInput = (id: string) => (e: any) => {
    const { value } = e.target;
    this.setState({ [id]: value });
  };

  renderItem = (props: {
    id: string,
    label: CurrenciesType,
    amount: number,
    value?: string,
  }) => {
    const { id, label, amount, value } = props;
    const { calculatePayoutLoading } = this.state;
    return (
      <div styleName="item">
        <div styleName="label">{`${label}:`}</div>
        <div styleName="amount">{amount}</div>
        {value != null &&
          Boolean(amount) && (
            <Fragment>
              <div styleName="input">
                <Input
                  id={id}
                  value={value}
                  onChange={this.handleChangeInput(id)}
                  fullWidth
                  extraSmall
                  inline
                />
              </div>
              <div styleName="sendButton">
                <Button
                  disabled={value === ''}
                  extraSmall
                  onClick={() => {
                    this.sendPayout(label, value);
                  }}
                  isLoading={calculatePayoutLoading === label}
                >
                  Send
                </Button>
              </div>
            </Fragment>
          )}
      </div>
    );
  };

  render() {
    const {
      btcWallet,
      ethWallet,
      stqWallet,
      showModal,
      calculatePayoutData,
      checkedFeeEstimatedTime,
    } = this.state;
    // $FlowIgnore
    const balance = pathOr([], ['myStore', 'getBalances'], this.props.me);
    return (
      <div styleName="container">
        <Confirmation
          showModal={calculatePayoutData != null}
          handleCloseModal={this.handleCloseModal}
          title="Title modal"
          description="Desc modal"
          onCancel={this.handleCloseModal}
          onConfirm={this.handleCreateTransaction}
          confirmText="Send"
          cancelText="Cancel"
          disableConfirm={checkedFeeEstimatedTime == null}
        >
          {calculatePayoutData != null && (
            <div styleName="modalBody">
              <div styleName="amount">
                <div styleName="amountLabel">Amount:</div>
                <div styleName="amountValue">
                  <strong>{`${calculatePayoutData.grossAmount} ${
                    calculatePayoutData.currency
                  }`}</strong>
                </div>
              </div>
              <div styleName="fees">
                <div styleName="feesLabel">Fee:</div>
                {calculatePayout &&
                  map(item => {
                    return (
                      <div
                        key={item.estimatedTimeSeconds}
                        styleName="feeRadioButton"
                      >
                        <RadioButton
                          inline
                          id={`${item.estimatedTimeSeconds}`}
                          isChecked={
                            `${item.estimatedTimeSeconds}` ===
                            checkedFeeEstimatedTime
                          }
                          onChange={this.handleCheckedFee}
                        />
                        <div styleName="feeLabel">
                          {`${formatPrice(parseFloat(item.value))} ${
                            calculatePayoutData.currency
                          }`}
                          <br />
                          {`Estimated time: ${item.estimatedTimeSeconds} sec.`}
                        </div>
                      </div>
                    );
                  }, calculatePayoutData.blockchainFeeOptions)}
              </div>
            </div>
          )}
        </Confirmation>
        <div styleName="crypto">
          {this.renderItem({
            id: 'btcWallet',
            label: 'BTC',
            amount: balance.btc,
            value: btcWallet,
          })}
          {this.renderItem({
            id: 'ethWallet',
            label: 'ETH',
            amount: balance.eth,
            value: ethWallet,
          })}
          {this.renderItem({
            id: 'stqWallet',
            label: 'STQ',
            amount: balance.stq,
            value: stqWallet,
          })}
        </div>
        <div styleName="fiat">
          {this.renderItem({
            id: 'eurWallet',
            label: 'EUR',
            amount: balance.eur,
          })}
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(
  withShowAlert(ContextDecorator(Balance)),
  graphql`
    fragment Balance_me on User {
      myStore {
        rawId
        getBalances {
          stq
          btc
          eth
          eur
        }
      }
    }
  `,
);
/* eslint-enable */
