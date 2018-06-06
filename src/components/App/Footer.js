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
    const FooterColumn = ({ title, links }: FooterCol) => (
      <div>
        <div styleName="navHeader">
          <b>{title}</b>
        </div>
        {links.map(({ id, linkName }) => (
          <a key={id} href="/" styleName="navItem">
            {linkName}
          </a>
        ))}
      </div>
    );
    const FooterLogo = () => (
      <div styleName="navBlockLogo">
        <Icon type="logo" />
        <div styleName="description">
          Storiqa is a global marketplace for any kind of legal goods
          supporting cryptocurrency payments
        </div>
      </div>
    );
    const FooterButton = () => (
      <div styleName="navBlockButton">
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
              <Col
                xl={4}
                lg={4}
                md={8}
              >
                <div>
                  <Row>
                    <Col
                      xl={9}
                      lg={9}
                    >
                      <FooterLogo />
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col
                xl={6}
                lg={8}
                md={12}
              >
                <div>
                  <Row>
                    <Col
                      xl={4}
                      lg={4}
                    >
                      <FooterColumn {...market} />
                    </Col>
                    <Col
                      xl={4}
                      lg={4}
                    >
                      <FooterColumn {...sections} />
                    </Col>
                    <Col
                      xl={4}
                      lg={4}
                    >
                      <FooterColumn {...services} />
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col
                xl={2}
                lg={12}
                md={12}
              >
                <FooterButton />
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
