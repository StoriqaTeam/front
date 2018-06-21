import React from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';
import { SearchInput } from 'components/SearchInput';
import { Row, Col } from 'layout';

import './MobileSearchMenu.scss';

type PropsType = {
  isOpen: boolean,
  searchCategories: Array<{ id: string, label: string }>,
  searchValue: any,
  onClick: () => void,
};

const MobileSearchMenu = ({
  isOpen,
  searchCategories,
  searchValue,
  onClick,
}: PropsType) => (
  <div
    styleName={classNames('container', {
      isOpen,
    })}
  >
    <Row>
      <Col size={11} sm={11} md={11} lg={11} xl={11}>
        <SearchInput
          searchCategories={searchCategories}
          searchValue={searchValue}
        />
      </Col>
      <Col size={1} sm={1} md={1} lg={1} xl={1}>
        <span
          onClick={onClick}
          onKeyPress={() => {}}
          role="button"
          tabIndex="-1"
        >
          <Icon type="arrowRight" size="28" />
        </span>
      </Col>
    </Row>
  </div>
);

export default MobileSearchMenu;
