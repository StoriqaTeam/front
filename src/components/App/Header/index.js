// @flow

import React, { Component } from 'react';
import { pathOr, isNil, map } from 'ramda';
import classNames from 'classnames';

import {
  AppContext,
  HeaderBottom,
  HeaderTop,
  MobileSearchMenu,
} from 'components/App';
import { Authorization } from 'components/Authorization';
import { Icon } from 'components/Icon';
import { MobileListItems } from 'components/MobileListItems';
import { MobileMenu } from 'components/MobileMenu';
import { Modal } from 'components/Modal';
import { SearchInput } from 'components/SearchInput';
import { CategoriesMenu } from 'components/CategoriesMenu';
import { withShowAlert } from 'components/App/AlertContext';

import { Container } from 'layout';

import type { DirectoriesType, UserDataType, MobileCategoryType } from 'types';
import type { AddAlertInputType } from 'components/App/AlertContext';

import { getCookie } from 'utils/cookiesOp';

import { COOKIE_NAME } from 'constants';

import t from './i18n';

import './Header.scss';

type PropsType = {
  searchValue: string,
  withoutCategories: ?boolean,
  setLang: (lang: string) => void,
  totalCount: number,
  userData: ?UserDataType,
  isShopCreated: boolean,
  showAlert: AddAlertInputType => void,
};

type StateType = {
  showModal: boolean,
  isSignUp: ?boolean,
  isMenuToggled: boolean,
  isMobileSearchOpen: boolean,
  isMobileCategoriesOpen: boolean,
  selectedCategory: ?MobileCategoryType,
};

class Header extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      showModal: false,
      isSignUp: false,
      isMenuToggled: false,
      isMobileSearchOpen: false,
      isMobileCategoriesOpen: false,
      selectedCategory: null,
    };
  }

  componentDidMount() {
    const { showAlert } = this.props;
    const cookie = getCookie(COOKIE_NAME);
    if (isNil(cookie)) {
      showAlert({
        type: 'success',
        text: t.cookiePolicy,
        link: { text: 'OK' },
        isStatic: true,
        longText: true,
      });
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
    const {
      searchValue,
      withoutCategories,
      userData,
      totalCount,
      isShopCreated,
      setLang,
    } = this.props;
    const {
      showModal,
      isSignUp,
      selectedCategory,
      isMenuToggled,
      isMobileSearchOpen,
      isMobileCategoriesOpen,
    } = this.state;
    const searchCategories = [
      { id: 'products', label: t.searchCategory_products },
      { id: 'stores', label: t.searchCategory_shops },
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
          <Icon type="burgerMenu" size={24} />
        </span>
      </div>
    );
    return (
      <AppContext.Consumer>
        {({ directories, environment, handleLogin }) => (
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
              <HeaderTop
                userData={userData}
                currencies={map(
                  // $FlowIgnoreMe
                  item => `${item}`,
                  directories.currencies || [],
                )}
                isShopCreated={isShopCreated}
                setLang={setLang}
              />
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
            <Modal
              showModal={showModal}
              onClose={this.handleCloseModal}
              render={() => (
                <Authorization
                  environment={environment}
                  handleLogin={handleLogin}
                  isSignUp={isSignUp}
                  onCloseModal={this.handleCloseModal}
                />
              )}
            />
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

export default withShowAlert(Header);
