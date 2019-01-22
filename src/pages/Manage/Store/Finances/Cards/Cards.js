// @flow strict

import React, { Component } from 'react';
import { map } from 'ramda';

import { Table, Button, Checkbox } from 'components/common';
import { Icon } from 'components/Icon';
import NewCardForm from './NewCardForm';

import './Cards.scss';

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
};

type PropsType = {
  firstName: string,
  lastName: string,
  email: string,
};

class Cards extends Component<PropsType, StateType> {
  state = {
    checked: 'card_1Dtv992eZvKYlo2ChPMWxCDv',
    isNewCardForm: false,
  };

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

    this.setState({
      isNewCardForm: false,
    });
  };

  handleDeleteCard = (id: string) => {
    console.log('---id', id);
  };

  render() {
    const { firstName, lastName, email } = this.props;
    const { checked, isNewCardForm } = this.state;
    return (
      <div styleName="container">
        <div styleName="cards">
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
          {isNewCardForm && (
            <div styleName="newCardForm">
              <NewCardForm
                name={`${firstName} ${lastName}`}
                email={email}
                onCancel={this.handleCancelNewCardForm}
                onSave={this.handleSaveNewCard}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Cards;
