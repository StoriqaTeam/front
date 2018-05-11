// @flow

import React from 'react';
// import { pathOr, keys, map, addIndex } from 'ramda';

import { Page } from 'components/App';

import WizardHeader from './WizardHeader';
import WizardFooter from './WizardFooter';
import FirstForm from './FirstForm';

import './Wizard.scss';

type PropsType = {
};

type StateType = {};

class WizardWrapper extends React.Component<PropsType, StateType> {

  constructor(props: PropsType) {
    super(props);
    this.state = {
      step: 1,
      storeData: {
        userId: 1,
        storeId: 1,
        name: 'some name',
        shortDescription: 'some description',
        defaultLanguage: 'default language',
        slug: 'some slug',
        country: 'some country',
        address: 'some address',
      }
    };
  }

  handleChangeStep = (step: number) => {
    this.setState({ step });
  };

  handleChangeForm = (value, fieldName) => {
    this.setState({
      storeData: {
        ...this.state.storeData,
        [fieldName]: value,
      },
    })
  }

  handleOnSaveWizard = fieldName => {
    const { storeData } = this.state;
    console.log('**** handleOnSaveWizard: ', { value: storeData[fieldName] , fieldName });
  };

  renderForm = () => {
    const { step, storeData } = this.state;
    switch (step) {
      case 1:
        return (
          <div>
            <div styleName="headerTitle">Give your store a name</div>
            <div styleName="headerDescription">Make a bright name for your store to attend your customers and encrease your sales</div>
            <FirstForm data={storeData} onChange={this.handleChangeForm} onSave={this.handleOnSaveWizard} />
          </div>
        );
      case 2:
        return (
          <div>
            <div styleName="headerTitle">Set up store</div>
            <div styleName="headerDescription">Define a few settings that will make your sells effective and comfortable.</div>
          </div>
        );
      case 3:
        return (
          <div>
            <div styleName="headerTitle">Fill your store with goods</div>
            <div styleName="headerDescription">Choose what you gonna sale in your marketplace and add it with ease</div>
          </div>
        );
      default:
        break;
    }
    return null;
  }

  render() {
    const { step, storeData } = this.state;

    console.log('**** Wizard props: ', this.props);

    return (
      <div styleName="wizardContainer">
        <div styleName="stepperWrapper">
          <WizardHeader currentStep={step} onChange={this.handleChangeStep} />
        </div>
        <div styleName="contentWrapper">
          <div styleName="formWrapper">
            {this.renderForm()}
          </div>
        </div>
        <div styleName="footerWrapper">
          <WizardFooter
            step={step}
            onChange={this.handleChangeStep}
            onSave={this.handleOnSave}
          />
        </div>
      </div>
    );
  }
}

export default Page(WizardWrapper);
