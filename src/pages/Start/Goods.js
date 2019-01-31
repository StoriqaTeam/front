// @flow

import React, { Component } from 'react';
import { map, take, length } from 'ramda';
import classNames from 'classnames';
import { routerShape, withRouter } from 'found';

import { CardProduct } from 'components/CardProduct';
import MediaQuery from 'libs/react-responsive';

import { Button } from 'components/common';

import './Goods.scss';

type ProductType = {
  rawId: number,
  store: {
    rawId: number,
  },
  name: Array<{
    lang: string,
    text: string,
  }>,
  currency: string,
  variants: {
    first: {
      rawId: number,
      discount: number,
      photoMain: string,
      cashback: number,
      price: number,
    },
  },
  rating: number,
};

type PropsType = {
  items: Array<ProductType>,
  title: string,
  seeAllUrl?: string,
  router: routerShape,
};

type StateType = {
  loadedPagesCount: number,
};

class Goods extends Component<PropsType, StateType> {
  state = {
    loadedPagesCount: 1,
  };

  loadMore = () => {
    this.setState(prevState => {
      if (prevState.loadedPagesCount < 3) {
        return { loadedPagesCount: prevState.loadedPagesCount + 1 };
      }
      return {};
    });
  };

  renderGoods = (count: number) => {
    const { items, seeAllUrl } = this.props;
    const { loadedPagesCount } = this.state;
    return (
      <div styleName="goods">
        <div styleName={classNames('section view')}>
          {map(
            good => (
              <div
                key={good.rawId}
                styleName="good"
                style={{ width: `${100 * 2 / count}%` }}
              >
                <CardProduct item={good} />
              </div>
            ),
            take(count * loadedPagesCount, this.props.items),
          )}
        </div>
        <div styleName="loadMoreButton">
          {loadedPagesCount < 3 &&
            loadedPagesCount < length(items) / count &&
            length(items) > count && (
              <Button big wireframe load onClick={this.loadMore}>
                Load more
              </Button>
            )}
          {seeAllUrl &&
            (loadedPagesCount > length(items) / count ||
              loadedPagesCount === 3) && (
              <Button
                big
                wireframe
                load
                onClick={() => {
                  this.props.router.push(this.props.seeAllUrl);
                }}
              >
                See all
              </Button>
            )}
        </div>
      </div>
    );
  };

  render() {
    const { items, title } = this.props;
    return (
      <div styleName="container">
        <div styleName="header">
          <div styleName="title">{title}</div>
        </div>
        <MediaQuery maxWidth={575}>
          <div styleName="nowrapGoods">
            {map(
              item => (
                <div key={item.rawId} styleName="good">
                  <CardProduct item={item} />
                </div>
              ),
              items,
            )}
          </div>
        </MediaQuery>
        <MediaQuery maxWidth={767} minWidth={576}>
          {this.renderGoods(4)}
        </MediaQuery>
        <MediaQuery maxWidth={991} minWidth={768}>
          {this.renderGoods(6)}
        </MediaQuery>
        <MediaQuery maxWidth={1199} minWidth={992}>
          {this.renderGoods(8)}
        </MediaQuery>
        <MediaQuery minWidth={1200}>{this.renderGoods(10)}</MediaQuery>
      </div>
    );
  }
}

export default withRouter(Goods);
