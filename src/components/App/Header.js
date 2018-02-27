// @flow

import React, { Component } from 'react';
import Cookies from 'universal-cookie';

import { SearchInput } from 'components/SearchInput';
import { UserDropdown } from 'components/UserDropdown';
import { CartButton } from 'components/CartButton';
import { Button } from 'components/Button';
import { MiniSelect } from 'components/MiniSelect';

import { Container, Row, Col } from 'layout';

import './Header.scss';

import Logo from './svg/logo.svg';

type PropsType = {
  user: ?{},
};

type StateType = {
  notLogged: ?boolean,
};

class Header extends Component<PropsType, StateType> {
  state = {
    notLogged: false,
  }

  componentWillMount() {
    this.setState({ notLogged: !this.props.user });
  }

  render() {
    const { user } = this.props;
    const { notLogged } = this.state;

    return (
      <header styleName="container">
        <Container>
          <Row>
            <Col size={12}>
              <div styleName="top">
                <div styleName="item">
                  <MiniSelect
                    label="Dropdown"
                    items={[
                      { id: '1', label: 'BTC' },
                      { id: '2', label: 'ETH' },
                      { id: '3', label: 'STQ' },
                      { id: '4', label: 'ADA' },
                      { id: '5', label: 'NEM' },
                      { id: '6', label: 'STRAT' },
                    ]}
                  />
                </div>
                <div styleName="item">
                  <MiniSelect
                    label="Dropdown"
                    items={[
                      { id: '1', label: 'ENG' },
                      { id: '2', label: 'CHN' },
                      { id: '3', label: 'RUS' },
                    ]}
                  />
                </div>
                <div styleName="item">
                  <MiniSelect
                    isDropdown
                    label="Terms & Conditions"
                    items={[
                      { id: '1', label: 'Punkt #1' },
                      { id: '2', label: 'Punkt #2' },
                      { id: '3', label: 'Punkt #3' },
                    ]}
                  />
                </div>
                <div styleName="item">
                  <MiniSelect
                    isDropdown
                    label="Delivery"
                    items={[
                      { id: '1', label: 'Punkt #1' },
                      { id: '2', label: 'Punkt #2' },
                      { id: '3', label: 'Punkt #3' },
                    ]}
                  />
                </div>
                <div styleName="item">
                  <a href="/">Quality Assurance</a>
                </div>
              </div>
              <div styleName="bottom">
                <div styleName="logo">
                  <Logo styleName="logo" />
                </div>
                <div styleName="searchInput">
                  <SearchInput
                    searchCategories={[
                      { id: 0, label: 'Shops' },
                      { id: 1, label: 'Products' },
                      { id: 2, label: 'All' },
                    ]}
                  />
                </div>
                <div styleName="profileIcon">
                  <UserDropdown
                    notLogged={notLogged}
                    user={user}
                  />
                </div>
                <div styleName="cartIcon">
                  <CartButton />
                </div>
                <div styleName="buttonWrapper">
                  <Button
                    wireframe
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
