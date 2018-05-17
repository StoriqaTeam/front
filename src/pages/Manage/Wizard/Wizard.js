// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr, isEmpty, where, isNil, complement } from 'ramda';
import debounce from 'lodash.debounce';

import { log, fromRelayError } from 'utils';
import { Page } from 'components/App';
import { CreateWizardMutation, UpdateWizardMutation, CreateStoreMutation } from 'relay/mutations';

import WizardHeader from './WizardHeader';
import WizardFooter from './WizardFooter';
import FirstForm from './FirstForm';
import SecondForm from './SecondForm';

import './Wizard.scss';

type PropsType = {};

type StateType = {};

class WizardWrapper extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const stepOne = pathOr(null, ['me', 'wizardStore', 'stepOne'], props);
    const stepTwo = pathOr(null, ['me', 'wizardStore', 'stepTwo'], props);
    const stepThree = pathOr(null, ['me', 'wizardStore', 'stepThree'], props);
    // console.log('^^^^ constructor props: ', {
    //   props,
    //   stepOne,
    //   stepTwo,
    //   stepThree,
    // });
    // defaultLanguage будет 'EN' по умолчанию для нового store
    this.state = {
      step: 1,
      wizardStore: {
        ...stepOne,
        ...stepTwo,
        defaultLanguage:
          stepTwo && stepTwo.defaultLanguage ? stepTwo.defaultLanguage : 'EN',
        ...stepThree,
      },
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
    const stepTwo = pathOr(null, ['me', 'wizardStore', 'stepTwo'], this.props);
    console.log('**** create store props: ', { stepOne, stepTwo });
    // CreateStoreMutation.commit({
    //   // [fieldName]: value,
    //   ...data,
    //   environment: this.context.environment,
    //   onCompleted: (response: ?Object, errors: ?Array<any>) => {
    //     log.debug({ response, errors });
    //     const relayErrors = fromRelayError({ source: { errors } });
    //     log.debug({ relayErrors });
    //     this.setState(() => ({ isLoading: false }));
    //   },
    //   onError: (error: Error) => {
    //     log.debug({ error });
    //     const relayErrors = fromRelayError(error);
    //     log.debug({ relayErrors });
    //     this.setState(() => ({ isLoading: false }));
    //     // eslint-disable-next-line
    //     alert('Something going wrong :(');
    //   },
    // });
  }

  updateStore = () => {
    console.log('**** update store');
  }

  handleOnChangeStep = (step: number) => {
    this.setState({ step });
  };

  handleOnSaveStep = (changedStep: number) => {
    const { step } = this.state;
    switch (step) {
      case 1:
        this.handleOnChangeStep(changedStep);
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
  }

  // handleChangeForm = (fieldName, value) => {
  //   const { wizardStore } = this.state;
  //   this.setState({
  //     wizardStore: {
  //       ...wizardStore,
  //       [fieldName]: value,
  //     },
  //   });
  // };

  handleChangeForm = data => {
    const { wizardStore } = this.state;
    this.setState({
      wizardStore: {
        ...wizardStore,
        ...data,
      },
    }, this.handleOnSaveWizard(data));
  };

  handleOnSaveWizard = debounce(data => {
    if (data) {
      this.updateWizard(data);
    }
  }, 1000);

  renderForm = () => {
    const { step, wizardStore } = this.state;
    // console.log('^^^^ render props: ', this.props);
    switch (step) {
      case 1:
        return (
          <div>
            <div styleName="headerTitle">Give your store a name</div>
            <div styleName="headerDescription">
              Make a bright name for your store to attend your customers and
              encrease your sales
            </div>
            <FirstForm
              data={wizardStore}
              onChange={this.handleChangeForm}
              onSave={this.handleOnSaveWizard}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <div styleName="headerTitle">Set up store</div>
            <div styleName="headerDescription">
              Define a few settings that will make your sells effective and
              comfortable.
            </div>
            <SecondForm
              data={wizardStore}
              languages={this.props.languages}
              onChange={this.handleChangeForm}
              onSave={this.handleOnSaveWizard}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <div styleName="headerTitle">Fill your store with goods</div>
            <div styleName="headerDescription">
              Choose what you gonna sale in your marketplace and add it with
              ease
            </div>
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
    }
    // console.log('$$$$ WIZARD RENDER props ', this.props.me)
    return (
      <div styleName="wizardContainer">
        <div styleName="stepperWrapper">
          <WizardHeader currentStep={step} onChangeStep={this.handleOnChangeStep} />
        </div>
        <div styleName="contentWrapper">
          <div styleName="formWrapper">{this.renderForm()}</div>
        </div>
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
