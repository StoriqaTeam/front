// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { formatPrice } from 'utils';
import { Button } from 'components/common/Button';
import { Row, Col } from 'layout';

import './CheckoutSidebar.scss';

const STICKY_THRESHOLD_REM = 90;

type PropsType = {
  storesRef: ?Object,
  onClick: Function,
  isReadyToClick: Function,
  buttonText: string,
  productsCost: number,
  deliveryCost: number,
  totalCount: number,
  totalCost: number,
};

type StateType = {
  currentClass: 'sticky' | 'top' | 'bottom',
  sidebarWidth: ?number,
};

const STICKY_PADDING_TOP_REM = 2;
const STICKY_PADDING_BOTTOM_REM = 2;

class CheckoutSidebar extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.handleScroll = this.handleScrollEvent.bind(this);
    this.state = {
      currentClass: 'top',
      sidebarWidth: null,
    };
  }

  componentDidMount() {
    if (!window) return;
    window.addEventListener('scroll', this.handleScroll);
    this.setWidth();
  }

  componentWillUnmount() {
    if (!window) return;
    window.removeEventListener('scroll', this.handleScroll);
    if (this.dispose) {
      this.dispose();
    }
  }

  setWidth = () => {
    // eslint-disable-next-line
    const sidebarWidth = ReactDOM.findDOMNode(
      this.wrapperRef,
    ).getBoundingClientRect().width;
    this.setState({ sidebarWidth });
  };

  setRef(ref: ?Object) {
    this.ref = ref;
  }

  setWrapperRef(ref: ?Object) {
    this.wrapperRef = ref;
  }

  dispose: Function;
  ref: ?{ className: string };
  scrolling: boolean;
  handleScroll: () => void;
  scrolling = false;

  updateStickiness() {
    if (!window) return;
    if (!this.ref || !this.props.storesRef) return;
    const rem = parseFloat(
      window.getComputedStyle(document.documentElement).fontSize,
    );
    const offset = window.pageYOffset;
    // $FlowIgnoreMe
    const rect = this.ref.getBoundingClientRect();
    const height = rect.bottom - rect.top;
    const {
      top: viewTop,
      bottom: viewBottom,
      // $FlowIgnoreMe
    } = this.props.storesRef.getBoundingClientRect();
    if (viewBottom - viewTop < STICKY_THRESHOLD_REM * rem) {
      if (this.state.currentClass !== 'top') {
        this.setState({ currentClass: 'top' });
      }
      return;
    }
    const top = viewTop + (offset - STICKY_PADDING_TOP_REM * rem);
    const bottom =
      viewBottom +
      (offset - (STICKY_PADDING_TOP_REM + STICKY_PADDING_BOTTOM_REM) * rem);
    let currentClass = 'top';
    if (offset >= top) {
      currentClass = 'sticky';
    }
    if (offset + height >= bottom) {
      currentClass = 'bottom';
    }
    // $FlowIgnoreMe
    if (this.ref.className !== currentClass) {
      // $FlowIgnoreMe
      this.ref.className = currentClass;
    }
  }

  handleScrollEvent() {
    if (!this.scrolling) {
      window.requestAnimationFrame(() => {
        this.updateStickiness();
        this.scrolling = false;
      });
      this.scrolling = true;
    }
  }

  render() {
    const {
      onClick,
      isReadyToClick,
      buttonText,
      productsCost,
      deliveryCost,
      totalCost,
      totalCount,
    } = this.props;
    const { sidebarWidth } = this.state;
    return (
      <div styleName="wrapper" ref={ref => this.setWrapperRef(ref)}>
        <div
          className="top"
          ref={ref => this.setRef(ref)}
          style={{ width: sidebarWidth || '100%' }}
        >
          <div styleName="container">
            <div styleName="title">Subtotal</div>
            <div styleName="totalsContainer">
              <Row>
                <Col size={12} sm={9} md={12}>
                  <Row>
                    <Col size={12} sm={4} md={12}>
                      <div styleName="attributeContainer">
                        <div styleName="label">Subtotal</div>
                        <div styleName="value">
                          {productsCost &&
                            `${formatPrice(productsCost || 0)} STQ`}
                        </div>
                      </div>
                    </Col>
                    <Col size={12} sm={4} md={12}>
                      <div styleName="attributeContainer">
                        <div styleName="label">Delivery</div>
                        <div styleName="value">
                          {deliveryCost &&
                            `${formatPrice(deliveryCost || 0)} STQ`}
                        </div>
                      </div>
                    </Col>
                    <Col size={12} sm={4} md={12}>
                      <div styleName="attributeContainer">
                        <div styleName="label">
                          Total{' '}
                          <span styleName="subLabel">
                            ({totalCount && totalCount} items)
                          </span>
                        </div>
                        <div styleName="value bold">
                          {totalCost && `${formatPrice(totalCost || 0)} STQ`}
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
                disabled={!isReadyToClick}
                big
                onClick={onClick}
                dataTest="checkoutNext"
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CheckoutSidebar.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default CheckoutSidebar;
