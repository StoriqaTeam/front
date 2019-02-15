// @flow strict

import React, { PureComponent } from 'react';
import { isNil } from 'ramda';
import { routerShape, withRouter } from 'found';

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
  router: routerShape,
};

type StateType = {
  columns: Array<CollapseItemType>,
};

class Footer extends PureComponent<PropsType, StateType> {
  state = {
    columns: [
      {
        id: 'goods',
        title: t.goods,
        links: [
          {
            id: t.storiqaMarket_sales,
            name: t.storiqaMarket_sales,
            appLink: '/categories?search=&sortBy=DISCOUNT',
          },
          {
            id: t.storiqaMarket_popular,
            name: t.storiqaMarket_popular,
            appLink: '/categories?search=&sortBy=VIEWS',
          },
        ],
      },
      {
        id: 'marketplace',
        title: t.marketplace,
        links: [
          {
            id: 'termsOfUse',
            name: t.marketplace_termsOfUse,
            pdfLink: '/terms_of_use.pdf',
          },
          {
            id: 'privacyPolicy',
            name: t.marketplace_privacyPolicy,
            pdfLink: '/privacy_policy.pdf',
          },
          {
            id: 'listOfProhibitedGoods',
            name: t.marketplace_listOfProhibitedGoods,
            pdfLink: '/prohibited_or_suspicious_goods_and_services.pdf',
          },
        ],
      },
      {
        id: 'services',
        title: t.services,
        links: [
          {
            id: 'services_storiqaWallet',
            name: t.services_storiqaWallet,
            link: 'https://turewallet.com',
          },
          {
            id: 'services_sellingGuides',
            name: t.services_sellingGuides,
            link: 'https://storiqa.com/selling-guides',
          },
          {
            id: 'services_storiqaBlog',
            name: t.services_storiqaBlog,
            link: 'https://storiqa.com/blog',
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
          <p styleName="storiqaGlobal">{t.storiqaIsAGlobalMarketPlace}</p>
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
              links.map(({ id, name, appLink, pdfLink, link }) => (
                <li key={id}>
                  {appLink != null && (
                    <button
                      styleName="navItem"
                      onClick={() => {
                        this.props.router.push(appLink);
                      }}
                    >
                      {name}
                    </button>
                  )}
                  {pdfLink != null && (
                    <a href={pdfLink} target="_blank" styleName="navItem">
                      {name}
                    </a>
                  )}
                  {link != null && (
                    <a href={link} target="_blank" styleName="navItem">
                      {name}
                    </a>
                  )}
                </li>
              ))}
          </ul>
        </nav>
      </Col>
    );
    const StartSellingButton = () => (
      <div styleName="startSellingButton">
        <p styleName="sellGoods">{t.wannaSellYourGoodsGlobally}</p>
        <Button
          href="https://selling.storiqa.com"
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
              <Col md={12} lg={3} xl={3}>
                <div styleName="logo">
                  <Row>
                    <FooterLogo />
                  </Row>
                </div>
              </Col>
              <Col md={12} lg={9} xl={6} mdVisible>
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
                  onSelected={() => {}}
                  items={columns}
                />
              </Col>
              <Col md={12} lg={12} xl={3}>
                {isShopCreated ? null : <StartSellingButton />}
              </Col>
            </Row>
          </div>
          <Row>
            <Col>
              <InfoBlock />
              <div styleName="rightsBlock">
                {t.copyRight}
                <br />
                {t.allRightsReserved}
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    );
  }
}

export default withRouter(Footer);
