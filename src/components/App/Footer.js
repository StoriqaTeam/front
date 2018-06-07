// @flow

import React, { PureComponent } from 'react';

import { Container, Row, Col } from 'layout';
import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';

import './Footer.scss';

import { InfoBlock } from './index';

type FooterCol = {
  title: string,
  links: Array<{ id: string, linkName: string }>,
};

type StateType = {
  market: FooterCol,
  sections: FooterCol,
  services: FooterCol,
};

class Footer extends PureComponent<{}, StateType> {
  state = {
    market: {
      title: 'Storiqa market',
      links: [
        {
          id: '0',
          linkName: 'Sale',
        },
        {
          id: '1',
          linkName: 'Recommended',
        },
        {
          id: '2',
          linkName: 'Popular',
        },
        {
          id: '3',
          linkName: 'Reviews',
        },
      ],
    },
    sections: {
      title: 'Sections',
      links: [
        {
          id: '0',
          linkName: 'Showcase',
        },
        {
          id: '1',
          linkName: 'Goods',
        },
        {
          id: '2',
          linkName: 'Shop',
        },
        {
          id: '3',
          linkName: 'Storiqa Community',
        },
      ],
    },
    services: {
      title: 'Sections',
      links: [
        {
          id: '0',
          linkName: 'Quality Assurance',
        },
        {
          id: '1',
          linkName: 'Storiqa wallet',
        },
      ],
    },
  };
  render() {
    const { market, sections, services } = this.state;
    const FooterLogo = () => (
      <Col lg={9} xl={9}>
        <div styleName="footerLogo">
          <Icon type="logo" />
          <div styleName="logoDescription">
            Storiqa is a global marketplace for any kind of legal goods supporting
            cryptocurrency payments
          </div>
        </div>
      </Col>
    );
    const FooterColumn = ({ title, links }: FooterCol) => (
      <Col sm={12} md={4} lg={4} xl={4}>
        <aside styleName="footerColumn">
          <div>
            <header styleName="navHeader">
              <b>{title}</b>
            </header>
            {links.map(({ id, linkName }) => (
              <a key={id} href="/" styleName="navItem">
                {linkName}
              </a>
            ))}
          </div>
        </aside>
      </Col>
    );
    const StartSellingButton = () => (
      <div styleName="startSellingButton">
        <Button
          href={
            process.env.REACT_APP_HOST
              ? `${process.env.REACT_APP_HOST}/manage/wizard`
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
              <Col md={12} lg={8} xl={6}>
                <Row>
                  <FooterColumn {...market} />
                  <FooterColumn {...sections} />
                  <FooterColumn {...services} />
                </Row>
              </Col>
              <Col md={12} lg={12} xl={2}>
                <StartSellingButton />
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

export default Footer;
