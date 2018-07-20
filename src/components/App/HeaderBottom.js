import React from 'react';
import classNames from 'classnames';
import { Link } from 'found';
import { Icon } from 'components/Icon';

import { SearchInput } from 'components/SearchInput';
import { UserDropdown } from 'components/UserDropdown';
import { CartButton } from 'components/CartButton';
import { Row, Col } from 'layout';

import type { UserDataType, MobileCategoryType } from 'types';

import { AuthButtons } from './index';

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
      <Col size={8} sm={4} md={7} lg={3} xl={3}>
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
      <Col size={4} sm={5} md={3} lg={6} xl={6} lgVisible>
        <SearchInput
          searchCategories={searchCategories}
          searchValue={searchValue}
        />
      </Col>
      <Col size={4} sm={3} md={5} lg={3} xl={3}>
        <div styleName="userData">
          <div
            onClick={onMobileSearch}
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
            <AuthButtons onOpenModal={onOpenModal} />
          )}
          <div styleName="cartIcon">
            <CartButton href="/cart" amount={totalCount} />
          </div>
        </div>
      </Col>
    </Row>
  </div>
);

export default HeaderBottom;
