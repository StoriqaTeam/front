// @flow strict

import React, { Component, Fragment } from 'react';

import { Cards } from 'pages/Manage/Store/Finances';
import { RadioButton } from 'components/common';

import type { MeType } from '../Wizard';

import './Step4.scss';

import t from './i18n';

type PropsType = {
  me: MeType,
  onSetSubscribe: (currency: string) => void,
  subscriptionCurrency: ?string,
};

class Step4 extends Component<PropsType> {
  constructor(props: PropsType) {
    super(props);

    if (props.subscriptionCurrency == null) {
      props.onSetSubscribe('EUR');
    }
  }

  handleChangeRadio = (currency: string) => {
    this.props.onSetSubscribe(currency);
  };

  render() {
    const { me, subscriptionCurrency } = this.props;

    return (
      <div styleName="container">
        <div styleName="topTitle">
          <div styleName="title">{t.fillTheCardInformation}</div>
          <div styleName="desc">
            {`${t.yourCardWillBe} `}
            <a
              href="https://storiqa.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.learnMore}
            </a>
          </div>
        </div>
        <div styleName="cards">
          <Cards me={me} wizard />
        </div>
        {me.stripeCustomer && (
          <Fragment>
            <div styleName="bottomTitle">
              <div styleName="title">{t.paymentMethodForPlacingGoods}</div>
              <div styleName="desc">{t.chooseTheMethodOfPayment}</div>
            </div>
            <div styleName="subscribeButtons">
              <div styleName="subscribeButton">
                <div styleName="price">
                  <strong>{`${t.fiatPrice} `}</strong>
                  {t.perDay}
                </div>
                <div styleName="priceDesc">{t.theMoneyWillBeWithdrawn}</div>
                <div styleName="radio">
                  <RadioButton
                    id="EUR"
                    isChecked={subscriptionCurrency !== 'STQ'}
                    onChange={this.handleChangeRadio}
                  />
                </div>
              </div>
              <div styleName="subscribeButton">
                <div styleName="price">
                  <strong>{`${t.cryptoPrice} `}</strong>
                  {t.perDay}
                </div>
                <div styleName="priceDesc">{t.specialWalletWillBeCreated}</div>
                <div styleName="radio">
                  <RadioButton
                    id="STQ"
                    isChecked={subscriptionCurrency === 'STQ'}
                    onChange={this.handleChangeRadio}
                  />
                </div>
              </div>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

export default Step4;
