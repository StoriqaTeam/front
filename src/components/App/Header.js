// @flow

import React, { Component } from 'react';
import { graphql } from 'react-relay';
import PropTypes from 'prop-types';
import { Link } from 'found';
import {
  pipe,
  pathOr,
  map,
  prop,
  sum,
  // $FlowIgnoreMe
  chain,
  reject,
  isNil,
} from 'ramda';
import MediaQuery from 'react-responsive';

import { SearchInput } from 'components/SearchInput';
import { UserDropdown } from 'components/UserDropdown';
import { CartButton } from 'components/CartButton';
import { Select } from 'components/common/Select';
import { Icon } from 'components/Icon';
import { Modal } from 'components/Modal';
import { Authorization } from 'components/Authorization';
import { setWindowTag } from 'utils';
import { MD } from 'utils/responsive';

import { Container, Row, Col } from 'layout';

import { HeaderTop, AuthButtons } from './index';

import type HeaderStoresLocalFragment from './__generated__/HeaderStoresLocalFragment.graphql';
import './Header.scss';

const STORES_FRAGMENT = graphql`
  fragment HeaderStoresLocalFragment on CartStoresConnection {
    edges {
      node {
        id
        products {
          id
          quantity
        }
      }
    }
  }
`;

const HEADER_FRAGMENT = graphql`
  fragment Header_me on User {
    email
    firstName
    lastName
    avatar
  }
`;

const getCartCount: (data: HeaderStoresLocalFragment) => number = data =>
  pipe(
    pathOr([], ['edges']),
    chain(pathOr([], ['node', 'products'])),
    reject(isNil),
    map(prop('quantity')),
    reject(isNil),
    sum,
  )(data);

type PropsType = {
  searchValue: string,
};

type StateType = {
  cartCount: number,
  showModal: boolean,
  isSignUp: ?boolean,
  userData: ?{
    avatar: ?string,
    email: ?string,
    firstName: ?string,
    lastName: ?string,
  },
};

class Header extends Component<PropsType, StateType> {
  state = {
    cartCount: 0,
    showModal: false,
    isSignUp: false,
    userData: null,
  };

  componentWillMount() {
    const store = this.context.environment.getStore();
    const connectionId = 'client:root:cart:__Cart_stores_connection';
    const queryNode = STORES_FRAGMENT.data();
    const snapshot = store.lookup({
      dataID: connectionId,
      node: queryNode,
    });
    const { dispose } = store.subscribe(snapshot, s => {
      this.setState({ cartCount: getCartCount(s.data) });
      // tmp code
      setWindowTag('cartCount', getCartCount(s.data));
      // end tmp code
    });
    this.dispose = dispose;
    this.setState({ cartCount: getCartCount(snapshot.data) });
    // tmp code
    setWindowTag('cartCount', getCartCount(snapshot.data));
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
        this.setState({ userData: s.data });
        // tmp code
        setWindowTag('user', s.data);
        // end tmp code
      });
      this.disposeUser = disposeUser;
      this.setState({ userData: snapshotUser.data });
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

  handleOpenModal = (isSignUp: ?boolean): void => {
    this.setState({
      showModal: true,
      isSignUp,
    });
  };

  handleCloseModal = (): void => {
    this.setState({ showModal: false });
  };

  dispose: () => void;
  disposeUser: () => void;

  render() {
    const { searchValue } = this.props;
    const { showModal, isSignUp, userData } = this.state;
    return (
      <header styleName="container">
        <Container>
          <Row>
            <Col size={12}>
              <HeaderTop />
              <div styleName="bottom">
                <Link to="/" data-test="logoLink">
                  <Icon type="logo" />
                </Link>
                <MediaQuery minWidth={MD}>
                  <div styleName="searchInput">
                    <SearchInput
                      searchCategories={[
                        { id: 'products', label: 'Products' },
                        { id: 'stores', label: 'Shops' },
                      ]}
                      searchValue={searchValue}
                    />
                  </div>
                </MediaQuery>
                <div>
                  {userData ? (
                    <UserDropdown user={userData} />
                  ) : (
                    <AuthButtons
                      onOpenModal={this.handleOpenModal}
                    />
                  )}
                </div>
                <div styleName="cartIcon">
                  <CartButton href="/cart" amount={this.state.cartCount} />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <Modal
          showModal={showModal}
          onClose={this.handleCloseModal}
        >
          <Authorization
            isSignUp={isSignUp}
            onCloseModal={this.handleCloseModal}
          />
        </Modal>
      </header>
    );
  }
}

export default Header;

Header.contextTypes = {
  environment: PropTypes.object.isRequired,
};
