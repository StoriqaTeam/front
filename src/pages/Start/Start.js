// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { Slider } from 'components/Slider';
import { Container, Row, Col } from 'layout';

import CategoriesMenu from './CategoriesMenu';

import './Start.scss';

import staticBanners from './staticBanners.json';

class Start extends PureComponent<{}> {
  render() {
    const categories = pathOr({}, ['categories', 'children'], this.context.directories);
    return (
      <div styleName="container">
        <CategoriesMenu categories={categories} />
        <div styleName="staticBanners">
          <Slider
            isDots
            isInfinity
            autoplaySpeed={15000}
            animationSpeed={500}
            type="banners"
            items={staticBanners}
            slidesToShow={1}
          />
        </div>
        <Container>
          <Row>
            <Col size={4}>
              Block
            </Col>
            <Col size={4}>
              Block
            </Col>
            <Col size={4}>
              Block
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Start.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object,
  currentUser: currentUserShape,
};

export default Page(Start);
