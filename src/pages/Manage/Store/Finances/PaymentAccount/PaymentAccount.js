// @flow strict

import React, { Component, Fragment } from 'react';
import { pathOr } from 'ramda';
import { createFragmentContainer, graphql } from 'react-relay';

import { Checkbox } from 'components/common';
// import { Icon } from 'components/Icon';

import { withShowAlert } from 'components/Alerts/AlertContext';

import './PaymentAccount.scss';

// import t from './i18n';
//
// type RussianFormType = {
//   kpp: string,
//   bic: string,
//   inn: string,
//   fullName: string,
// };
//
// type InternationalFormType = {
//   swiftBic: string,
//   bankName: string,
//   iban: string,
//   fullName: string,
// };

type StateType = {
  // isLoading: boolean,
  paymentAccountType: 'internatioanal' | 'russian',
  // russianForm: RussianFormType,
  // internationalForm: InternationalFormType,
};

type PropsType = {
  // firstName: string,
  // lastName: string,
  // email: string,
  // stripeCustomer: {
  //   id: string,
  //   cards: Array<{
  //     id: string,
  //     brand: CardBrandType,
  //     country: string,
  //     customer: string,
  //     expMonth: number,
  //     expYear: number,
  //     last4: string,
  //     name: string,
  //   }>,
  // },
  me: {
    myStore: {
      warehouses: {
        addressFull: {
          countryCode: string,
        },
      },
    },
  },
  // showAlert: (input: AddAlertInputType) => void,
  // environment: Environment,
};

class PaymentAccount extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    // console.log('---props', props);
    // $FlowIgnore
    const countryCode = pathOr(
      null,
      ['myStore', 'warehouses', 0, 'addressFull', 'countryCode'],
      props.me,
    );
    // console.log('---countryCode', countryCode);

    this.state = {
      // isLoading: false,
      paymentAccountType: countryCode === 'RUS' ? 'russian' : 'internatioanal',
      // russianForm: {
      //   kpp: '',
      //   bic: '',
      //   inn: '',
      //   fullName: '',
      // },
      // internationalForm: {
      //   swiftBic: '',
      //   bankName: '',
      //   iban: '',
      //   fullName: '',
      // },
    };
  }

  // handleSaveNewCard = (token: { id: string }) => {
  //   this.setState({ isLoading: true });
  //   const params: CreateCustomerWithSourceMutationType = {
  //     input: {
  //       clientMutationId: '',
  //       cardToken: token.id,
  //     },
  //     environment: this.props.environment,
  //     // $FlowIgnore
  //     onCompleted: (response: ?Object, errors: ?Array<any>) => {
  //       this.setState({ isLoading: false });
  //       log.debug({ response, errors });
  //
  //       const relayErrors = fromRelayError({ source: { errors } });
  //       log.debug({ relayErrors });
  //
  //       // $FlowIgnoreMe
  //       const statusError: string = pathOr({}, ['100', 'status'], relayErrors);
  //       if (!isEmpty(statusError)) {
  //         this.props.showAlert({
  //           type: 'danger',
  //           text: `${t.error} "${statusError}"`,
  //           link: { text: t.close },
  //         });
  //         return;
  //       }
  //
  //       // $FlowIgnoreMe
  //       const parsingError = pathOr(null, ['300', 'message'], relayErrors);
  //       if (parsingError) {
  //         log.debug('parsingError:', { parsingError });
  //         this.props.showAlert({
  //           type: 'danger',
  //           text: t.somethingGoingWrong,
  //           link: { text: t.close },
  //         });
  //         return;
  //       }
  //       if (errors) {
  //         this.props.showAlert({
  //           type: 'danger',
  //           text: t.somethingGoingWrong,
  //           link: { text: t.close },
  //         });
  //         return;
  //       }
  //       this.props.showAlert({
  //         type: 'success',
  //         text: 'success',
  //         link: { text: '' },
  //       });
  //     },
  //     onError: (error: Error) => {
  //       this.setState(() => ({ isLoading: false }));
  //       log.error(error);
  //       this.props.showAlert({
  //         type: 'danger',
  //         text: t.somethingGoingWrong,
  //         link: { text: t.close },
  //       });
  //     },
  //   };
  //   CreateCustomerWithSourceMutation.commit(params);
  // };

  handleChangePaymentAccountType = (id: string) => {
    this.setState({
      paymentAccountType:
        id === 'russianPaymentAccountCheckbox' ? 'russian' : 'internatioanal',
    });
  };

  // handleInputChange = (id: string) => (e: any) => {
  //   this.setState({ errors: omit([id], this.state.errors) });
  //   const { value } = e.target;
  //   this.setState((prevState: StateType) => assocPath([id], value, prevState));
  // };
  //
  // renderInput = (props: { id: string, label: string, required?: boolean }) => {
  //   const { id, label, required } = props;
  //   const hereLabel = required === true ? (
  //     <span>
  //       {label} <span styleName="asterisk">*</span>
  //     </span>
  //   ) : (
  //     label
  //   );
  //   const value = path([id], this.state);
  //   const errors = path(['errors', id], this.state);
  //   return (
  //     <Input
  //       id={id}
  //       value={value || ''}
  //       label={hereLabel}
  //       onChange={this.handleInputChange(id)}
  //       errors={errors}
  //       fullWidth
  //     />
  //   );
  // };

  // renderRussianForm = (form: RussianFormType) => {
  //   const { kpp, bic, inn, fullName } = form;
  //
  //   return (
  //     <Fragment>
  //       <div>Russian Form</div>
  //     </Fragment>
  //   );
  // };
  //
  // renderInternatioanalForm = (form: InternationalFormType) => {
  //   const { swiftBic, bankName, iban, fullName } = form;
  //
  //   return (
  //     <Fragment>
  //       <div>Internatioan Form</div>
  //     </Fragment>
  //   );
  // };

  render() {
    const { paymentAccountType } = this.state;
    // const { paymentAccountType, russianForm, internationalForm } = this.state;
    return (
      <div styleName="container">
        <div styleName="checkboxes">
          <div styleName="checkbox">
            <Checkbox
              id="internationalPaymentAccountCheckbox"
              label="International"
              isRadio
              isChecked={paymentAccountType !== 'russian'}
              onChange={this.handleChangePaymentAccountType}
            />
          </div>
          <div className="checkbox">
            <Checkbox
              id="russianPaymentAccountCheckbox"
              label="Russian"
              isRadio
              isChecked={paymentAccountType === 'russian'}
              onChange={this.handleChangePaymentAccountType}
            />
          </div>
        </div>
        <div className="form">
          <Fragment>
            {/* {paymentAccountType === 'russian' ? this.renderRussianForm(russianForm) : this.renderInternatioanalForm(internationalForm)} */}
          </Fragment>
        </div>
      </div>
    );
  }
}

export default PaymentAccount;

// export default createFragmentContainer(
//   withShowAlert(PaymentAccount),
//   graphql`
//     fragment PaymentAccount_me on User {
//       myStore {
//         warehouses {
//           addressFull {
//             countryCode
//           }
//         }
//         russiaBillingInfo {
//           id
//           storeId
//           kpp
//           bic
//           inn
//           fullName
//         }
//         internationalBillingInfo {
//           id
//           storeId
//           swiftBic
//           bankName
//           fullName
//           iban
//         }
//       }
//     }
//   `,
// );
