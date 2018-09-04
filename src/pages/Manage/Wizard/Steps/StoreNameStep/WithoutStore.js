// @flow strict

import { createFragmentContainer, graphql } from 'react-relay';
import { reject, isEmpty } from 'ramda';
import debounce from 'lodash.debounce';

import { withShowAlert } from 'components/App/AlertContext';
import { log } from 'utils';

import CommonForm from './CommonForm';

import { updateWizardMutation } from './mutations/StoreNameStepUpdateWizardMutation';

import type { WithoutStore_me as MeWithoutStore } from './__generated__/WithoutStore_me.graphql';
import type { CommonFormFormInputs } from './CommonForm';

type PropsType = {
  me: ?MeWithoutStore,
};

class WithoutStore extends CommonForm<PropsType> {
  constructor(props) {
    super(props);
    this.updateWizard = debounce(this.updateWizard, 500);
  }

  static getDerivedStateFromProps = (props: PropsType) => {
    const wizardStore = props.me && props.me.wizardStore;
    if (!wizardStore) {
      return {};
    }
    return {
      form: {
        name: wizardStore.name || '',
        slug: wizardStore.slug || '',
        desc: wizardStore.shortDescription || '',
      },
      validationErrors: {},
    };
  };

  updateWizard = () => {
    updateWizardMutation({
      environment: this.props.relay.environment,
      variables: {
        input: {
          ...reject(isEmpty, {
            name: this.state.form.name,
            slug: this.state.form.slug,
            shortDescription: this.state.form.desc,
          }),
          clientMutationId: '',
          addressFull: {},
        },
      },
    });
  };

  handle(
    input: $Keys<CommonFormFormInputs>,
    value: $Values<CommonFormFormInputs>,
  ): void {
    super.handle(input, value);
    this.updateWizard();
  }

  runMutations = (): Promise<*> => {
    //
  };
}

export default createFragmentContainer(
  withShowAlert(WithoutStore),
  graphql`
    fragment WithoutStore_me on User {
      wizardStore {
        id
        name
        slug
        shortDescription
      }
    }
  `,
);
