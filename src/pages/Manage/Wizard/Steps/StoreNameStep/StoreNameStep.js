// @flow strict

import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import WithStore from './WithStore';
import WithoutStore from './WithoutStore';

import type { StoreNameStep_me as StoreNameStepMe } from './__generated__/StoreNameStep_me.graphql';

type PropsType = {
  me: ?StoreNameStepMe,
};

const StoreNameStep = (props: PropsType) => {
  const storeId =
    props.me &&
    props.me.wizardStore &&
    props.me.wizardStore.store &&
    props.me.wizardStore.store.id;

  return storeId ? <WithStore me={props.me} /> : <WithoutStore me={props.me} />;
};

export default createFragmentContainer(
  StoreNameStep,
  graphql`
    fragment StoreNameStep_me on User {
      ...WithoutStore_me
      ...WithStore_me
      wizardStore {
        id
        store {
          id
        }
      }
    }
  `,
);
