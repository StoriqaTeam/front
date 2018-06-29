// @flow

import React from 'react';
import { pathOr, map } from 'ramda';
// import { createFragmentContainer, graphql } from 'react-relay';

import { formatPrice } from 'utils';
import { Button } from 'components/common/Button';

import { calcTotal } from '../utils';

import './CheckoutSidebar.scss';

const STICKY_THRESHOLD_REM = 90;

type Totals = {
  [storeId: string]: {
    productsCost: number,
    deliveryCost: number,
    totalCount: number,
  },
};

type PropsType = {
  storesRef: ?Object,
  totals: Totals,
};

type StateType = {
  currentClass: 'sticky' | 'top' | 'bottom',
};

const STICKY_PADDING_TOP_REM = 2;
const STICKY_PADDING_BOTTOM_REM = 2;

class CheckoutSidebar extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.handleScroll = this.handleScrollEvent.bind(this);
  }

  state = {
    currentClass: 'top',
  };

  componentDidMount() {
    if (!window) return;
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    if (!window) return;
    window.removeEventListener('scroll', this.handleScroll);
  }

  setRef(ref: ?Object) {
    this.ref = ref;
  }

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
    const { cart, onClick, isReadyToClick, buttonText, totalCount } = this.props;
    const stores = map(i => i.node, pathOr([], ['stores', 'edges'], cart));
    console.log(">>> sidebar cart: ", { cart, totalCount, stores })
    return (
      <div className="top" ref={ref => this.setRef(ref)}>
        <div styleName="container">
          <div styleName="title">Subtotal</div>
          <div styleName="totalsContainer">
            <div styleName="attributeContainer">
              <div styleName="label">Subtotal</div>
              <div styleName="value">
                {`${formatPrice(calcTotal(stores, 'productsCost') || 0)} STQ`}
              </div>
            </div>
            <div styleName="attributeContainer">
              <div styleName="label">Delivery</div>
              <div styleName="value">
                {`${formatPrice(calcTotal(stores, 'deliveryCost') || 0)} STQ`}
              </div>
            </div>
            <div styleName="attributeContainer">
              <div styleName="label">
                Total{' '}
                <span styleName="subLabel">
                  ({calcTotal(stores, 'totalCount')} items)
                </span>
              </div>
              <div styleName="value">
                {`${formatPrice(calcTotal(stores, 'totalCost') || 0)} STQ`}
              </div>
            </div>
          </div>
          <div styleName="checkout">
            <Button id="cartTotalCheckout" disabled={!isReadyToClick} big onClick={onClick}>
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default CheckoutSidebar;
// export default createFragmentContainer(
//   CheckoutSidebar,
//   graphql`
//     fragment CheckoutSidebar_store on CartStore {
//       productsCost
//       deliveryCost
//       totalCost
//       totalCount
//     }
//   `,
// );
