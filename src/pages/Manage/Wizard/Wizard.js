// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { pick, evolve, pathOr, omit, where, isNil, complement } from 'ramda';
import { fetchQuery } from 'relay-runtime';
import debounce from 'lodash.debounce';

import { log } from 'utils';
import { Page } from 'components/App';
import {
  CreateWizardMutation,
  UpdateWizardMutation,
  CreateStoreMutation,
  UpdateStoreMutation,
  UpdateStoreMainMutation,
} from 'relay/mutations';

import { resposeLogger, errorsLogger } from './utils';
import WizardHeader from './WizardHeader';
import WizardFooter from './WizardFooter';
import Step1 from './Step1/Form';
import Step2 from './Step2/Form';
import Step3 from './Step3/View';

import './Wizard.scss';

type PropsType = {};

type StateType = {};

class WizardWrapper extends React.Component<PropsType, StateType> {
  // static prepareWizardState(props) {
  //   console.log('>>> prepareWizardState: ', { props });
  //   const storeId = pathOr(null, ['me', 'wizardStore', 'storeId'], props);
  //   const stepOne = pathOr(null, ['me', 'wizardStore', 'stepOne'], props);
  //   const stepTwo = pathOr(null, ['me', 'wizardStore', 'stepTwo'], props);
  //   const result = {
  //     storeId,
  //     ...stepOne,
  //     ...stepTwo,
  //     defaultLanguage:
  //       stepTwo && stepTwo.defaultLanguage ? stepTwo.defaultLanguage : 'EN',
  //   };
  //   console.log('<<< prepareWizardState: ', { result });
  //   return result;
  // }

  // static getDerivedStateFromProps = (nextProps, prevState) => {
  //   console.log('>>> getDerivedStateFromProps: ', { nextProps, prevState });
  //   const nextWizardStore = WizardWrapper.prepareWizardState(nextProps);
  //   // console.log('***** getDerivedStateFromProps next wizard store: ', nextWizardStore)
  //   const resultState = {
  //     ...prevState,
  //     wizardStore: {
  //       ...prevState.wizardStore,
  //       ...nextWizardStore,
  //     },
  //   };
  //   console.log('<<< getDerivedStateFromProps: ', { resultState });
  //   return resultState;
  // };

  constructor(props: PropsType) {
    super(props);
    console.log('>>> constructor');
    // const wizardStore = this.constructor.prepareWizardState(props);
    // defaultLanguage будет 'EN' по умолчанию для нового store
    this.state = {
      step: 1,
      // wizardStore,
      // formErrors: {},
      // isLoading: false,
    };
  }

  componentDidMount() {
    console.log('>>> componentDidMount');
    this.createWizard();
  }

