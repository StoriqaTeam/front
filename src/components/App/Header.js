// @flow

import React, { Component } from 'react';
import { graphql } from 'react-relay';
import PropTypes from 'prop-types';
import { Link } from 'found';
// $FlowIgnoreMe
import {
  pipe,
  pathOr,
  path,
  map,
  prop,
  sum,
  chain,
  reject,
  isNil,
} from 'ramda';

import { SearchInput } from 'components/SearchInput';
import { UserDropdown } from 'components/UserDropdown';
import { CartButton } from 'components/CartButton';
import { Button } from 'components/common/Button';
import { Select } from 'components/common/Select';
import { Icon } from 'components/Icon';

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
};

class Header extends Component<PropsType, StateType> {
  state = {
    cartCount: 0,
  };

  componentWillMount() {
    const store = this.context.environment.getStore();
    const source = store.getSource().toJSON();
    const meId = path(['client:root', 'me', '__ref'])(source);
    if (!meId) return;
    const connectionId = `client:${meId}:cart:__Cart_stores_connection`;
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

  dispose: () => void;

  render() {
    const { user, searchValue } = this.props;
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
                <div styleName="profileIcon">
                  <UserDropdown user={user} />
                </div>
                <div styleName="cartIcon">
                  <CartButton href="/cart" amount={this.state.cartCount} />
                </div>
                <div styleName="buttonWrapper">
                  <Button
                    href={
                      process.env.REACT_APP_HOST
                        ? `${process.env.REACT_APP_HOST}/manage/store/new`
                        : '/'
                    }
                    dataTest="headerStartSellingButton"
                  >
                    Start selling
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </header>
    );
  }
}

export default Header;

Header.contextTypes = {
  environment: PropTypes.object.isRequired,
};
