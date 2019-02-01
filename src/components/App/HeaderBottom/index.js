// @flow

import React from 'react';
import classNames from 'classnames';
import { Link } from 'found';
import { Icon } from 'components/Icon';

import { AuthButtons } from 'components/App';
import { SearchInput } from 'components/SearchInput';
import { UserDropdown } from 'components/UserDropdown';
import { CartButton } from 'components/CartButton';
import { Row, Col } from 'layout';

import type { UserDataType, MobileCategoryType } from 'types';

import './HeaderBottom.scss';

type PropsType = {
  searchCategories: ?MobileCategoryType,
  searchValue: string,
  totalCount: number,
  userData: UserDataType,
  onMobileSearch: () => void,
  onOpenModal: () => void,
};

const HeaderBottom = ({
  searchCategories,
  searchValue,
  totalCount,
  userData,
  onMobileSearch,
  onOpenModal,
}: PropsType) => (
  <div styleName="container">
    <Row>
      <Col size={6} sm={4} md={6} lg={3} xl={3}>
        <div styleName="logo">
          <div styleName="logoIcon" data-test="logoLink">
            <Link to="/">
              <Icon type="logo" dataTest="storiqaIcon" />
            </Link>
          </div>
        </div>
      </Col>
      <Col size={2} sm={5} md={1} lg={6} xl={6}>
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
            onClick={onMobileSearch}
            onKeyPress={() => {}}
            role="button"
            styleName={classNames('searchIcon', {
              isUserLoggedIn: userData,
            })}
            tabIndex="-1"
          >
            <Icon type="magnifier" />
          </div>
          {userData ? (
            <UserDropdown user={userData} />
          ) : (
            <AuthButtons onOpenModal={onOpenModal} />
          )}
          <div
            styleName={classNames('cartIcon', {
              isUserLoggedIn: userData,
            })}
          >
            <CartButton href="/cart" amount={totalCount} />
          </div>
        </div>
      </Col>
    </Row>
  </div>
);

export default HeaderBottom;
