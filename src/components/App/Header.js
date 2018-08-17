// @flow

import React, { Component } from 'react';
import { graphql } from 'react-relay';
import PropTypes from 'prop-types';
import { Link } from 'found';
import { find, pathOr, propEq } from 'ramda';

import { SearchInput } from 'components/SearchInput';
import { UserDropdown } from 'components/UserDropdown';
import { CartButton } from 'components/CartButton';
import { Select } from 'components/common/Select';
import { Icon } from 'components/Icon';
import { Modal } from 'components/Modal';
import { Authorization } from 'components/Authorization';
import { setWindowTag } from 'utils';

import { Container, Row, Col } from 'layout';

import './Header.scss';

const languages = [
  {
    id: 'en',
    label: 'ENG',
  },
  {
    id: 'ru',
    label: 'RUS',
  },
  {
    id: 'ja',
    label: 'JAP',
  },
];

const TOTAL_FRAGMENT = graphql`
  fragment HeaderTotalLocalFragment on Cart {
    id
    totalCount
  }
`;

const HEADER_FRAGMENT = graphql`
  fragment Header_me on User {
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
  currentLocale: string,
  changeLocale: (lang: string) => void,
};

type StateType = {
  showModal: boolean,
  isSignUp: ?boolean,
  userData: ?{
    avatar: ?string,
    email: ?string,
    firstName: ?string,
    lastName: ?string,
    myStore: ?{
      rawId: number,
    },
  },
  totalCount: number,
};

class Header extends Component<PropsType, StateType> {
  state = {
    showModal: false,
    isSignUp: false,
    userData: null,
    totalCount: 0,
  };

  componentWillMount() {
    const store = this.context.environment.getStore();
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
      this.setState({ totalCount: newTotalCount });
      // tmp code
      setWindowTag('cartCount', newTotalCount);
      // end tmp code
    });
    const totalCount = pathOr(0, ['data', 'totalCount'], snapshot);

    this.dispose = dispose;
    // $FlowIgnoreMe
    this.setState({ totalCount });
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

  onOpenModal = (isSignUp: ?boolean) => {
    this.setState({
      showModal: true,
      isSignUp,
    });
  };

  onCloseModal = () => {
    this.setState({ showModal: false });
  };

  handleChangeLocale = (item: { id: string, label: string }) => {
    if (item && item.id) {
      this.props.changeLocale(item.id);
    }
  };

  dispose: () => void;
  disposeUser: () => void;

  render() {
    const { searchValue, currentLocale } = this.props;
    const { showModal, isSignUp, userData, totalCount } = this.state;
    const activeLocaleItem = find(propEq('id', currentLocale))(languages);
    return (
      <header styleName="container">
        <Container>
          <Row>
            <Col size={12}>
              <div styleName="top">
                <div styleName="item">
                  <Select
                    activeItem={{ id: '3', label: 'STQ' }}
                    items={[{ id: '3', label: 'STQ' }]}
                    onSelect={() => {}}
                    dataTest="headerСurrenciesSelect"
                  />
                </div>
                <div styleName="item">
                  <Select
                    activeItem={activeLocaleItem}
                    items={languages}
                    onSelect={this.handleChangeLocale}
                    dataTest="headerLanguagesSelect"
                  />
                </div>
                <div>
                  <a href="_">Help</a> {/* eslint-disable-line */}
                </div>
                <div>
                  <a href="/start-selling">Sell on Storiqa</a>
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
                  {userData ? (
                    <UserDropdown user={userData} />
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
                        data-test="headerSignUpButton"
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
                        data-test="headerSignInButton"
                      >
                        <strong>Sign In</strong>
                      </div>
                    </div>
                  )}
                </div>
                <div styleName="cartIcon">
                  <CartButton href="/cart" amount={totalCount} />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <Modal showModal={showModal} onClose={this.onCloseModal}>
          <Authorization isSignUp={isSignUp} onCloseModal={this.onCloseModal} />
        </Modal>
      </header>
    );
  }
}

export default Header;

Header.contextTypes = {
  environment: PropTypes.object.isRequired,
};
