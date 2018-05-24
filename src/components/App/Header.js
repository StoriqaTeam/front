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

import { SearchInput } from 'components/SearchInput';
import { UserDropdown } from 'components/UserDropdown';
import { CartButton } from 'components/CartButton';
import { Select } from 'components/common/Select';
import { Icon } from 'components/Icon';
import { Modal } from 'components/Modal';
import { Authorization } from 'components/Authorization';

import { Container, Row, Col } from 'layout';

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
  user: ?{},
  searchValue: string,
};

type StateType = {
  cartCount: number,
  showModal: boolean,
  isSignUp: ?boolean,
};

class Header extends Component<PropsType, StateType> {
  state = {
    cartCount: 0,
    showModal: false,
    isSignUp: false,
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
    });
    this.dispose = dispose;
    this.setState({ cartCount: getCartCount(snapshot.data) });
  }

  componentWillUnmount() {
    if (this.dispose) {
      this.dispose();
    }
  }

  onOpenModal = (isSignUp: ?boolean) => {
    this.setState({
      showModal: true,
      isSignUp,
    });
  };

  onCloseModal = () => {
    this.setState({ showModal: false });
  };

  dispose: () => void;

  render() {
    const { user, searchValue } = this.props;
    const { showModal, isSignUp } = this.state;
    return (
      <header styleName="container">
        <Container>
          <Row>
            <Col size={12}>
              <div styleName="top">
                <div styleName="item">
                  <Select
                    activeItem={{ id: '1', label: 'BTC' }}
                    items={[
                      { id: '1', label: 'BTC' },
                      { id: '2', label: 'ETH' },
                      { id: '3', label: 'STQ' },
                      { id: '4', label: 'ADA' },
                      { id: '5', label: 'NEM' },
                      { id: '6', label: 'NEO' },
                      { id: '7', label: 'NEM' },
                      { id: '8', label: 'WAX' },
                      { id: '9', label: 'PPT' },
                      { id: '10', label: 'SUB' },
                      { id: '11', label: 'STRAT' },
                      { id: '12', label: 'WTC' },
                      { id: '13', label: 'EOS' },
                      { id: '14', label: 'LTC' },
                      { id: '15', label: 'LSK' },
                      { id: '16', label: 'NXT' },
                    ]}
                    onSelect={() => {}}
                    dataTest="headerСurrenciesSelect"
                  />
                </div>
                <div styleName="item">
                  <Select
                    activeItem={{ id: '1', label: 'ENG' }}
                    items={[
                      { id: '1', label: 'ENG' },
                      { id: '2', label: 'CHN' },
                      { id: '3', label: 'RUS' },
                    ]}
                    onSelect={() => {}}
                    dataTest="headerLanguagesSelect"
                  />
                </div>
                <div>
                  <a href="_">Help</a> {/* eslint-disable-line */}
                </div>
                <div>
                  <a href="/manage/store/new">Sell on Storiqa</a>
                </div>
              </div>
              <div styleName="bottom">
                <Link to="/" data-test="logoLink">
                  <Icon type="logo" />
                </Link>
                <div styleName="searchInput">
                  <SearchInput
                    searchCategories={[
                      { id: 'products', label: 'Products' },
                      { id: 'stores', label: 'Shops' },
                    ]}
                    searchValue={searchValue}
                  />
                </div>
                <div>
                  {user ? (
                    <UserDropdown user={user} />
                  ) : (
                    <div styleName="authButtons">
                      <div
                        styleName="signUpButton"
                        onClick={() => {
                          this.onOpenModal(true);
                        }}
                        onKeyDown={() => {}}
                        role="button"
                        tabIndex="0"
                      >
                        Sign Up
                      </div>
                      <div
                        styleName="signInButton"
                        onClick={() => {
                          this.onOpenModal(false);
                        }}
                        onKeyDown={() => {}}
                        role="button"
                        tabIndex="0"
                      >
                        <strong>Sign In</strong>
                      </div>
                    </div>
                  )}
                </div>
                <div styleName="cartIcon">
                  <CartButton href="/cart" amount={this.state.cartCount} />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <Modal showModal={showModal} onClose={this.onCloseModal}>
          <Authorization isSignUp={isSignUp} />
        </Modal>
      </header>
    );
  }
}

export default Header;

Header.contextTypes = {
  environment: PropTypes.object.isRequired,
};
