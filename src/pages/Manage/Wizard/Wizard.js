// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { pick, evolve, pathOr, omit, where, complement } from 'ramda';
import debounce from 'lodash.debounce';

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
  constructor(props: PropsType) {
    super(props);
    console.log('>>> constructor');
    this.state = {
      step: 1,
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
        console.log('^^^ updateWizard response, errors: ', {
          response,
          errors,
        });
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
        ...pick(
          ['name', 'shortDescription', 'defaultLanguage', 'slug'],
          wizardStore,
        ),
        ...omit(['value'], wizardStore.addressFull),
      },
    );
    console.log('<<< prepareStoreMutationInput: ', { preparedData });
    return preparedData;
  };

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
    const updater = step === 1 ? UpdateStoreMainMutation : UpdateStoreMutation;
    updater.commit({
      ...preparedData,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        console.log('^^^ updateStore updateStore mutation response: ', {
          response,
          errors,
        });
        this.setState(() => ({ isLoading: false }));
        resposeLogger(response, errors);
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
        errorsLogger(error);
      },
    });
  };

  handleOnChangeStep = (step: number) => {
    console.log('>>> handleOnChangeStep: ', { step });
    this.setState({ step });
  };

  handleOnSaveStep = (changedStep: number) => {
    console.log('>>> handleOnSaveStep: ', { changedStep });
    const { step } = this.state;
    const storeId = pathOr(null, ['me', 'wizardStore', 'storeId'], this.props);
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
    console.log('>>> handleOnSaveWizard: ', { data });
    if (data) {
      this.updateWizard({
        ...omit(
          ['id', 'rawId', 'stepOne', 'stepTwo', 'stepThree', 'store'],
          data,
        ),
      });
    }
  }, 250);

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
    this.handleOnSaveWizard(data);
  };

  handleOnSaveProduct = data => {
    console.log('>>> handleOnSaveProduct: ', { data });
  };

  renderForm = () => {
    console.log('>>> renderForm');
    const { step } = this.state;
    const wizardStore = pathOr(null, ['me', 'wizardStore'], this.props);
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
              initialData={wizardStore}
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
              products={products}
              onSave={this.handleOnSaveProduct}
            />
          </div>
        );
      default:
        break;
    }
    return null;
  };

  render() {
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

const products = {
  edges: [
    {
      node: {
        name: [
          {
            text: 'A Set Of "Labyrinth"',
            lang: 'EN',
          },
        ],
        currencyId: 1,
        rating: 1,
        rawId: 1,
        storeId: 1,
        products: {
          edges: [
            {
              node: {
                cashback: null,
                discount: 0.5,
                id: 'c3RvcmVzfHByb2R1Y3R8Njcx1',
                photoMain:
                  'https://s3.amazonaws.com/storiqa-dev/img-4IALAADXr0QC.png',
                price: 100,
                rawId: 671,
              },
            },
          ],
        },
      },
    },
    {
      node: {
        name: [
          {
            text: 'A Set Of "Labyrinth"',
            lang: 'EN',
          },
        ],
        currencyId: 2,
        rating: 3,
        rawId: 4,
        storeId: 1,
        products: {
          edges: [
            {
              node: {
                cashback: null,
                discount: 0.5,
                id: 'c3RvcmVzfHByb2R1Y3R8Njcx2',
                photoMain:
                  'https://s3.amazonaws.com/storiqa-dev/img-4IALAADXr0QC.png',
                price: 200,
                rawId: 672,
              },
            },
          ],
        },
      },
    },
    {
      node: {
        name: [
          {
            text: 'A Set Of "Labyrinth"',
            lang: 'EN',
          },
        ],
        currencyId: 3,
        rating: 3,
        rawId: 3,
        storeId: 1,
        products: {
          edges: [
            {
              node: {
                cashback: null,
                discount: 0.5,
                id: 'c3RvcmVzfHByb2R1Y3R8Njcx3',
                photoMain:
                  'https://s3.amazonaws.com/storiqa-dev/img-4IALAADXr0QC.png',
                price: 300,
                rawId: 673,
              },
            },
          ],
        },
      },
    },
    {
      node: {
        name: [
          {
            text: 'A Set Of "Labyrinth"',
            lang: 'EN',
          },
        ],
        currencyId: 4,
        rating: 4,
        rawId: 4,
        storeId: 1,
        products: {
          edges: [
            {
              node: {
                cashback: null,
                discount: 0.5,
                id: 'c3RvcmVzfHByb2R1Y3R8Njcx4',
                photoMain:
                  'https://s3.amazonaws.com/storiqa-dev/img-4IALAADXr0QC.png',
                price: 400,
                rawId: 674,
              },
            },
          ],
        },
      },
    },
  ],
};
