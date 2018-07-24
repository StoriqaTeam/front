// @flow

import React, { PureComponent } from 'react';
import { withRouter } from 'found';
import { createPaginationContainer, graphql, Relay } from 'react-relay';
import { pathOr, map } from 'ramda';

import { CardProduct } from 'components/CardProduct';
import { Button } from 'components/common/Button';
import { Container, Col, Row } from 'layout';

import './StoreItems.scss';

const productsPerRequest = 24;

type PropsType = {
  relay: Relay,
};

// eslint-disable-next-line
class StoreItems extends PureComponent<PropsType> {
  productsRefetch = () => {
    this.props.relay.loadMore(2);
  };

  render() {
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
              dataTest="shopProductsLoadMoreButton"
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
        first: { type: "Int", defaultValue: 24 }
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
    getConnectionFromProps: props => props.shop && props.shop.baseProducts,
    getVariables: (props, _, prevFragmentVars) => ({
      storeId: prevFragmentVars.storeId,
      first: productsPerRequest,
      after: props.shop.baseProducts.pageInfo.endCursor,
    }),
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
