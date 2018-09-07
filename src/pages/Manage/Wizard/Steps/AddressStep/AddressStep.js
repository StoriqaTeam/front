// @flow strict

import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { assoc, omit, where, complement, isEmpty, isNil, both } from 'ramda';

import { FormComponent } from 'components/Forms/lib';
import { Select } from 'components/common/Select';
import { AddressForm } from 'components/AddressAutocomplete';

import type { FormHandlersType, FormValidatorType } from 'components/Forms/lib';
import type { AddressFullType } from 'components/AddressAutocomplete/AddressForm';

import FormWrapper from '../../FormWrapper';
import WizardFooter from '../../WizardFooter';
import { updateStoreAddressMutation } from './mutations/AddressStepUpdateStoreAddressMutation';

import type { AddressStep_store as AddressStepStore } from './__generated__/AddressStep_store.graphql';

import './AddressStep.scss';

type FormInputs = {
  address: AddressFullType,
  lang: ?{ id: string, label: string },
};

type PropsType = {
  store: AddressStepStore,
};

type HandlersType = FormHandlersType<FormInputs>;

type ValidatorsType = FormValidatorType<FormInputs>;

class AddressStep extends FormComponent<FormInputs, PropsType> {
  static getDerivedStateFromProps = (props: PropsType) => {
    if (!props.store) {
      return {};
    }

    return {
      form: {
        address: props.store.addressFull,
      },
      validationErrors: {},
    };
  };

  state = {
    form: {
      address: {
        value: '',
        country: '',
        administrativeAreaLevel1: '',
        administrativeAreaLevel2: '',
        locality: '',
        political: '',
        postalCode: '',
        route: '',
        streetNumber: '',
        placeId: '',
      },
      lang: { id: 'EN', label: 'English' },
    },
    validationErrors: {},
    isSubmitting: false,
  };

  handlers: HandlersType = {
    address: assoc('address'),
    lang: assoc('lang'),
  };

  validators: ValidatorsType = {
    address: [
      [
        where({
          country: both(complement(isEmpty), complement(isNil)),
          locality: both(complement(isEmpty), complement(isNil)),
          route: both(complement(isEmpty), complement(isNil)),
          streetNumber: both(complement(isEmpty), complement(isNil)),
          postalCode: both(complement(isEmpty), complement(isNil)),
        }),
        'Please fill all required fields.',
      ],
    ],
  };

  handle(input: $Keys<FormInputs>, value: $Values<FormInputs>): void {
    if (this.state.isSubmitting) {
      return;
    }

    const handler = this.handlers[input](value);
    this.setState({
      form: handler(this.state.form),
      validationErrors: omit([input], this.state.validationErrors),
    });
  }

  runMutations = () =>
    updateStoreAddressMutation({
      environment: this.props.relay.environment,
      variables: {
        input: {
          clientMutationId: `${this.mutationId}`,
          id: this.props.store && this.props.store.id,
          addressFull: this.state.form.address,
        },
      },
    });

  render() {
    const isFormValid = isEmpty(this.validate());
    return (
      <React.Fragment>
        <div styleName="contentWrapper">
          <FormWrapper
            secondForm
            title="Set up store"
            description="Define a few settings that will make your sells effective and comfortable."
          >
            <div styleName="form">
              <div styleName="formItem">
                <Select
                  forForm
                  fullWidth
                  label="Main language"
                  activeItem={{ id: 'EN', label: 'English' }}
                  items={[{ id: 'EN', label: 'English' }]}
                  onSelect={value => {
                    this.handle('lang', value);
                  }}
                  dataTest="wizardLanguagesSelect"
                />
              </div>
              <div styleName="formItem addressForm">
                <AddressForm
                  isOpen
                  onChangeData={value => {
                    this.handle('address', value);
                  }}
                  address={this.state.form.address.value}
                  addressFull={this.state.form.address}
                  country={this.state.form.address.country}
                />
              </div>
            </div>
          </FormWrapper>
        </div>
        <div styleName="footerWrapper">
          <WizardFooter
            step={2}
            onClick={this.submit}
            loading={this.state.isSubmitting}
            disabled={!isFormValid}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default createFragmentContainer(
  AddressStep,
  graphql`
    fragment AddressStep_store on Store {
      id
      addressFull {
        value
        country
        administrativeAreaLevel1
        administrativeAreaLevel2
        locality
        political
        postalCode
        route
        streetNumber
        placeId
      }
    }
  `,
);
