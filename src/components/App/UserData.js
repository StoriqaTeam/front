// @flow

import { Component } from 'react';
import { graphql } from 'react-relay';
import { pathOr } from 'ramda';
import type { Environment } from 'relay-runtime';

import { setWindowTag } from 'utils';
import type { UserDataType } from 'types';

const TOTAL_FRAGMENT = graphql`
  fragment UserDataTotalLocalFragment on Cart {
    id
    totalCount
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

type PropsType = {
  environment: Environment,
  children: any,
};

type StateType = {
  totalCount: number,
  userData: ?UserDataType,
  isShopCreated: boolean,
};

class UserData extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      totalCount: 0,
      userData: null,
      isShopCreated: false,
    };
    const store = props.environment.getStore();
    const cartId = pathOr(
      null,
      ['cart', '__ref'],
      store.getSource().get('client:root'),
    );
    const queryNode = TOTAL_FRAGMENT.data();
    const snapshot = store.lookup({
      dataID: cartId,
      node: queryNode,
    });
    const { dispose } = store.subscribe(snapshot, s => {
      const newTotalCount = pathOr(0, ['data', 'totalCount'], s);
      this.updateStateTotalCount(newTotalCount);
      // tmp code
      setWindowTag('cartCount', newTotalCount);
      // end tmp code
    });
    const totalCount = pathOr(0, ['data', 'totalCount'], snapshot);

    this.dispose = dispose;
    // $FlowIgnoreMe
    this.state.totalCount = totalCount;
    // tmp code
    setWindowTag('cartCount', totalCount);
    // end tmp code

    const meId = pathOr(
      null,
      ['me', '__ref'],
      store.getSource().get('client:root'),
    );
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
      const { dispose: disposeUser } = store.subscribe(snapshotUser, s => {
        this.updateStateUserData(s.data);
        // tmp code
        setWindowTag('user', s.data);
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

  updateStateTotalCount = (totalCount: number): void => {
    this.setState({ totalCount });
  };

  checkIfStoreCreated = (userData: ?UserDataType): boolean =>
    // $FlowIgnoreMe
    pathOr(false, ['wizardStore', 'completed'], userData);

  updateStateUserData = (userData: ?UserDataType): void => {
    this.setState({ userData });
  };

  dispose: () => void;

  disposeUser: () => void;

  render() {
    const { userData, totalCount, isShopCreated } = this.state;
    return this.props.children({
      userData,
      totalCount,
      isShopCreated,
    });
  }
}

export default UserData;
