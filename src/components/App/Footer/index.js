// @flow strict

import React, { PureComponent } from 'react';
import { isNil } from 'ramda';

import { Container, Row, Col } from 'layout';
import { Icon } from 'components/Icon';
import { Collapse } from 'components/Collapse';
import { Button } from 'components/common/Button';
// $FlowIgnoreMe
import { InfoBlock } from 'components/App';

import type { CollapseItemType } from 'types';

import t from './i18n';
import './Footer.scss';

type PropsType = {
  isShopCreated: boolean,
};

type StateType = {
  columns: Array<CollapseItemType>,
};

class Footer extends PureComponent<PropsType, StateType> {
  state = {
    columns: [
      {
        id: t.storiqaMarket,
        title: t.storiqaMarket,
        links: [
          {
            id: t.storiqaMarket_sales,
            name: t.storiqaMarket_sales,
          },
          {
            id: t.storiqaMarket_recommended,
            name: t.storiqaMarket_recommended,
          },
          {
            id: t.storiqaMarket_popular,
            name: t.storiqaMarket_popular,
          },
          {
            id: t.storiqaMarket_reviews,
            name: t.storiqaMarket_reviews,
          },
        ],
      },
      {
        id: t.sections,
        title: t.sections,
        links: [
          {
            id: t.sections_showcase,
            name: t.sections_showcase,
          },
          {
            id: t.sections_goods,
            name: t.sections_goods,
          },
          {
            id: t.sections_shop,
            name: t.sections_shop,
          },
          {
            id: t.sections_storiqaCommunity,
            name: t.sections_storiqaCommunity,
          },
        ],
      },
      {
        id: t.services,
        title: t.services,
        links: [
          {
            id: t.services_qualityAssurance,
            name: t.services_qualityAssurance,
          },
          {
            id: t.services_storiqaWallet,
            name: t.services_storiqaWallet,
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
          <p styleName="logoDescription">{t.logoDescription}</p>
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
          {t.startSelling}
        </Button>
      </div>
    );
    return (
      <footer styleName="container">
        <h2 styleName="offscreen">{t.offscreenSections}</h2>
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
              <div styleName="rightsBlock">{t.copyRight}</div>
            </Col>
          </Row>
        </Container>
      </footer>
    );
  }
}

export default Footer;
