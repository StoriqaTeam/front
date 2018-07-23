// @flow

import React, { Component } from 'react';
import { graphql } from 'react-relay';
import { pathOr } from 'ramda';
import classNames from 'classnames';
import type { Environment } from 'relay-runtime';

import { AppContext } from 'components/App';
import { Authorization } from 'components/Authorization';
import { Icon } from 'components/Icon';
import { MobileListItems } from 'components/MobileListItems';
import { MobileMenu } from 'components/MobileMenu';
import { Modal } from 'components/Modal';
import { SearchInput } from 'components/SearchInput';
import { CategoriesMenu } from 'components/CategoriesMenu';

import { Container } from 'layout';

import { setWindowTag } from 'utils';
import type { DirectoriesType, UserDataType, MobileCategoryType } from 'types';

import { HeaderBottom, HeaderTop, MobileSearchMenu } from './index';

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

type PropsType = {
  searchValue: string,
  environment: Environment,
  withoutCategories: ?boolean,
};

type StateType = {
  totalCount: number,
  showModal: boolean,
  isSignUp: ?boolean,
  userData: ?UserDataType,
  isMenuToggled: boolean,
  isMobileSearchOpen: boolean,
  isMobileCategoriesOpen: boolean,
  selectedCategory: ?MobileCategoryType,
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

  updateStateUserData = (data: ?UserDataType): void => {
    this.setState({ userData: data });
  };

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

  closeMobileCategories = (): void => {
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

  handleMobileCategories = (selectedCategory: MobileCategoryType): void => {
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
    const { searchValue, withoutCategories } = this.props;
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
              expanded: isMobileCategoriesOpen,
              withoutCategories,
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
              <HeaderBottom
                userData={userData}
                searchCategories={searchCategories}
                searchValue={searchValue}
                totalCount={totalCount}
                onMobileSearch={this.handleMobileSearch}
                onOpenModal={this.handleOpenModal}
              />
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
