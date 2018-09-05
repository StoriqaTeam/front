// @flow strict

import { createFragmentContainer, graphql } from 'react-relay';
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
          name: this.state.form.name,
          slug: this.state.form.slug,
          shortDescription: this.state.form.desc,
          clientMutationId: `${this.mutationId}`,
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

    // if you send empty slug you will get server validation error
    if (input === 'slug' && value === '') {
      return;
    }

    this.updateWizard();
  }

  transformValidationErrors(serverErrors: {
    [string]: Array<string>,
  }): { [$Keys<CommonFormFormInputs>]: Array<string> } {
    log.debug('transform without store', {
      ...super.transformValidationErrors(serverErrors),
      name: serverErrors.store,
    });
    return {
      ...super.transformValidationErrors(serverErrors),
      name: serverErrors.store,
    };
  }

  runMutations = (): Promise<*> => {
    const { me } = this.props;
    const wizardStore = me && me.wizardStore;
    if (!me || !wizardStore) {
      return Promise.resolve({});
    }

    this.mutationId = this.mutationId + 1;
    return createStoreMutation({
      environment: this.props.relay.environment,
      variables: {
        input: {
          clientMutationId: `${this.mutationId}`,
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
    }).then(resp =>
      updateWizardMutation({
        environment: this.props.relay.environment,
        variables: {
          input: {
            clientMutationId: `${this.mutationId}`,
            storeId: resp.createStore.rawId,
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
