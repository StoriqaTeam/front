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

import { Authorization } from 'components/Authorization';
import { CartButton } from 'components/CartButton';
import { Icon } from 'components/Icon';
import { MobileMenu } from 'components/MobileMenu';
import { Modal } from 'components/Modal';
import { SearchInput } from 'components/SearchInput';
import { UserDropdown } from 'components/UserDropdown';

import { Container, Row, Col } from 'layout';

import { setWindowTag } from 'utils';

import { HeaderTop, AuthButtons, MobileSearchMenu } from './index';

import type HeaderStoresLocalFragment from './__generated__/HeaderStoresLocalFragment.graphql';

import './HeaderResponsive.scss';

const STORES_FRAGMENT = graphql`
  fragment HeaderResponsiveStoresLocalFragment on CartStoresConnection {
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
  fragment HeaderResponsive_me on User {
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
  isMenuToggled: boolean,
  isMobileSearchOpen: boolean,
};

class HeaderResponsive extends Component<PropsType, StateType> {
  state = {
    cartCount: 0,
    showModal: false,
    isSignUp: false,
    userData: null,
    isMenuToggled: false,
    isMobileSearchOpen: false,
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

  handleMobileMenu = (): void => {
    this.setState(({ isMenuToggled }) => ({
      isMenuToggled: !isMenuToggled,
    }));
  };

  handleMobileSearch = (): void => {
    this.setState(({ isMobileSearchOpen }) => ({
      isMobileSearchOpen: !isMobileSearchOpen,
    }));
  };

  handleDropDown = (): void => {
    // console.log('this.props!!!', this.props);
    console.log('sisa');
  };
  render() {
    const { searchValue } = this.props;
    const {
      showModal,
      isSignUp,
      userData,
      isMenuToggled,
      isMobileSearchOpen,
    } = this.state;
    const searchCategories = [
      { id: 'products', label: 'Products' },
      { id: 'stores', label: 'Shops' },
    ];
    const BurgerMenu = () => (
      <div
        onClick={this.handleMobileMenu}
        onKeyPress={() => {}}
        role="button"
        styleName="burgerMenu"
        tabIndex="-1"
      >
        <span role="img">
          <Icon type="burgerMenu" size={28} />
        </span>
      </div>
    );
    return (
      <header styleName="container">
        <MobileSearchMenu
          isOpen={isMobileSearchOpen}
          searchCategories={searchCategories}
          searchValue={searchValue}
          onClick={this.handleMobileSearch}
        >
          <SearchInput
            isMobile
            onDropDown={this.handleDropDown}
            searchCategories={searchCategories}
            searchValue={searchValue}
          />
        </MobileSearchMenu>
        <MobileMenu isOpen={isMenuToggled} onClose={this.handleMobileMenu} />
        <Container>
          <BurgerMenu />
          <HeaderTop />
          <div styleName="headerBottom">
            <Row>
              <Col size={7} sm={4} md={4} lg={3} xl={3}>
                <div styleName="logo">
                  <div styleName="logoIcon">
                    <Link to="/" data-test="logoLink">
                      <Icon type="logo" />
                    </Link>
                  </div>
                </div>
              </Col>
              <Col size={1} sm={5} md={3} lg={6} xl={6}>
                <div styleName="searchBar">
                  <SearchInput
                    searchCategories={searchCategories}
                    searchValue={searchValue}
                  />
                </div>
              </Col>
              <Col size={4} sm={3} md={5} lg={3} xl={3}>
                <div styleName="userData">
                  <div
                    onClick={this.handleMobileSearch}
                    onKeyPress={() => {}}
                    role="button"
                    styleName="searchIcon"
                    tabIndex="-1"
                  >
                    <Icon type="magnifier" />
                  </div>
                  {userData ? (
                    <UserDropdown user={userData} />
                  ) : (
                    <AuthButtons onOpenModal={this.handleOpenModal} />
                  )}
                  <div styleName="cartIcon">
                    <CartButton href="/cart" amount={this.state.cartCount} />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
        <Modal showModal={showModal} onClose={this.handleCloseModal}>
          <Authorization
            isSignUp={isSignUp}
            onCloseModal={this.handleCloseModal}
          />
        </Modal>
      </header>
    );
  }
}

export default HeaderResponsive;

HeaderResponsive.contextTypes = {
  environment: PropTypes.object.isRequired,
};
