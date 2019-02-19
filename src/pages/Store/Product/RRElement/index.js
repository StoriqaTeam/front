// @flow strict

import React, { Component } from 'react';
import { map, isEmpty, dissoc, take, filter, isNil } from 'ramda';
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
    const { productId } = this.props;

    axios
      .get(
        'https://api.retailrocket.net/api/2.0/recommendation/alternative/5ba8ba0797a5281c5c422860',
        {
          params: {
            itemIds: `${productId}`,
            format: 'json',
          },
        },
      )
      .then(({ data }) => {
        if (data && !isEmpty(data)) {
          const ids = map(item => item.ItemId, data);
          this.fetchData(take(4, ids));
        }
        return true;
      })
      .catch(log.error);
  }

  componentWillUnmount() {
    this.isMount = false;
  }

  timer: TimeoutID;
  isMount: boolean;

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
          }, filter(item => !isNil(item.baseProduct), products)),
        });
        return true;
      })
      .finally(() => {})
      .catch(error => {
        log.error(error);
      });
  };

  render() {
    const { fullWidth } = this.props;
    const { items } = this.state;
    if (isEmpty(items)) {
      return null;
    }
    return (
      <div styleName="container">
        <div styleName="title">
          <strong>Similar goods</strong>
        </div>
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
