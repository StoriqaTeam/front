// @flow strict

import React, { Component } from 'react';
import { map, isEmpty, pathOr } from 'ramda';
import { Environment } from 'relay-runtime';

import { Table, Button, Checkbox } from 'components/common';
import { Icon } from 'components/Icon';

// $FlowIgnore
import { CreateCustomerWithSourceMutation } from 'relay/mutations';
import { withShowAlert } from 'components/Alerts/AlertContext';
import { log, fromRelayError } from 'utils';

import type { CardBrandType } from 'types';
import type { CreateCustomerWithSourceMutationType } from 'relay/mutations/CreateCustomerWithSourceMutation';
import type { AddAlertInputType } from 'components/Alerts/AlertContext';

import NewCardForm from './NewCardForm';

import './Cards.scss';

import t from './i18n';

const cards = [
  {
    id: 'card_1Dtv992eZvKYlo2ChPMWxCDv',
    object: 'card',
    address_city: null,
    address_country: null,
    address_line1: null,
    address_line1_check: null,
    address_line2: null,
    address_state: null,
    address_zip: null,
    address_zip_check: null,
    brand: 'Visa',
    country: 'US',
    customer: 'Aleksey Levenets',
    cvc_check: null,
    dynamic_last4: null,
    exp_month: 8,
    exp_year: 2020,
    fingerprint: 'Xt5EWLLDS7FJjR1c',
    funding: 'credit',
    last4: '1234',
    metadata: {},
    name: null,
    tokenization_method: null,
  },
  {
    id: 'card_1Dtv992eZvKYlo2ChPMWxHgY',
    object: 'card',
    address_city: null,
    address_country: null,
    address_line1: null,
    address_line1_check: null,
    address_line2: null,
    address_state: null,
    address_zip: null,
    address_zip_check: null,
    brand: 'MasterCard',
    country: 'US',
    customer: 'Aleksey Levenets',
    cvc_check: null,
    dynamic_last4: null,
    exp_month: 11,
    exp_year: 2021,
    fingerprint: 'Xt5EWLLDS7FJjR1c',
    funding: 'credit',
    last4: '4242',
    metadata: {},
    name: null,
    tokenization_method: null,
  },
];

type StateType = {
  checked: number | string,
  isNewCardForm: boolean,
  isLoading: boolean,
};

type PropsType = {
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
  showAlert: (input: AddAlertInputType) => void,
  environment: Environment,
};

class Cards extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    const { stripeCustomer } = props;

    this.state = {
      checked: 'card_1Dtv992eZvKYlo2ChPMWxCDv',
      isNewCardForm: Boolean(!stripeCustomer || isEmpty(stripeCustomer.cards)),
      isLoading: false,
    };
  }

  handleChange = (id: string) => {
    this.setState({
      checked: id,
    });
  };

  handleOpenNewCardForm = () => {
    this.setState({
      isNewCardForm: true,
    });
  };

  handleCancelNewCardForm = () => {
    this.setState({
      isNewCardForm: false,
    });
  };

  handleSaveNewCard = (token: *) => {
    console.log('---token', token);
    const params: CreateCustomerWithSourceMutationType = {
      input: {
        clientMutationId: '',
        cardToken: token.id,
      },
      environment: this.props.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState({ isLoading: false });
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        // if (!isEmpty(validationErrors)) {
        //   const formErrors = renameKeys(
        //     {
        //       long_description: 'longDescription',
        //       short_description: 'shortDescription',
        //       seo_title: 'seoTitle',
        //       seo_description: 'seoDescription',
        //       vendor_code: 'vendorCode',
        //     },
        //     validationErrors,
        //   );
        //   this.setState({ formErrors });
        //   return;
        // }

        // $FlowIgnoreMe
        const statusError: string = pathOr({}, ['100', 'status'], relayErrors);
        if (!isEmpty(statusError)) {
          this.props.showAlert({
            type: 'danger',
            text: `${t.error} "${statusError}"`,
            link: { text: t.close },
          });
          return;
        }

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'success',
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: t.somethingGoingWrong,
          link: { text: t.close },
        });
      },
    };
    CreateCustomerWithSourceMutation.commit(params);

    // console.log('---token', token);
    //
    // this.setState({
    //   isNewCardForm: false,
    // });
  };

  handleDeleteCard = (id: string) => {
    console.log('---id', id);
  };

  render() {
    console.log('---this.props', this.props);
    const { firstName, lastName, email, stripeCustomer } = this.props;
    const { checked, isNewCardForm, isLoading } = this.state;
    const isCards = stripeCustomer && !isEmpty(stripeCustomer.cards);
    return (
      <div styleName="container">
        <div styleName="cards">
          {isCards && (
            <div styleName="table">
              <Table
                minWidth={640}
                columns={[
                  {
                    id: 1,
                    title: '',
                  },
                  {
                    id: 2,
                    title: 'Card type & number',
                  },
                  {
                    id: 3,
                    title: 'Expiration date',
                  },
                  {
                    id: 4,
                    title: 'Cardholder name',
                  },
                  {
                    id: 5,
                    title: '',
                  },
                ]}
                data={map(
                  item => ({
                    id: item.id,
                    item: [
                      {
                        id: 1,
                        content: (
                          <div styleName="radio">
                            <Checkbox
                              id={item.id}
                              isRadio
                              isChecked={checked === item.id}
                              onChange={this.handleChange}
                            />
                          </div>
                        ),
                        byContent: true,
                      },
                      {
                        id: 2,
                        content: `•••• •••• •••• ${item.last4}`,
                      },
                      {
                        id: 3,
                        content: `${item.exp_month}/${item.exp_year}`,
                      },
                      {
                        id: 4,
                        content: item.customer,
                      },
                      {
                        id: 5,
                        content: (
                          <div
                            styleName="deleteButton"
                            onClick={() => {
                              this.handleDeleteCard(item.id);
                            }}
                            onKeyDown={() => {}}
                            role="button"
                            tabIndex="0"
                          >
                            <Icon type="basket" size={32} />
                          </div>
                        ),
                        byContent: true,
                        align: 'right',
                      },
                    ],
                  }),
                  cards,
                )}
              />
            </div>
          )}
          {isCards && (
            <div styleName="addButton">
              <Button
                disabled={isNewCardForm}
                wireframe
                big
                onClick={this.handleOpenNewCardForm}
                dataTest="addCardButton"
              >
                Add a new card
              </Button>
            </div>
          )}
          {isNewCardForm && (
            <div styleName="newCardForm">
              <NewCardForm
                name={`${firstName} ${lastName}`}
                email={email}
                onCancel={this.handleCancelNewCardForm}
                onSave={this.handleSaveNewCard}
                isCards={isCards}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withShowAlert(Cards);
