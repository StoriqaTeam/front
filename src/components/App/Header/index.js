// @flow

import React, { Component } from 'react';
import { pathOr, isNil, map, isEmpty, assocPath } from 'ramda';
import classNames from 'classnames';
import { withRouter, routerShape, matchShape } from 'found';

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
import { withShowAlert } from 'components/Alerts/AlertContext';
import { urlToInput, inputToUrl } from 'utils';
import { Container } from 'layout';

import type {
  DirectoriesType,
  UserDataType,
  MobileCategoryType,
  SelectItemType,
} from 'types';
import type { AddAlertInputType } from 'components/Alerts/AlertContext';

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
  router: routerShape,
  match: matchShape,
};

type StateType = {
  showModal: boolean,
  isSignUp: ?boolean,
  isMenuToggled: boolean,
  isMobileSearchOpen: boolean,
  isMobileCategoriesOpen: boolean,
  selectedCategory: ?MobileCategoryType,
  searchValue: string,
  searchItems: Array<SelectItemType>,
};

const searchCategories = [
  { id: 'products', label: t.searchCategory_products },
  { id: 'stores', label: t.searchCategory_shops },
];

class Header extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const pathname = pathOr('', ['location', 'pathname'], this.props.match);
    const value = pathname.replace('/', '');

    this.state = {
      showModal: false,
      isSignUp: false,
      isMenuToggled: false,
      isMobileSearchOpen: false,
      isMobileCategoriesOpen: false,
      selectedCategory:
        value === 'stores' ? searchCategories[1] : searchCategories[0],
      searchItems: [],
      searchValue: props.searchValue,
    };
    this.searchInputsRef = React.createRef();
  }

  componentDidMount() {
    if (process.env.BROWSER) {
      document.addEventListener('click', this.handleClick);
    }

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

  componentDidUpdate(prevProps: PropsType) {
    // $FlowIgnoreMe
    const searchValue = pathOr(
      '',
      ['match', 'location', 'query', 'search'],
      prevProps,
    );
    // $FlowIgnoreMe
    const newSearchValue = pathOr(
      '',
      ['match', 'location', 'query', 'search'],
      this.props,
    );
    if (newSearchValue !== searchValue) {
      this.updateSearchValue(newSearchValue);
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      document.removeEventListener('click', this.handleClick);
    }
  }

  updateSearchValue = (searchValue: string) => {
    this.setState({ searchValue });
  };

  searchInputsRef = undefined;

  handleClick = (e: any) => {
    if (
      this.searchInputsRef &&
      this.searchInputsRef.current &&
      !this.searchInputsRef.current.contains(e.target)
    ) {
      this.setState({
        searchItems: [],
      });
    }
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
        searchItems: [],
      },
      () => {
        this.closeMobileCategories();
      },
    );
  };

  makeCategories = (directories: DirectoriesType) =>
    // $FlowIgnore
    pathOr(null, ['categories', 'children'], directories);

  handleGetSearchItems = (searchItems: Array<SelectItemType>) => {
    this.setState({ searchItems });
  };

  handleClickSearchItem = (searchItem: SelectItemType) => {
    const { selectedCategory } = this.state;

    // $FlowIgnoreMe
    const pathname = pathOr(
      '',
      ['match', 'location', 'pathname'],
      this.props,
    ).replace('/', '');
    // $FlowIgnoreMe
    const queryObj = pathOr('', ['match', 'location', 'query'], this.props);
    const oldPreparedObj = urlToInput(queryObj);

    const newPreparedObj = assocPath(
      ['name'],
      searchItem.label,
      oldPreparedObj,
    );
    const newUrl = inputToUrl(newPreparedObj);
    this.setState({
      searchItems: [],
      searchValue: searchItem.label,
    });
    switch (selectedCategory && selectedCategory.id) {
      case 'stores':
        if (pathname === 'stores') {
          this.props.router.push(`/stores${newUrl}`);
        } else {
          this.props.router.push(
            searchItem.label
              ? `/stores?search=${searchItem.label}`
              : '/stores?search=',
          );
        }
        break;
      case 'products':
        if (pathname === 'categories') {
          this.props.router.push(`/categories${newUrl}`);
        } else {
          this.props.router.push(
            searchItem.label
              ? `/categories?search=${searchItem.label}`
              : '/categories?search=',
          );
        }
        break;
      default:
        break;
    }
  };

  render() {
    const {
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
      searchItems,
      searchValue,
    } = this.state;
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
            <Container>
              <BurgerMenu />
              <HeaderTop
                userData={userData}
                cryptoCurrencies={directories.cryptoCurrencies}
                fiatCurrencies={directories.fiatCurrencies}
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
                getSearchItems={this.handleGetSearchItems}
              />
            </MobileSearchMenu>
            <MobileMenu
              isOpen={isMenuToggled}
              onClose={this.handleMobileMenu}
            />
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
            {!isEmpty(searchItems) &&
              !isMobileCategoriesOpen && (
                <div ref={this.searchInputsRef} styleName="searchItems">
                  {map(
                    item => (
                      <div
                        key={item.id}
                        styleName="searchItem"
                        onClick={() => {
                          this.handleClickSearchItem(item);
                        }}
                        onKeyDown={() => {}}
                        role="button"
                        tabIndex="0"
                      >
                        {item.label}
                      </div>
                    ),
                    searchItems,
                  )}
                </div>
              )}
          </header>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withRouter(withShowAlert(Header));
