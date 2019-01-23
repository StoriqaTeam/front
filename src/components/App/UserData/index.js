// @flow strict

import { Component } from 'react';
import { graphql } from 'react-relay';
import { pathOr } from 'ramda';
import type { Environment } from 'relay-runtime';

import { setWindowTag } from 'utils';
import type { Node } from 'react';

import type UserDataType from './__generated__/UserData_me.graphql';

const TOTAL_FRAGMENT = graphql`
  fragment UserDataTotalLocalFragment on Cart {
    id
    totalCountAll
  }
`;

const HEADER_FRAGMENT = graphql`
  fragment UserData_me on User {
    email
    firstName
    lastName
    avatar
    wizardStore {
      completed
    }
    myStore {
      rawId
    }
  }
`;

type StoreType = { getSource: () => { get: (val: string) => {} } };

type SnapshotType = {
  data: {
    totalCountAll: number,
  },
};

type StateType = {
  totalCountAll: number,
  userData: ?UserDataType,
  isShopCreated: boolean,
};

type PropsType = {
  environment: Environment,
  children: StateType => Node,
};

class UserData extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      totalCountAll: 0,
      userData: null,
      isShopCreated: false,
    };
    const store = props.environment.getStore();
    const getStoreData = this.storeData(store);
    const cartId = getStoreData('cart');
    const queryNode = TOTAL_FRAGMENT.data();
    const snapshot = store.lookup({
      dataID: cartId,
      node: queryNode,
    });
    const { dispose } = store.subscribe(snapshot, snap => {
      const newTotalCount = this.getTotalCount(snap);
      this.setTotalCount(newTotalCount);
      // tmp code
      setWindowTag('cartCount', newTotalCount);
      // end tmp code
    });
    const totalCountAll = this.getTotalCount(snapshot);
    this.dispose = dispose;
    this.state.totalCountAll = totalCountAll;
    // tmp code
    setWindowTag('cartCount', totalCountAll);
    // end tmp code
    const meId = getStoreData('me');
    if (!meId) {
      // tmp code
      setWindowTag('user', null);
      // end tmp code
    }
    if (meId) {
      const queryUser = HEADER_FRAGMENT.me();
      const snapshotUser = store.lookup({
        dataID: meId,
        node: queryUser,
      });
      const { dispose: disposeUser } = store.subscribe(snapshotUser, snap => {
        this.setUserData(snap.data);
        // tmp code
        setWindowTag('user', snap.data);
        // end tmp code
      });
      this.disposeUser = disposeUser;
      this.state.userData = snapshotUser.data;
      this.state.isShopCreated = this.checkIfStoreCreated(snapshotUser.data);
      // tmp code
      setWindowTag('user', snapshotUser.data);
      // end tmp code
    }
  }

  componentWillUnmount() {
    if (this.dispose) {
      this.dispose();
    }
    if (this.disposeUser) {
      this.disposeUser();
    }
  }

  getTotalCount = (snapshot: SnapshotType): number =>
    // $FlowIgnoreMe
    pathOr(0, ['data', 'totalCountAll'], snapshot);

  setTotalCount = (totalCountAll: number): void => {
    this.setState({ totalCountAll });
  };

  setUserData = (userData: ?UserDataType): void => {
    this.setState({ userData });
  };

  checkIfStoreCreated = (userData: ?UserDataType): boolean =>
    // $FlowIgnoreMe
    pathOr(false, ['wizardStore', 'completed'], userData);

  storeData = (store: StoreType) => (prop: string) =>
    pathOr(null, [prop, '__ref'], store.getSource().get('client:root'));

  dispose: () => void;

  disposeUser: () => void;

  render() {
    const { userData, totalCountAll, isShopCreated } = this.state;
    return this.props.children({
      userData,
      totalCountAll,
      isShopCreated,
    });
  }
}

export default UserData;
