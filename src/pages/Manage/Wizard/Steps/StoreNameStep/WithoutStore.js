// @flow strict

import { createFragmentContainer, graphql } from 'react-relay';
import { reject, isEmpty } from 'ramda';
import debounce from 'lodash.debounce';

import { withShowAlert } from 'components/App/AlertContext';
import { log } from 'utils';

import CommonForm from './CommonForm';

import { updateWizardMutation } from './mutations/StoreNameStepUpdateWizardMutation';
import { createStoreMutation } from './mutations/StoreNameStepCreateStoreMutation';

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
    const wizardStore = this.props.me && this.props.me.wizardStore;
    if (!wizardStore) {
      return;
    }

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
      optimisticResponse: {
        updateWizardStore: {
          id: wizardStore.id,
          name: this.state.form.name,
          shortDescription: this.state.form.desc,
          slug: this.state.form.slug,
          store: null,
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
    const { me } = this.props;
    const wizardStore = me && me.wizardStore;
    if (!me || !wizardStore) {
      return Promise.resolve({});
    }

    return createStoreMutation({
      environment: this.props.relay.environment,
      variables: {
        input: {
          clientMutationId: '',
          name: [
            {
              lang: 'EN',
              text: this.state.form.name,
            },
          ],
          defaultLanguage: 'EN',
          slug: this.state.form.slug,
          shortDescription: [
            {
              lang: 'EN',
              text: this.state.form.desc,
            },
          ],
          addressFull: {},
          userId: me.rawId,
        },
      },
    });
  };
}

export default createFragmentContainer(
  withShowAlert(WithoutStore),
  graphql`
    fragment WithoutStore_me on User {
      rawId
      wizardStore {
        id
        name
        slug
        shortDescription
      }
    }
  `,
);
