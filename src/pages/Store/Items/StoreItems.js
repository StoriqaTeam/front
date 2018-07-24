// @flow

import React, { Component } from 'react';
import { withRouter } from 'found';
import { createPaginationContainer, graphql } from 'react-relay';
import { pipe, pathOr, path, map, prop, isEmpty } from 'ramda';

import { CardProduct } from 'components/CardProduct';
import { Button } from 'components/common/Button';
import { Container, Col, Row } from 'layout';

import './StoreItems.scss';

type SelectedType = {
  //
};

type PropsType = {
  // router: routerShape,
};

type StateType = {
  category: ?SelectedType,
  isSidebarOpen: boolean,
};
// eslint-disable-next-line
class StoreItems extends Component<PropsType, StateType> {
  productsRefetch = () => {
    this.props.relay.loadMore(2);
  };

  render() {
    console.log('---this.props', {
      props: this.props,
      hasMore: this.props.relay.hasMore(),
    });
    const { shop } = this.props;
    const products = map(
      item => item.node,
      pathOr([], ['shop', 'baseProducts', 'edges'], this.props),
    );
    return (
      <Container>
        <Row>
          {products &&
            map(
              item => (
                <Col size={6} md={4} xl={3}>
                  <div key={item.id} styleName="cardWrapper">
                    <CardProduct item={item} />
                  </div>
                </Col>
              ),
              products,
            )}
        </Row>
        {this.props.relay.hasMore() && (
          <div styleName="">
            <Button
              big
              load
              onClick={this.productsRefetch}
              dataTest="storeProductsLoadMoreButton"
            >
              Load more
            </Button>
          </div>
        )}
      </Container>
    );
  }
}

export default createPaginationContainer(
  withRouter(StoreItems),
  graphql`
    fragment StoreItems_shop on Store
      @argumentDefinitions(
        storeId: { type: "Int", defaultValue: null }
        first: { type: "Int", defaultValue: 2 }
        after: { type: "ID", defaultValue: null }
      ) {
      baseProducts(first: $first, after: $after)
        @connection(key: "StoreItems_baseProducts") {
        edges {
          node {
            id
            rawId
            currencyId
            name {
              text
              lang
            }
            category {
              rawId
            }
            storeId
            products(first: 1) {
              edges {
                node {
                  id
                  rawId
                  discount
                  photoMain
                  cashback
                  price
                  attributes {
                    attribute {
                      id
                    }
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
  {
    direction: 'forward',
    getConnectionFromProps: props => {
      console.log('>>> get connction from props: ', { props });
      return props.shop && props.shop.baseProducts;
    },
    getVariables: (props, _, prevFragmentVars) => {
      console.log('>>> StoreItems refetch props: ', {
        props,
        prevFragmentVars,
      });
      return {
        storeId: prevFragmentVars.storeId,
        first: 2,
        after: props.shop.baseProducts.pageInfo.endCursor,
      };
    },
    query: graphql`
      query StoreItems_shop_Query($storeId: Int!, $first: Int, $after: ID) {
        store(id: $storeId) {
          ...StoreItems_shop
            @arguments(storeId: $storeId, first: $first, after: $after)
        }
      }
    `,
  },
);
