// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { evolve, pathOr, omit, isEmpty, where, isNil, complement } from 'ramda';
import { fetchQuery } from 'relay-runtime';
import debounce from 'lodash.debounce';

import { log, fromRelayError } from 'utils';
import { Page } from 'components/App';
import {
  CreateWizardMutation,
  UpdateWizardMutation,
  CreateStoreMutation,
  UpdateStoreMutation,
  UpdateStoreMainMutation,
} from 'relay/mutations';

import WizardHeader from './WizardHeader';
import WizardFooter from './WizardFooter';
import Step1 from './Step1/Form';
import Step2 from './Step2/Form';
import Step3 from './Step3/View';

import './Wizard.scss';

type PropsType = {};

type StateType = {};

class WizardWrapper extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const storeId = pathOr(null, ['me', 'wizardStore', 'storeId'], props);
    const stepOne = pathOr(null, ['me', 'wizardStore', 'stepOne'], props);
    const stepTwo = pathOr(null, ['me', 'wizardStore', 'stepTwo'], props);
    // const stepThree = pathOr(null, ['me', 'wizardStore', 'stepThree'], props);
    const wizardStore = {
      ...stepOne,
      ...stepTwo,
      defaultLanguage:
        stepTwo && stepTwo.defaultLanguage ? stepTwo.defaultLanguage : 'EN',
      // ...stepThree,
    };
    // console.log('^^^^ constructor wizard state: ', { storeId, wizardStore });
    // defaultLanguage будет 'EN' по умолчанию для нового store
    this.state = {
      step: 1,
      storeId,
      wizardStore,
      formErrors: {},
      isLoading: false,
    };
  }

  componentDidMount() {
    this.createWizard();
  }

  createWizard = () => {
    this.setState(() => ({ isLoading: true }));
    CreateWizardMutation.commit({
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });
        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        this.setState(() => ({ isLoading: false }));
        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        // $FlowIgnoreMe
        const status = pathOr('', ['100', 'status'], relayErrors);
        if (validationErrors && !isEmpty(validationErrors)) {
          this.setState({ formErrors: validationErrors });
        } else if (status) {
          // $FlowIgnoreMe
          alert(`Error: "${status}"`); // eslint-disable-line
        }
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        this.setState(() => ({ isLoading: false }));
        // $FlowIgnoreMe
        const validationErrors = pathOr(null, ['100', 'messages'], relayErrors);
        if (validationErrors) {
          this.setState({ formErrors: validationErrors });
          return;
        }
        // eslint-disable-next-line
        alert('Something going wrong :(');
      },
    });
  };

  updateWizard = data => {
    // console.log('**** updateWizard: ', { fieldName, value });
    this.setState(() => ({ isLoading: true }));
    UpdateWizardMutation.commit({
      // [fieldName]: value,
      ...data,
      defaultLanguage: data.defaultLanguage ? data.defaultLanguage : 'EN',
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });
        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        this.setState(() => ({ isLoading: false }));
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        this.setState(() => ({ isLoading: false }));
        // eslint-disable-next-line
        alert('Something going wrong :(');
      },
    });
  };

  createStore = () => {
    const stepOne = pathOr(null, ['me', 'wizardStore', 'stepOne'], this.props);
    const defaultLanguage = pathOr(
      null,
      ['me', 'wizardStore', 'stepTwo', 'defaultLanguage'],
      this.props,
    );
    const userId = pathOr(null, ['me', 'rawId'], this.props);
    const preparedData = evolve(
      {
        name: n => [{ lang: 'EN', text: n }],
        shortDescription: d => [{ lang: 'EN', text: d }],
      },
      {
        ...stepOne,
        defaultLanguage,
        userId,
      },
    );
    // console.log('**** create store prepared obj: ', { preparedData });
    CreateStoreMutation.commit({
      ...preparedData,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });
        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        // console.log('**** create store responce: ', response);
        this.updateWizard({ storeId: response.createStore.rawId });
        this.setState(() => ({ isLoading: false }));
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        this.setState(() => ({ isLoading: false }));
        // eslint-disable-next-line
        alert('Something going wrong :(');
      },
    });
  };

  fetchStoreByRawId = (storeId: number) => {
    const { environment } = this.context;
    if (!storeId || !environment) {
      log.debug('** storeId or environment does not exist');
      return null;
    }
    const query = graphql`
      query Wizard_me_Query($id: Int!) {
        store(id: $id) {
          id
        }
      }
    `;
    const variables = {
      id: storeId,
    };
    // return promise
    return fetchQuery(environment, query, variables);
  };

  updateStore = () => {
    const { step, storeId, wizardStore } = this.state;
    console.log('*** updateStore: ', { step, storeId, wizardStore });
    if (!storeId) {
      return;
    }
    this.fetchStoreByRawId(storeId).then(response => {
      const stID = pathOr(null, ['store', 'id'], response);
      if (!stID) {
        return;
      }
      const preparedData = evolve(
        {
          name: n => [{ lang: 'EN', text: n }],
          shortDescription: d => [{ lang: 'EN', text: d }],
        },
        {
          id: stID,
          address: wizardStore.addressFull.value,
          ...omit(['addressFull'], wizardStore),
          ...omit(['value'], wizardStore.addressFull),
        },
      );
      console.log('**** update store with wizard state: ', { preparedData });
      const updater =
        step === 1 ? UpdateStoreMainMutation : UpdateStoreMutation;
      updater.commit({
        ...preparedData,
        environment: this.context.environment,
        onCompleted: (response: ?Object, errors: ?Array<any>) => {
          log.debug({ response, errors });
          const relayErrors = fromRelayError({ source: { errors } });
          log.debug({ relayErrors });
          this.setState(() => ({ isLoading: false }));
        },
        onError: (error: Error) => {
          log.debug({ error });
          const relayErrors = fromRelayError(error);
          log.debug({ relayErrors });
          this.setState(() => ({ isLoading: false }));
          // eslint-disable-next-line
          alert('Something going wrong :(');
        },
      });
    });
  };

  handleOnChangeStep = (step: number) => {
    this.setState({ step });
  };

  handleOnSaveStep = (changedStep: number) => {
    const { step, storeId } = this.state;
    switch (step) {
      case 1:
        this.handleOnChangeStep(changedStep);
        if (storeId) {
          this.updateStore();
          break;
        }
        this.createStore();
        break;
      case 2:
        this.handleOnChangeStep(changedStep);
        this.updateStore();
        break;
      case 3:
        this.updateStore();
        break;
      default:
        break;
    }
  };

  // delay for block tonns of query
  handleOnSaveWizard = debounce(data => {
    if (data) {
      this.updateWizard(data);
    }
  }, 250);

  // Update State
  handleChangeWizardState = (data, callback) => {
    this.setState(oldState => ({
        wizardStore: {
          ...oldState.wizardStore,
          ...data,
        },
      }),
      () => {
        if (callback) {
          callback();
        }
      },
    );
  }

  handleChangeForm = data => {
    this.handleChangeWizardState(data);
    this.handleOnSaveWizard(data);
  }

  // handleChangeForm = data => {
  //   // const callback = () => {
  //   //   this.handleOnSaveWizard(data);
  //   // }
  //   // this.handleChangeState(data, callback);


  //   // this.setState(
  //   //   {
  //   //     wizardStore: {
  //   //       ...wizardStore,
  //   //       ...data,
  //   //     },
  //   //   },
  //   //   // () => {
  //   //   //   // console.log('**** on change form data, wizardStore: ', { data, wizardStore })
  //   //   //   this.handleOnSaveWizard(data);
  //   //   // },
  //   // );

  // };

  handleOnSaveProduct = data => {
    console.log('^^^^ Wizrd handle on save PRODUCT: ', data);
  };

  renderForm = () => {
    const { step, wizardStore } = this.state;
    // console.log('^^^^ render props: ', this.props);
    switch (step) {
      case 1:
        return (
          <div styleName="formWrapper firstForm">
            <div styleName="headerTitle">Give your store a name</div>
            <div styleName="headerDescription">
              Make a bright name for your store to attend your customers and
              encrease your sales
            </div>
            <Step1 data={wizardStore} onChange={this.handleChangeForm} />
          </div>
        );
      case 2:
        return (
          <div styleName="formWrapper secondForm">
            <div styleName="headerTitle">Set up store</div>
            <div styleName="headerDescription">
              Define a few settings that will make your sells effective and
              comfortable.
            </div>
            <Step2
              data={wizardStore}
              languages={this.props.languages}
              onChange={this.handleChangeForm}
            />
          </div>
        );
      case 3:
        return (
          <div styleName="formWrapper thirdForm">
            <div styleName="headerTitle">Fill your store with goods</div>
            <div styleName="headerDescription">
              Choose what you gonna sale in your marketplace and add it with
              ease
            </div>
            <Step3
              data={wizardStore}
              // languages={this.props.languages}
              products={products}
              onSave={this.handleOnSaveProduct}
              // onUpload={() => {}}
              // onSave={this.handleOnSaveWizard}
            />
          </div>
        );
      default:
        break;
    }
    return null;
  };

  render() {
    const { step } = this.state;
    const stepOne = pathOr(null, ['me', 'wizardStore', 'stepOne'], this.props);
    const stepTwo = pathOr(null, ['me', 'wizardStore', 'stepTwo'], this.props);
    const isNotNil = complement(isNil);
    const stepOnePopulated = where({
      name: isNotNil,
      slug: isNotNil,
      shortDescription: isNotNil,
    });
    const steptTwoPopulated = where({
      defaultLanguage: isNotNil,
    });
    const isReadyToNext = () => {
      if (!stepOne || !stepTwo) {
        return false;
      }
      if (stepOnePopulated(stepOne) && steptTwoPopulated(stepTwo)) {
        return true;
      }
      return false;
    };
    // console.log('$$$$ WIZARD RENDER props ', this.props.me)
    return (
      <div styleName="wizardContainer">
        <div styleName="stepperWrapper">
          <WizardHeader
            currentStep={step}
            onChangeStep={this.handleOnChangeStep}
          />
        </div>
        <div styleName="contentWrapper">{this.renderForm()}</div>
        <div styleName="footerWrapper">
          <WizardFooter
            currentStep={step}
            onChangeStep={this.handleOnChangeStep}
            onSaveStep={this.handleOnSaveStep}
            isReadyToNext={isReadyToNext()}
          />
        </div>
      </div>
    );
  }
}

WizardWrapper.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default createFragmentContainer(
  Page(WizardWrapper),
  graphql`
    fragment Wizard_me on User {
      id
      rawId
      isActive
      wizardStore {
        id
        rawId
        storeId
        stepOne {
          name
          slug
          shortDescription
        }
        stepTwo {
          defaultLanguage
          addressFull {
            country
            value
            administrativeAreaLevel1
            administrativeAreaLevel2
            locality
            political
            postalCode
            route
            streetNumber
          }
        }
        stepThree {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `,
);

const products = [
  {
    node: {
      name: [
        {
          text: 'A Set Of "Labyrinth"',
        },
      ],
    },
  },
  {
    node: {
      name: [
        {
          text: 'Oak end cutting board',
        },
      ],
    },
  },
  {
    node: {
      name: [
        {
          text: 'American walnut end cutting board',
        },
      ],
    },
  },
  {
    node: {
      name: [
        {
          text: 'Oak tray',
        },
      ],
    },
  },
];
