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
                    onSelect={() => { }}
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
                    onSelect={() => { }}
                  />
                </div>
                <div styleName="item">
                  <Select
                    isDropdown
                    title="Terms & Conditions"
                    items={[
                      { id: '1', label: 'Term #1' },
                      { id: '2', label: 'Term #2' },
                      { id: '3', label: 'Term #3' },
                    ]}
                    onSelect={() => { }}
                  />
                </div>
                <div styleName="item">
                  <Select
                    isDropdown
                    title="Delivery"
                    items={[
                      { id: '1', label: 'Delivery #1' },
                      { id: '2', label: 'Delivery #2' },
                      { id: '3', label: 'Delivery #3' },
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
                  <CartButton href="/cart" />
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
