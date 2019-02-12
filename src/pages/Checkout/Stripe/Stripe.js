// @flow

import React, { Component } from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';

import { SpinnerCircle } from 'components/common';
import CheckoutForm from './CheckoutForm';

import './Stripe.scss';

type StateType = {
  stripe: ?any,
};

type PropsType = {
  amount: number,
  currency: string,
  email: string,
  name: string,
  onPaid: () => void,
  paymentIntent: {
    id: string,
    clientSecret: string,
  },
};

class Stripe extends Component<PropsType, StateType> {
  constructor() {
    super();
    this.state = { stripe: null };
  }

  componentDidMount() {
    if (process.env.BROWSER) {
      const stripeJs = document.createElement('script');
      stripeJs.src = 'https://js.stripe.com/v3/';
      stripeJs.async = true;
      stripeJs.onload = () => {
        this.initStripeByState();
      };
      document.body && document.body.appendChild(stripeJs); // eslint-disable-line
    }
  }

  initStripeByState = () => {
    this.setState({
      stripe: window.Stripe(process.env.REACT_APP_STRIPE_API_KEY, {
        betas: ['payment_intent_beta_3'],
      }),
    });
  };

  render() {
    const { stripe } = this.state;
    if (!stripe) {
      return (
        <div styleName="loader">
          <SpinnerCircle forPaid />
        </div>
      );
    }
    return (
      <StripeProvider stripe={this.state.stripe}>
        <div>
          <Elements
            fonts={[
              {
                cssSrc: 'https://fonts.googleapis.com/css?family=Roboto',
              },
            ]}
          >
            <CheckoutForm {...this.props} />
          </Elements>
        </div>
      </StripeProvider>
    );
  }
}

export default Stripe;
