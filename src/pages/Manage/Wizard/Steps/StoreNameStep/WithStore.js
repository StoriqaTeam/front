// @flow strict

import { createFragmentContainer, graphql } from 'react-relay';

import { withShowAlert } from 'components/App/AlertContext';
import { updateStoreMutation } from './mutations/StoreNameStepUpdateStoreMutation';

import CommonForm from './CommonForm';

import type { WithStore_me as MeWithStore } from './__generated__/WithStore_me.graphql';

type PropsType = {
  me: ?MeWithStore, // eslint-disable-line
};

class WithStore extends CommonForm<PropsType> {
  static getDerivedStateFromProps = (props: PropsType) => {
    const store =
      props.me && props.me.wizardStore && props.me.wizardStore.store;
    if (!store) {
      return {};
    }

    return {
      form: {
        name: WithStore.utils.getTextFromTranslation(store.name),
        slug: store.slug,
        desc: WithStore.utils.getTextFromTranslation(store.shortDescription),
      },
      validationErrors: {},
    };
  };

  runMutations = (): Promise<*> => {
    const storeId =
      this.props.me &&
      this.props.me.wizardStore &&
      this.props.me.wizardStore.store &&
      this.props.me.wizardStore.store.id;

    if (!storeId) {
      return Promise.reject(new Error('No storeId provided'));
    }

    return updateStoreMutation({
      environment: this.props.relay.environment,
      variables: {
        input: {
          clientMutationId: '',
          id: storeId,
          addressFull: {},
          slug: this.state.form.slug,
          shortDescription: [{ lang: 'EN', text: this.state.form.desc }],
          name: [{ lang: 'EN', text: this.state.form.name }],
        },
      },
    });
  };
}

export default createFragmentContainer(
  withShowAlert(WithStore),
  graphql`
    fragment WithStore_me on User {
      wizardStore {
        id
        store {
          id
          name {
            lang
            text
          }
          slug
          shortDescription {
            lang
            text
          }
        }
      }
    }
  `,
);
