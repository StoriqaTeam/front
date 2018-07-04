// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import {
  pipe,
  pathOr,
  path,
  values,
  map,
  prop,
  propEq,
  groupBy,
  filter,
  reject,
  isNil,
  reduce,
  head,
  defaultTo,
} from 'ramda';

import { formatPrice } from 'utils';
import { Button } from 'components/common/Button';

import { calcTotal } from '../utils';

import './CheckoutSidebar.scss';

const STICKY_THRESHOLD_REM = 90;

type PropsType = {
  storesRef: ?Object,
  cart: any,
  onClick: Function,
  isReadyToClick: Function,
  buttonText: string,
};

type Totals = {
  [storeId: string]: {
    productsCost: number,
    deliveryCost: number,
    totalCount: number,
  },
};

type StateType = {
  currentClass: 'sticky' | 'top' | 'bottom',
  totals: Totals,
};

const STICKY_PADDING_TOP_REM = 2;
const STICKY_PADDING_BOTTOM_REM = 2;

const STORES_FRAGMENT = graphql`
  fragment CheckoutSidebarStoresLocalFragment on CartStoresConnection {
    edges {
      node {
        id
        products {
          id
          selected
          quantity
          price
          deliveryCost
        }
      }
    }
  }
`;

// const getTotals: (data: CartStoresLocalFragment) => Totals = data => {
//   const stores = map(i => i.node, pathOr([], ['edges'], data));
//   return {
//     productsCost: calcTotal(stores, 'productsCost') || 0,
//     deliveryCost: calcTotal(stores, 'deliveryCost') || 0,
//     totalCount: calcTotal(stores, 'totalCount') || 0,
//     totalCost: calcTotal(stores, 'totalCost') || 0,
//   };
// };

const getTotals: (data: CartStoresLocalFragment) => Totals = data => {
  const defaultTotals = { productsCost: 0, deliveryCost: 0, totalCount: 0 };
  const fold = pipe(
    filter(propEq('selected', true)),
    reduce(
      (acc, elem) => ({
        productsCost: acc.productsCost + elem.quantity * elem.price,
        deliveryCost: acc.deliveryCost + elem.deliveryCost,
        totalCount: acc.totalCount + elem.quantity,
      }),
      defaultTotals,
    ),
  );
  return pipe(
    pathOr([], ['edges']),
    map(prop('node')),
    reject(isNil),
    map(store => ({ id: store.id, ...fold(store.products) })),
    groupBy(prop('id')),
    map(pipe(head, defaultTo(defaultTotals))),
  )(data);
};

class CheckoutSidebar extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.handleScroll = this.handleScrollEvent.bind(this);
  }

  state = {
    currentClass: 'top',
  };

  componentWillMount() {
    const store = this.context.environment.getStore();
    const connectionId = `client:root:cart:__Cart_stores_connection`;
    const queryNode = STORES_FRAGMENT.data();
    const snapshot = store.lookup({
      dataID: connectionId, // root
      node: queryNode, // query starting from root
    });
    // console.log('>>> CheckoutSidebar componentWillMount: ', { store, connectionId, queryNode, snapshot });
    // This will be triggered each time any field in our query changes
    // Therefore it's important to include not only the data you need into the query,
    // but also the data you need to watch for.
    const { dispose } = store.subscribe(snapshot, s => {
      this.setState({ totals: getTotals(s.data) });
    });
    this.dispose = dispose;
    this.setState({ totals: getTotals(snapshot.data) });
  }

  componentDidMount() {
    if (!window) return;
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    if (!window) return;
    window.removeEventListener('scroll', this.handleScroll);
    if (this.dispose) {
      this.dispose();
    }
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
    // const { totals } = this.state;
    const { onClick, isReadyToClick, buttonText } = this.props;
    const totals = pipe(
      values,
      reduce(
        (acc, elem) => ({
          productsCost: acc.productsCost + elem.productsCost,
          deliveryCost: acc.deliveryCost + elem.deliveryCost,
          totalCount: acc.totalCount + elem.totalCount,
        }),
        { productsCost: 0, deliveryCost: 0, totalCount: 0 },
      ),
    )(this.state.totals);
    // const { productsCost, deliveryCost, totalCount } = totals;
    console.log('>>> sidebar cart: ', { totals });
    return (
      <div className="top" ref={ref => this.setRef(ref)}>
        <div styleName="container">
          <div styleName="title">Subtotal</div>
          <div styleName="totalsContainer">
            <div styleName="attributeContainer">
              <div styleName="label">Subtotal</div>
              <div styleName="value">
                {`${formatPrice(totals.productsCost || 0)} STQ`}
              </div>
            </div>
            <div styleName="attributeContainer">
              <div styleName="label">Delivery</div>
              <div styleName="value">
                {`${formatPrice(totals.deliveryCost || 0)} STQ`}
              </div>
            </div>
            <div styleName="attributeContainer">
              <div styleName="label">
                Total{' '}
                <span styleName="subLabel">({totals.totalCount} items)</span>
              </div>
              <div styleName="value">
                {`${formatPrice(
                  totals.productsCost + totals.deliveryCost || 0,
                )} STQ`}
              </div>
            </div>
          </div>
          <div styleName="checkout">
            <Button
              id="cartTotalCheckout"
              disabled={!isReadyToClick}
              big
              onClick={onClick}
            >
              {buttonText}
            </Button>
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