  createWizard = () => {
    console.log('>>> createWizard');
    this.setState(() => ({ isLoading: true }));
    CreateWizardMutation.commit({
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState(() => ({ isLoading: false }));
        resposeLogger(response, errors);
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
        errorsLogger(error);
      },
    });
  };

  updateWizard = data => {
    console.log('>>> updateWizard data: ', { data });
    this.setState(() => ({ isLoading: true }));
    UpdateWizardMutation.commit({
      ...data,
      defaultLanguage: data.defaultLanguage ? data.defaultLanguage : 'EN',
      addressFull: data.addressFull ? data.addressFull : {},
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState(() => ({ isLoading: false }));
        resposeLogger(response, errors);
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
        errorsLogger(error);
      },
    });
  };

  prepareStoreMutationInput = () => {
    console.log('>>> prepareStoreMutationInput: ');
    const wizardStore = pathOr(null, ['me', 'wizardStore'], this.props);
    const id = pathOr(null, ['me', 'wizardStore', 'store', 'id'], this.props);
    const userId = pathOr(null, ['me', 'rawId'], this.props);
    const preparedData = evolve(
      {
        name: text => [{ lang: 'EN', text }],
        shortDescription: text => [{ lang: 'EN', text }],
      },
      {
        id,
        userId,
        address: wizardStore.addressFull.value,
        ...pick(['name', 'shortDescription', 'defaultLanguage', 'slug'], wizardStore),
        ...omit(['value'], wizardStore.addressFull),
      },
    );
    console.log('<<< prepareStoreMutationInput: ', { preparedData });
    return preparedData;
  }

  createStore = () => {
    console.log('>>> createStore');
    const preparedData = this.prepareStoreMutationInput();
    CreateStoreMutation.commit({
      ...preparedData,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        console.log('^^^ createStore response: ', { response, errors });
        this.updateWizard({ storeId: response.createStore.rawId });
        this.setState(() => ({ isLoading: false }));
        resposeLogger(response, errors);
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
        errorsLogger(error);
      },
    });
  };

  updateStore = () => {
    console.log('>>> updateStore');
    const { step } = this.state;
    const wizardStore = pathOr(null, ['me', 'wizardStore'], this.props);
    const preparedData = this.prepareStoreMutationInput();
    if (!preparedData.id) {
      return;
    }
    // const storeID = pathOr(null, ['store', 'id'], wizardStore);
    // if (!storeID) {
    //   return;
    // }

  // id: string,
  // name: string,
  // longDescription: string,
  // shortDescription: string,
  // defaultLanguage: string,
  // slug: string,
  // slogan: string,
  // logo?: string,

    const updater =
      step === 1 ? UpdateStoreMainMutation : UpdateStoreMutation;
    updater.commit({
      ...preparedData,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        console.log('^^^ updateStore updateStore mutation response: ', {
          response,
          errors,
        });
        // const responseData = response.createStore
        //   ? response.createStore
        //   : response.updateStore;
        // this.updateWizard({ storeId: responseData.rawId });
        this.setState(() => ({ isLoading: false }));
        resposeLogger(response, errors);
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
        errorsLogger(error);
      },
    });

  };

  // fetchStoreByRawId = (storeId: number) => {
  //   console.log('>>> fetchStoreByRawId: ', { storeId });
  //   const { environment } = this.context;
  //   if (!storeId || !environment) {
  //     log.debug('storeId or environment does not exist');
  //     return null;
  //   }
  //   const query = graphql`
  //     query Wizard_me_Query($id: Int!) {
  //       store(id: $id) {
  //         id
  //       }
  //     }
  //   `;
  //   const variables = {
  //     id: storeId,
  //   };
  //   // return promise
  //   const result = fetchQuery(environment, query, variables);
  //   console.log('<<< fetchStoreByRawId: ', { result });
  //   return result;
  // };

  // updateStore = () => {
  //   console.log('>>> updateStore');
  //   const { step } = this.state;
  //   const wizardStore = pathOr(null, ['me', 'wizardStore'], this.props);
  //   // console.log('*** updateStore: ', { step, wizardStore });
  //   if (!wizardStore.storeId) {
  //     return;
  //   }
  //   this.fetchStoreByRawId(wizardStore.storeId).then(res => {
  //     const stID = pathOr(null, ['store', 'id'], res);
  //     if (!stID) {
  //       return;
  //     }
  //     const preparedData = WizardWrapper.prepareStoreMutationInput(
  //       this.props,
  //       stID,
  //     );
  //     const updater =
  //       step === 1 ? UpdateStoreMainMutation : UpdateStoreMutation;
  //     updater.commit({
  //       ...preparedData,
  //       environment: this.context.environment,
  //       onCompleted: (response: ?Object, errors: ?Array<any>) => {
  //         console.log('^^^ updateStore updateStore mutation response: ', {
  //           response,
  //           errors,
  //         });
  //         // const responseData = response.createStore
  //         //   ? response.createStore
  //         //   : response.updateStore;
  //         // this.updateWizard({ storeId: responseData.rawId });
  //         this.setState(() => ({ isLoading: false }));
  //         resposeLogger(response, errors);
  //       },
  //       onError: (error: Error) => {
  //         this.setState(() => ({ isLoading: false }));
  //         errorsLogger(error);
  //       },
  //     });
  //   });
  // };

  handleOnChangeStep = (step: number) => {
    console.log('>>> handleOnChangeStep: ', { step });
    this.setState({ step });
  };

  handleOnSaveStep = (changedStep: number) => {
    console.log('>>> handleOnSaveStep: ', { changedStep });
    const { step } = this.state;
    // const { wizardStore } = this.props;
    const storeId = pathOr(null, ['me', 'wizardStore', 'storeId'], this.props);
    // console.log('**** handleOnSaveStep wizardStore from props: ', wizardStore);
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
    // const storeId = pathOr(null, ['me', 'wizardStore', 'storeId'], this.props);
    console.log('>>> handleOnSaveWizard: ', { data });
    // const userId = pathOr(null, ['me', 'rawId'], this.props);

    if (data) {
      this.updateWizard({
        ...omit(
          ['id', 'rawId', 'stepOne', 'stepTwo', 'stepThree', 'store'],
          data,
        ),
        // storeId,
      });
    }
  }, 250);

  // Update State
  // handleChangeWizardState = (data, callback) => {
  //   console.log('>>> handleChangeWizardState: ', { data, callback });
  //   this.setState(
  //     oldState => ({
  //       wizardStore: {
  //         ...oldState.wizardStore,
  //         ...data,
  //       },
  //     }),
  //     () => {
  //       if (callback) {
  //         callback();
  //       }
  //     },
  //   );
  // };

  handleChangeForm = data => {
    const storeID = pathOr(
      null,
      ['me', 'wizardStore', 'store', 'id'],
      this.props,
    );
    const storeId = pathOr(
      null,
      ['me', 'wizardStore', 'store', 'rawId'],
      this.props,
    );
    console.log('>>> handleChangeForm: ', { data, storeId, storeID });
    // const preparedDataInput = evolve(transformations, {

    // });
    // this.handleChangeWizardState(data);
    this.handleOnSaveWizard(data);
  };

  handleOnSaveProduct = data => {
    console.log('>>> handleOnSaveProduct: ', { data });
  };

  renderForm = () => {
    console.log('>>> renderForm');
    const { step } = this.state;
    // const { wizardStore } = this.props;
    const wizardStore = pathOr(null, ['me', 'wizardStore'], this.props);

    // const wizardStore = pathOr(null, ['me', 'wizardStore'], this.props);
    switch (step) {
      case 1:
        return (
          <div styleName="formWrapper firstForm">
            <div styleName="headerTitle">Give your store a name</div>
            <div styleName="headerDescription">
              Make a bright name for your store to attend your customers and
              encrease your sales
            </div>
            <Step1 initialData={wizardStore} onChange={this.handleChangeForm} />
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
    // const isReadyToNext = () => {
    //   if (!stepOne || !stepTwo) {
    //     return false;
    //   }
    //   if (stepOnePopulated(stepOne) && steptTwoPopulated(stepTwo)) {
    //     return true;
    //   }
    //   return false;
    // };
    console.log('>>> render');
    const { step } = this.state;
    const wizardStore = pathOr(null, ['me', 'wizardStore'], this.props);
    const isNotEmpty = complement((i: any) => !i);
    const stepOneChecker = where({
      name: isNotEmpty,
      slug: isNotEmpty,
      shortDescription: isNotEmpty,
    });
    const steptTwoChecker = where({
      defaultLanguage: isNotEmpty,
    });
    // console.log('^^^^^^^^^^^^^^^^^^^^^^^^^');
    // console.log('^^^ render wizardStore: ', { wizardStore });
    // console.log('^^^ render step checkers 1: ', { isStepOnePopulated, stepOne });
    // console.log('^^^ render step checkers 2: ', { isStepTwoPopulated, stepTwo });
    // console.log('^^^^^^^^^^^^^^^^^^^^^^^^^');
    const isReadyToNext = () => {
      if (!wizardStore) {
        return false;
      }
      const stepOne = pick(['name', 'shortDescription', 'slug'], wizardStore);
      const isStepOnePopulated = stepOneChecker(stepOne);
      const stepTwo = pick(['defaultLanguage'], wizardStore);
      const isStepTwoPopulated = steptTwoChecker(stepTwo);
      if (step === 1 && isStepOnePopulated) {
        return true;
      }
      if (step === 2 && isStepTwoPopulated) {
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
      wizardStore {
        id
        rawId
        storeId
        name
        slug
        shortDescription
        defaultLanguage
        store {
          id
          rawId
        }
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
