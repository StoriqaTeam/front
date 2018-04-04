// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createRefetchContainer, graphql } from 'react-relay';
import { map, find, propEq, pathOr, head } from 'ramda';
import { Link } from 'found';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { MiniSelect } from 'components/MiniSelect';
import { Icon } from 'components/Icon';
import { Button } from 'components/Button';
import { Container, Row, Col } from 'layout';

import './Stores.scss';

import storesData from './stores.json';

type PropsType = {
  //
};

type StateType = {
  stores: ?Array<{
    node: {
      id: string,
      rawId: string,
      name: Array<{
        lang: string,
        text: string,
      }>,
      logo: string,
      productsCount: string,
      baseProductsWithVariants: {
        edges: Array<{
          node: {
            id: string,
            rawId: string,
            variants: Array<{
              id: string,
              rawId: string,
              product: {
                photoMain: string,
              }
            }>,
          }
        }>,
      },
    }
  }>,
  category: { id: string, label: string },
  location: { id: string, label: string },
  sortItem: { id: string, label: string },
};

class Stores extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    if (storesData) {
      this.state = {
        stores: storesData,
        category: { id: '1', label: 'Детские товары' },
        location: { id: '1', label: 'Россия' },
        sortItem: { id: '1', label: 'Цена (убывание)' },
      };
    }
  }

  storesRefetch = () => {
    // Uncomment after the back
    // this.props.relay.refetch(
    //   {},
    //   {
    //     first: 8,
    //     after: 0,
    //   },
    //   () => {},
    //   { force: true },
    // );
  }

  handleСategory = (category: { id: string, label: string }) => {
    this.setState({ category });
  };

  handleLocation = (location: { id: string, label: string }) => {
    this.setState({ location });
  };

  handleSort = (sortItem: { id: string, label: string }) => {
    this.setState({ sortItem });
  };

  render() {
    const {
      stores,
      category,
      location,
      sortItem,
    } = this.state;
    const lang = 'EN';
    return (
      <Container>
        <Row>
          <Col size={2}>
            <div styleName="countInfo">
              <b>2 741</b> магазинов найдено с trade в названии
            </div>
            <div styleName="filterItem">
              <MiniSelect
                forSearch
                label="Категория магазина"
                activeItem={category}
                items={[
                  { id: '1', label: 'Детские товары' },
                  { id: '2', label: 'Недетские товары' },
                ]}
                onSelect={this.handleСategory}
              />
            </div>
            <div styleName="filterItem">
              <MiniSelect
                forSearch
                label="Расположение магазина"
                activeItem={location}
                items={[
                  { id: '1', label: 'Россия' },
                  { id: '2', label: 'Норвегия' },
                ]}
                onSelect={this.handleLocation}
              />
            </div>
          </Col>
          <Col size={10}>
            <div styleName="header">
              <Row>
                <Col size={6}>
                  <div styleName="breadcrumbs">
                    Все магазины / {category.label} / {location.label}
                  </div>
                </Col>
                <Col size={6}>
                  <div styleName="sort">
                    <div styleName="sortLabel">Сортировать по:</div>
                    <div styleName="sortSelect">
                      <MiniSelect
                        forSearch
                        activeItem={sortItem}
                        items={[
                          { id: '1', label: 'Цена (убывание)' },
                          { id: '2', label: 'Цена (возрастание)' },
                        ]}
                        onSelect={this.handleSort}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <div styleName="stores">
              {(stores && stores.length > 0) ?
                map(storesItem => storesItem.node, stores).map((store) => {
                  const name = find(propEq('lang', lang))(store.name).text;
                  const products = pathOr(null, ['baseProductsWithVariants', 'edges'], store);
                  const storeId = store.rawId;
                  const { productsCount } = store;
                  return (
                    <div key={storeId} styleName="store">
                      <Row key={store.rawId}>
                        <Col size={6}>
                          <div styleName="storeData">
                            <div styleName="storeLogo">
                              <div>
                                <img src={store.logo} alt="img" />
                              </div>
                            </div>
                            <div styleName="storeInfo">
                              <div styleName="storeName">{name}</div>
                              <div styleName="storeAdd">
                                <span>97,5% пол. отзывов</span>
                                <span styleName="productsCount">{productsCount} товаров</span>
                              </div>
                            </div>
                            <div styleName="storeElect">
                              <Icon type="heart" size="32" />
                            </div>
                          </div>
                        </Col>
                        <Col size={6}>
                          {products &&
                            <div styleName="productsData">
                              <div styleName="productsWrap">
                                {map(productsItem => productsItem.node, products).map((product) => {
                                  const photoMain = pathOr(null, ['product', 'photoMain'], head(product.variants));
                                  const productId = product.rawId;
                                  return (
                                    <Link key={productId} to={`/store/${storeId}/product/${productId}`} styleName="productFoto">
                                      <div styleName="productFotoWrap">
                                        <img src={photoMain} alt="img" />
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          }
                        </Col>
                      </Row>
                    </div>
                  );
                }) :
                <div>No stores found</div>
              }
            </div>
            {(stores && stores.length > 0) &&
              <div styleName="button">
                <Button
                  onClick={this.storesRefetch}
                  forLoad
                >
                  Загрузить
                </Button>
              </div>
            }
          </Col>
        </Row>
      </Container>
    );
  }
}

Stores.contextTypes = {
  environment: PropTypes.object.isRequired,
  currentUser: currentUserShape,
};

export default createRefetchContainer(
  Page(Stores),
  graphql`
    fragment Stores_findStore on StoresConnection {
      edges {
        node {
          id
          rawId
          name {
            lang
            text
          }
          logo
          cover
          slug
          shortDescription {
            lang
            text
          }
        }
      }
    }
  `,
  // Uncomment after the back
  // graphql`
  //   query Stores_edges_Query($input: SearchStoreInput!) {
  //     search {
  //       findStore(first: $first, after: $after, searchTerm: $input) {
  //         ...Stores_findStore
  //       }
  //     }
  //   }
  // `,
);
