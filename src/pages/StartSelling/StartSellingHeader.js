// flow@ 

import React from 'react';
import { Link, withRouter, routerShape } from 'found';
import { Icon } from 'components/Icon';
import { Container, Row } from 'layout';

import './StartSellingHeader.scss';

type PropsType = {
  router: routerShape,
};

const StartSellingHeader = ({
  router: { 
    push,
  },
}: PropsType) => (
  <Container>
    <Row>
      <header styleName="container">
        <div styleName="logo">
          {/**/}
          <div styleName="logoIcon">
            <Link to="/" data-test="logoLink">
              <Icon type="logo" />
            </Link>
          </div>
        </div>
      </header>
    </Row>
    <div styleName="background">

      <div styleName="imageHeading" />
      <h2 styleName="title">
        Millions of shoppers are waiting
      </h2>
      <div styleName="titleSpacer" />
      <p styleName="subtitle">
        Start selling now with Storiqa and see how it’s easy to trade globally
      </p>
      <div
        role="button"
        tabIndex="-1"
        onKeypress={() => {}}
        onClick={() => push('/')}
        styleName="startSellingButton"
      >
        Start Selling
      </div>
    </div>
  </Container>
);

export default withRouter(StartSellingHeader);
