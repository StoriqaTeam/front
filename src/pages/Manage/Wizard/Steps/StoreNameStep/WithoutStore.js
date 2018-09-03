// @flow strict

import { createFragmentContainer, graphql } from 'react-relay';
import { reject, isEmpty } from 'ramda';

import { withShowAlert } from 'components/App/AlertContext';

import CommonForm from './CommonForm';

import { createWizardMutation } from './mutations/StoreNameStepCreateWizardMutation';
import { updateWizardMutation } from './mutations/StoreNameStepUpdateWizardMutation';

import type { WithoutStore_me as MeWithoutStore } from './__generated__/WithoutStore_me.graphql';

type PropsType = {
  me: ?MeWithoutStore, // eslint-disable-line
};

class WithoutStore extends CommonForm<PropsType> {
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

  runMutations = (): Promise<*> => {
    const wizardStoreId =
      this.props.me &&
      this.props.me.wizardStore &&
      this.props.me.wizardStore.id;

    const initialMutation = !wizardStoreId
      ? createWizardMutation({
          environment: this.props.relay.environment,
          variables: {},
        })
      : Promise.resolve({});

    return initialMutation.then(() =>
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
      }),
    );
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
