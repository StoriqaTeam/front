// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import { pathOr } from 'ramda';

import { formatPrice, currentCurrency } from 'utils';
import { Button } from 'components/common/Button';
import { Row, Col } from 'layout';

import './CheckoutSidebar.scss';

type PropsType = {
  onClick: Function,
  isReadyToClick: Function,
  buttonText: string,
  checkoutInProcess: boolean,
};

type StateType = {
  productsCost: number,
  deliveryCost: number,
  totalCount: number,
  totalCost: number,
};

const TOTAL_FRAGMENT = graphql`
  fragment CheckoutSidebarTotalLocalFragment on Cart {
    id
    productsCost
    deliveryCost
    totalCount
    totalCost
  }
`;

class CheckoutSidebar extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      productsCost: 0,
      deliveryCost: 0,
      totalCount: 0,
      totalCost: 0,
    };
  }

  componentDidMount() {
    const store = this.context.environment.getStore();
    const cartId = pathOr(
      null,
      ['cart', '__ref'],
      store.getSource().get('client:root'),
    );
    const queryNode = TOTAL_FRAGMENT.data();
    const snapshot = store.lookup({
      dataID: cartId,
      node: queryNode,
    });
    const { dispose } = store.subscribe(snapshot, s => {
      this.updateTotal(s.data);
    });
    this.updateTotal(snapshot.data);
    this.dispose = dispose;
  }

  componentWillUnmount() {
    if (this.dispose) {
      this.dispose();
    }
  }

  setRef(ref: ?Object) {
    this.ref = ref;
  }

  setWrapperRef(ref: ?Object) {
    this.wrapperRef = ref;
  }

  updateTotal = (data: {
    productsCost: number,
    deliveryCost: number,
    totalCost: number,
    totalCount: number,
  }) => {
    const { productsCost, deliveryCost, totalCost, totalCount } = data;
    this.setState({
      productsCost,
      deliveryCost,
      totalCost,
      totalCount,
    });
  };

  dispose: Function;
  ref: ?{ className: string };
  wrapperRef: any;
  scrolling: boolean;
  handleScroll: () => void;
  scrolling = false;

  render() {
    const {
      onClick,
      isReadyToClick,
      buttonText,
      checkoutInProcess,
    } = this.props;
    const { productsCost, deliveryCost, totalCost, totalCount } = this.state;
    return (
      <div>
        <div styleName="paperWrapper">
          <div styleName="corner tl" />
          <div styleName="paper" />
          <div styleName="corner tr" />
        </div>
        <div styleName="container">
          <div styleName="title">Subtotal</div>
          <div styleName="totalsContainer">
            <Row>
              <Col size={12} sm={9} md={12}>
                <Row>
                  <Col size={12} sm={4} lg={12}>
                    <div styleName="attributeContainer">
                      <div styleName="label">Subtotal</div>
                      <div styleName="value">
                        {productsCost &&
                          `${formatPrice(
                            productsCost || 0,
                          )} ${currentCurrency()}`}
                      </div>
                    </div>
                  </Col>
                  <Col size={12} sm={4} lg={12}>
                    <div styleName="attributeContainer">
                      <div styleName="label">Delivery</div>
                      <div styleName="value">
                        {deliveryCost &&
                          `${formatPrice(
                            deliveryCost || 0,
                          )} ${currentCurrency()}`}
                      </div>
                    </div>
                  </Col>
                  <Col size={12} sm={4} lg={12}>
                    <div styleName="attributeContainer">
                      <div styleName="label">
                        Total{' '}
                        <span styleName="subLabel">
                          ({totalCount && totalCount} items)
                        </span>
                      </div>
                      <div styleName="value bold">
                        {totalCost &&
                          `${formatPrice(totalCost || 0)} ${currentCurrency()}`}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <div styleName="checkout">
            <Button
              id="cartTotalCheckout"
              disabled={checkoutInProcess || !isReadyToClick}
              isLoading={checkoutInProcess}
              big
              onClick={onClick}
              dataTest="checkoutNext"
            >
              {buttonText}
            </Button>
          </div>
        </div>
        <div styleName="paperWrapper">
          <div styleName="corner bl" />
          <div styleName="paper bottom" />
          <div styleName="corner br" />
        </div>
      </div>
    );
  }
}

CheckoutSidebar.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default CheckoutSidebar;
