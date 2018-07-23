// flow

import React, { Component } from 'react';

import { Col, Row } from 'layout';
import { Button } from 'components/common/Button';
import Rating from 'components/Rating';
import { Icon } from 'components/Icon';

import './StoreHeader.scss';

type PropsType = {
  image: string,
  logo: string,
};

class StoreHeader extends Component<PropsType> {
  render() {
    const { image, logo } = this.props;
    return (
      <header styleName="container">
        <div styleName="imageWrapper">
          <figure styleName="image">
            <img src={image} alt="storiqa's shop" />
          </figure>
        </div>
        <div styleName="shopBanner">
          <Row>
            <Col sm={12} md={6} lg={4} xl={4}>
              <div styleName="shopInfo">
                <span styleName="controls">
                  <Icon type="controls" size={20} />
                </span>
                <span styleName="magnifier">
                  <Icon type="magnifier" size={20} />
                </span>
                <figure styleName="shopLogo">
                  <img src={logo} alt="storiqa's shop" />
                </figure>
                <div>
                  <h2 styleName="shopTitle">
                    Shop Name{' '}
                    <span styleName="cartIcon">
                      <Icon type="cart" size={20} />
                    </span>
                  </h2>
                  <div styleName="shopRating">
                    <Rating rating={3} />
                    <span styleName="reviews">380 Reviews</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={2} xl={4} lgVisible />
            <Col sm={12} md={6} lg={5} xl={4}>
              <div styleName="sellerButtons">
                <Button big>
                  <span styleName="buttonText">
                    <span styleName="buttonIcon">
                       <Icon type="email" size={20} />
                    </span>
                    <span styleName="message">Message to </span>seller
                  </span>
                </Button>
                <Button big wireframe onClick={() => {}}>
                  <span styleName="buttonText">
                    <span styleName="buttonIcon"><Icon type="phone" size={20} /></span> Call seller
                  </span>
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </header>
    );
  }
}

export default StoreHeader;
