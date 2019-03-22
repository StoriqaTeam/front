// @flow strict

import React, { Component } from 'react';
import { isEmpty, pathOr, head } from 'ramda';
import { Environment } from 'relay-runtime';
import { createFragmentContainer, graphql } from 'react-relay';
import classNames from 'classnames';
// $FlowIgnoreMe
import uuidv4 from 'uuid/v4';

import { ContextDecorator } from 'components/App';
// import { Button } from 'components/common';
// import { Icon } from 'components/Icon';

import {
  // $FlowIgnore
  CreateCustomerWithSourceMutation,
  // $FlowIgnore
  UpdateCustomerMutation,
} from 'relay/mutations';
import { withShowAlert } from 'components/Alerts/AlertContext';
import { log, fromRelayError } from 'utils';

import type { CardBrandType } from 'types';
import type { CreateCustomerWithSourceMutationType } from 'relay/mutations/CreateCustomerWithSourceMutation';
import type { AddAlertInputType } from 'components/Alerts/AlertContext';

import NewCardForm from './NewCardForm';

import './Cards.scss';

import t from './i18n';

type StateType = {
  // isNewCardForm: boolean,
  isLoading: boolean,
};

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
  showAlert: (input: AddAlertInputType) => void,
  environment: Environment,
  wizard?: boolean,
};

class Cards extends Component<PropsType, StateType> {
  // static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
  //   const { stripeCustomer } = nextProps.me;
  //   const isCards = Boolean(stripeCustomer && !isEmpty(stripeCustomer.cards));
  //   let checked = null;
  //   if (isCards) {
  //     checked = pathOr(null, ['cards', 0, 'id'], stripeCustomer);
  //     if (checked !== prevState.checked) {
  //       return { checked };
  //     }
  //   }
  //   return null;
  // }

  constructor(props: PropsType) {
    super(props);

    // const { stripeCustomer } = props.me;

    // const isCards = Boolean(stripeCustomer && !isEmpty(stripeCustomer.cards));
    // let checked = null;

    // if (isCards) {
    //   checked = pathOr(null, ['cards', 0, 'id'], stripeCustomer);
    // }

    this.state = {
      // checked,
      // isNewCardForm: !isCards,
      isLoading: false,
    };
  }

  // handleChange = (id: string) => {
  //   this.setState({
  //     checked: id,
  //   });
  // };

  // handleOpenNewCardForm = () => {
  //   this.setState({
  //     isNewCardForm: true,
  //   });
  // };
  //
  // handleCancelNewCardForm = () => {
  //   this.setState({
  //     isNewCardForm: false,
  //   });
  // };

  handleSaveNewCard = (token: { id: string }) => {
    const { stripeCustomer } = this.props.me;
    const isCards = Boolean(stripeCustomer && !isEmpty(stripeCustomer.cards));
    this.setState({ isLoading: true });
    const params: CreateCustomerWithSourceMutationType = {
      input: {
        clientMutationId: uuidv4(),
        cardToken: token.id,
      },
      environment: this.props.environment,
      // $FlowIgnore
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState({ isLoading: false });
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

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
          text: 'Your card was saved',
          link: { text: '' },
        });
        // this.setState(() => ({ isNewCardForm: false }));
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
    if (isCards) {
      UpdateCustomerMutation.commit(params);
      return;
    }
    CreateCustomerWithSourceMutation.commit(params);
  };

  handleDeleteCard = (id: string) => {
    log.debug(id);
  };

  render() {
    const { wizard, me } = this.props;
    const { firstName, lastName, email, stripeCustomer } = me;
    const { isLoading } = this.state;
    const isCards = Boolean(stripeCustomer && !isEmpty(stripeCustomer.cards));
    const card = isCards ? head(stripeCustomer.cards) : null;
    // $FlowIgnore
    const productsCount = pathOr(0, ['myStore', 'productsCount'], me);
    return (
      <div styleName={classNames('container', { wizard })}>
        <div styleName="cards">
          {
            <div styleName="table">
              {card && (
                <div styleName="card">
                  <div styleName="brand">{card.brand}</div>
                  <div styleName="last4">{`xxxxxxxxxxxx${card.last4}`}</div>
                  <div styleName="expirationDate">{`${card.expMonth}/${
                    card.expYear
                  }`}</div>
                  <div styleName="successText">
                    <span>{t.successText}</span>
                  </div>
                </div>
              )}

              {/*
                <Table
                  minWidth={640}
                  columns={[
                    // {
                    //   id: 1,
                    //   title: '',
                    // },
                    {
                      id: 2,
                      title: t.tableColumns.cardTypeNumber,
                    },
                    {
                      id: 3,
                      title: t.tableColumns.expirationDate,
                    },
                    {
                      id: 4,
                      title: t.tableColumns.cardholderName,
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
                        // {
                        //   id: 1,
                        //   content: (
                        //     <div styleName="radio">
                        //       <Checkbox
                        //         id={item.id}
                        //         isRadio
                        //         isChecked={checked === item.id}
                        //         onChange={this.handleChange}
                        //       />
                        //     </div>
                        //   ),
                        //   byContent: true,
                        // },
                        {
                          id: 2,
                          content: `•••• •••• •••• ${item.last4}`,
                        },
                        {
                          id: 3,
                          content: `${item.expMonth}/${item.expYear}`,
                        },
                        {
                          id: 4,
                          content: item.name,
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
                    stripeCustomer.cards,
                  )}
                />
              */}
            </div>
          }
          {/* (
              <div styleName="addButton">
                <Button
                  disabled={isNewCardForm}
                  wireframe
                  big
                  onClick={this.handleOpenNewCardForm}
                  dataTest="addCardButton"
                >
                  {t.changeCardInfo}
                </Button>
              </div>
            ) */}
          {
            <div styleName="block">
              <div styleName={classNames('newCardForm', { wizard })}>
                <NewCardForm
                  wizard={wizard}
                  name={`${firstName} ${lastName}`}
                  email={email}
                  onSave={this.handleSaveNewCard}
                  isCards={isCards}
                  isLoading={isLoading}
                />
              </div>
              {wizard !== true && (
                <div styleName="totalPayment">
                  <div styleName="productsCount totalPaymentBlock">
                    <div styleName="count">
                      <thin>{productsCount}</thin>
                    </div>
                    <div styleName="label">{t.productsPublished}</div>
                  </div>
                  <div styleName="monthlyPayment totalPaymentBlock">
                    <div styleName="count">
                      <thin>$0.00</thin>
                    </div>
                    <div styleName="label">{t.monthlyPayment}</div>
                  </div>
                </div>
              )}
            </div>
          }
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(
  withShowAlert(ContextDecorator(Cards)),
  graphql`
    fragment Cards_me on User {
      myStore {
        productsCount
      }
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
