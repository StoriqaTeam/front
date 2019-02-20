// @flow strict

import React, { Component } from 'react';
import { map, isEmpty, dissoc, take, filter, isNil, assoc } from 'ramda';
import { Environment } from 'relay-runtime';
import classNames from 'classnames';
// $FlowIgnore
import axios from 'axios';

import { ContextDecorator } from 'components/App';
// $FlowIgnore
import { CardProduct } from 'components/CardProduct';
import { log } from 'utils';
import { fetchProducts } from 'relay/queries';

import './RRElement.scss';

type VariantType = {
  cashback: ?number,
  discount: ?number,
  id: string,
  photoMain: ?string,
  price: ?number,
  rawId: ?number,
  customerPrice: {
    price: number,
    currency: string,
  },
};

export type ItemType = {
  rawId: number,
  storeId: number,
  currency: string,
  name: Array<{
    lang: string,
    text: string,
  }>,
  products: {
    edges: Array<{
      node: VariantType,
    }>,
  },
  rating: number,
  store: {
    name: Array<{
      lang: string,
      text: string,
    }>,
  },
  priceUsd: ?number,
};

type StateType = {
  items: Array<ItemType>,
};

type PropsType = {
  productId: number,
  fullWidth?: boolean,
  environment: Environment,
  dataVendor?: string,
  title?: string,
  type: 'alternative' | 'related',
};

class RRElement extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      items: [],
    };
  }

  componentDidMount() {
    this.isMount = true;
    this.updateWidget();
  }

  componentDidUpdate(prevProps: PropsType) {
    const { productId } = this.props;
    if (productId !== prevProps.productId) {
      this.updateWidget();
    }
  }

  componentWillUnmount() {
    this.isMount = false;
  }

  timer: TimeoutID;
  isMount: boolean;

  updateWidget = () => {
    const { productId, dataVendor, type } = this.props;
    let params = {
      itemIds: `${productId}`,
      session: '5baa64e812ff0a000198c632',
      pvid: '561783608306378',
      format: 'json',
    };

    if (dataVendor === 'brand') {
      params = assoc('vendor', 'brand', params);
    }

    // alternative

    axios
    .get(
      `https://api.retailrocket.net/api/2.0/recommendation/${type}/5ba8ba0797a5281c5c422860`,
      { params },
    )
    .then(({ data }) => {
      if (data && !isEmpty(data)) {
        const ids = map(item => item.ItemId, data);
        this.fetchData(ids);
      }
      return true;
    })
    .catch(log.error);
  };

  fetchData = (ids: Array<number>) => {
    fetchProducts({
      ids,
      environment: this.props.environment,
    })
      .then(products => {
        this.setState({
          items: map(item => {
            if (item.baseProduct === null) {
              return null;
            }
            return {
              ...item.baseProduct,
              products: {
                edges: [
                  {
                    node: { ...dissoc('baseProduct', item) },
                  },
                ],
              },
            };
            // $FlowIgnore
          }, take(4, filter(item => !isNil(item.baseProduct), products))),
        });
        return true;
      })
      .finally(() => {})
      .catch(error => {
        log.error(error);
      });
  };

  render() {
    const { fullWidth, title } = this.props;
    const { items } = this.state;
    if (isEmpty(items)) {
      return null;
    }
    return (
      <div styleName="container">
        {!isNil(title) && (
          <div styleName="title">
            <strong>{title}</strong>
          </div>
        )}
        <div styleName={classNames('items', { fullWidth })}>
          {map(
            item => (
              <div key={item.rawId} styleName="item">
                <CardProduct item={item} />
              </div>
            ),
            items,
          )}
        </div>
      </div>
    );
  }
}

export default ContextDecorator(RRElement);
