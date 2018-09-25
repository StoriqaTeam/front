// @flow strict
import React from 'react';
import type { Node } from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';
import { Row, Col } from 'layout';

import './MobileSearchMenu.scss';

type PropsType = {
  isOpen: boolean,
  onClick: () => void,
  children: Node,
};

const MobileSearchMenu = ({ isOpen, onClick, children }: PropsType) => (
  <div
    styleName={classNames('container', {
      isOpen,
    })}
  >
    <Row>
      <Col size={11} sm={11} md={11} lg={11} xl={11}>
        {children}
      </Col>
      <Col size={1} sm={1} md={1} lg={1} xl={1}>
        <span
          onClick={onClick}
          onKeyPress={() => {}}
          role="button"
          styleName="close"
          tabIndex="-1"
        >
          <Icon type="cross" size={16} />
        </span>
      </Col>
    </Row>
  </div>
);

export default MobileSearchMenu;
