// @flow

import React, { Component } from 'react';
import { graphql } from 'react-relay';
import { Link } from 'found';
import { pathOr } from 'ramda';
import classNames from 'classnames';
import type { Environment } from 'relay-runtime';

import { AppContext } from 'components/App';
import { Authorization } from 'components/Authorization';
import { CartButton } from 'components/CartButton';
import { Icon } from 'components/Icon';
import { MobileListItems } from 'components/MobileListItems';
import { MobileMenu } from 'components/MobileMenu';
import { Modal } from 'components/Modal';
import { SearchInput } from 'components/SearchInput';
import { UserDropdown } from 'components/UserDropdown';
import { CategoriesMenu } from 'components/CategoriesMenu';

import { Container, Row, Col } from 'layout';

import { setWindowTag } from 'utils';
import type { DirectoriesType } from 'types';

import { HeaderTop, AuthButtons, MobileSearchMenu } from './index';

import './HeaderResponsive.scss';

const TOTAL_FRAGMENT = graphql`
  fragment HeaderResponsiveTotalLocalFragment on Cart {
    id
    totalCount
  }
`;

const HEADER_FRAGMENT = graphql`
  fragment HeaderResponsive_me on User {
    email
    firstName
    lastName
    avatar
    myStore {
      rawId
    }
  }
`;

type MobileCategory = {
  label: string,
  id: string,
};

type PropsType = {
  searchValue: string,
  environment: Environment,
  withoutCategories: ?boolean,
};

type StateType = {
  totalCount: number,
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
  isMobileCategoriesOpen: boolean,
  selectedCategory: ?MobileCategory,
};

class HeaderResponsive extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      totalCount: 0,
      showModal: false,
      isSignUp: false,
      userData: null,
      isMenuToggled: false,
      isMobileSearchOpen: false,
      isMobileCategoriesOpen: false,
      selectedCategory: null,
    };
    const store = this.props.environment.getStore();
    if (process.env.BROWSER) {
      window.store = store;
    }
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
      this.state.totalCount = newTotalCount;
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
        this.state.userData = s.data;
        // tmp code
        setWindowTag('user', s.data);
        // end tmp code
      });
      this.disposeUser = disposeUser;
      this.state.userData = snapshotUser.data;
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

  closeMobileCategories = () => {
    this.setState(({ isMobileCategoriesOpen }) => ({
      isMobileCategoriesOpen: !isMobileCategoriesOpen,
    }));
  };

  handleMobileMenu = (): void => {
    this.setState(({ isMenuToggled }) => ({
      isMenuToggled: !isMenuToggled,
    }));
  };

  handleMobileSearch = (): void => {
    this.setState(({ isMobileSearchOpen }) => ({
      isMobileSearchOpen: !isMobileSearchOpen,
      isMobileCategoriesOpen: false,
    }));
  };

  handleDropDown = (): void => {
    this.closeMobileCategories();
  };

  handleMobileCategories = (selectedCategory: MobileCategory) => {
    this.setState(
      {
        selectedCategory,
      },
      () => {
        this.closeMobileCategories();
      },
    );
  };

  makeCategories = (directories: DirectoriesType) =>
    // $FlowIgnore
    pathOr(null, ['categories', 'children'], directories);

  render() {
    const { searchValue, withoutCategories, environment } = this.props;
    const {
      showModal,
      isSignUp,
      userData,
      isMenuToggled,
      isMobileSearchOpen,
      isMobileCategoriesOpen,
      selectedCategory,
      totalCount,
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
      <AppContext.Consumer>
        {({ directories }) => (
          <header
            styleName={classNames('container', {
              expand: isMobileCategoriesOpen,
            })}
          >
            <MobileSearchMenu
              isOpen={isMobileSearchOpen}
              searchCategories={searchCategories}
              searchValue={searchValue}
              onClick={this.handleMobileSearch}
            >
              <SearchInput
                isMobile
                selectedCategory={selectedCategory}
                onDropDown={this.handleDropDown}
                searchCategories={searchCategories}
                searchValue={searchValue}
              />
            </MobileSearchMenu>
            <MobileMenu
              isOpen={isMenuToggled}
              onClose={this.handleMobileMenu}
            />
            <Container>
              <BurgerMenu />
              <HeaderTop user={userData} />
              <div styleName="headerBottom">
                <Row>
                  <Col size={7} sm={4} md={4} lg={3} xl={3}>
                    <div
                      styleName={classNames('logo', {
                        isUserLoggedIn: userData,
                      })}
                    >
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
                        <CartButton href="/cart" amount={totalCount} />
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              {this.makeCategories(directories) &&
                !withoutCategories && (
                  <CategoriesMenu
                    categories={this.makeCategories(directories)}
                  />
                )}
            </Container>
            <Modal showModal={showModal} onClose={this.handleCloseModal}>
              <Authorization
                isSignUp={isSignUp}
                onCloseModal={this.handleCloseModal}
              />
            </Modal>
            {isMobileCategoriesOpen ? (
              <MobileListItems
                onClick={this.handleMobileCategories}
                items={searchCategories}
              />
            ) : null}
          </header>
        )}
      </AppContext.Consumer>
    );
  }
}

export default HeaderResponsive;
