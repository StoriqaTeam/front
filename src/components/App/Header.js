// @flow

import React, { PureComponent } from 'react';
import { Link } from 'found';

import { SearchInput } from 'components/SearchInput';
import { UserDropdown } from 'components/UserDropdown';
import { CartButton } from 'components/CartButton';
import { Button } from 'components/common/Button';
import { Select } from 'components/common/Select';
import { Icon } from 'components/Icon';

import { Container, Row, Col } from 'layout';

import './Header.scss';

type PropsType = {
  user: ?{},
  searchValue: string,
};

class Header extends PureComponent<PropsType> {
  render() {
    const { user, searchValue } = this.props;
    // const sellingLing =
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
                      { id: '6', label: 'STRATSTRATSTRAT' },
                      { id: '7', label: 'ETH' },
                      { id: '8', label: 'STQ' },
                      { id: '9', label: 'ADA' },
                      { id: '10', label: 'NEM' },
                      { id: '11', label: 'STRAT' },
                      { id: '12', label: 'ETH' },
                      { id: '13', label: 'STQ' },
                      { id: '14', label: 'ADA' },
                      { id: '15', label: 'NEM' },
                      { id: '16', label: 'STRAT' },
                    ]}
                    onSelect={() => {}}
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
                  />
                </div>
                <div styleName="item">
                  <Select
                    isDropdown
                    title="Terms & Conditions"
                    items={[
                      { id: '1', label: 'Punkt #1' },
                      { id: '2', label: 'Punkt #2' },
                      { id: '3', label: 'Punkt #3' },
                    ]}
                    onSelect={() => {}}
                  />
                </div>
                <div styleName="item">
                  <Select
                    isDropdown
                    title="Delivery"
                    items={[
                      { id: '1', label: 'Punkt #1' },
                      { id: '2', label: 'Punkt #2' },
                      { id: '3', label: 'Punkt #3' },
                    ]}
                  />
                </div>
                <div styleName="item">
                  <a href="/">
                    <span styleName="qaIcon">
                      <Icon type="qualityAssurance" />
                    </span>
                    Quality Assurance
                  </a>
                </div>
              </div>
              <div styleName="bottom">
                <Link to="/">
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
                  <CartButton />
                </div>
                <div styleName="buttonWrapper">
                  <Button href={process.env.REACT_APP_HOST ? `${process.env.REACT_APP_HOST}/manage/store/new` : '/'}>
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
