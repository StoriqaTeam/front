// @flow strict

import React, { PureComponent } from 'react';
import { isNil } from 'ramda';

import { Container, Row, Col } from 'layout';
import { Icon } from 'components/Icon';
import { Collapse } from 'components/Collapse';
import { Button } from 'components/common/Button';

import type { CollapseItemType } from 'types';

import './FooterResponsive.scss';
// $FlowIgnoreMe
import { InfoBlock } from './index';

type PropsType = {
  isShopCreated: boolean,
};

type StateType = {
  columns: Array<CollapseItemType>,
};

class FooterResponsive extends PureComponent<PropsType, StateType> {
  state = {
    columns: [
      {
        id: 'Storiqa market',
        title: 'Storiqa market',
        links: [
          {
            id: '0',
            name: 'Sale',
          },
          {
            id: '1',
            name: 'Recommended',
          },
          {
            id: '2',
            name: 'Popular',
          },
          {
            id: '3',
            name: 'Reviews',
          },
        ],
      },
      {
        id: 'Sections',
        title: 'Sections',
        links: [
          {
            id: '0',
            name: 'Showcase',
          },
          {
            id: '1',
            name: 'Goods',
          },
          {
            id: '2',
            name: 'Shop',
          },
          {
            id: '3',
            name: 'Storiqa Community',
          },
        ],
      },
      {
        id: 'Services',
        title: 'Services',
        links: [
          {
            id: '0',
            name: 'Quality Assurance',
          },
          {
            id: '1',
            name: 'Storiqa wallet',
          },
        ],
      },
    ],
  };
  render() {
    const { isShopCreated } = this.props;
    const { columns } = this.state;
    const FooterLogo = () => (
      <Col lg={9} xl={9}>
        <div styleName="footerLogo">
          <Icon type="logo" />
          <p styleName="logoDescription">
            Storiqa is a global marketplace for any kind of legal goods
            supporting cryptocurrency payments
          </p>
        </div>
      </Col>
    );
    const FooterColumn = ({ title, links }: CollapseItemType) => (
      <Col sm={12} md={4} lg={4} xl={4}>
        <nav styleName="footerColumn">
          <header styleName="navHeader">
            <h3>{title}</h3>
          </header>
          <ul>
            {!isNil(links) &&
              links.map(({ id, name }) => (
                <li key={id}>
                  <a href="/" styleName="navItem">
                    {name}
                  </a>
                </li>
              ))}
          </ul>
        </nav>
      </Col>
    );
    const StartSellingButton = () => (
      <div styleName="startSellingButton">
        <Button
          wireframe
          href={
            process.env.REACT_APP_HOST
              ? `${process.env.REACT_APP_HOST}/start-selling`
              : '/'
          }
          dataTest="footerStartSellingButton"
        >
          Start selling
        </Button>
      </div>
    );
    return (
      <footer styleName="container">
        <h2 styleName="offscreen">Storiqa Sections</h2>
        <Container>
          <div styleName="footerTop">
            <Row>
              <Col md={12} lg={4} xl={4}>
                <div>
                  <Row>
                    <FooterLogo />
                  </Row>
                </div>
              </Col>
              <Col md={12} lg={8} xl={6} mdVisible>
                <Row>
                  {columns.map(column => (
                    <FooterColumn key={column.id} {...column} />
                  ))}
                </Row>
              </Col>
              <Col size={12} sm={12} md={12} mdHidden>
                <Collapse
                  grouped
                  menuTitle="Menu"
                  items={columns}
                  onSelected={() => {}}
                />
              </Col>
              <Col md={12} lg={12} xl={2}>
                {isShopCreated ? null : <StartSellingButton />}
              </Col>
            </Row>
          </div>
          <Row>
            <Col>
              <InfoBlock />
              <div styleName="rightsBlock">
                © Storiqa Marketplace. All rights reserved. 2018
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    );
  }
}

export default FooterResponsive;
