// @flow

import React, { Component } from 'react';
import { map, take } from 'ramda';
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
  seeAllUrl: string,
  router: routerShape,
};

type StateType = {
  loadedPagesCount: number,
};

class Goods extends Component<PropsType, StateType> {
  state = {
    loadedPagesCount: 1,
  };

  sectionsRef = null;

  loadMore = () => {
    this.setState(prevState => {
      if (prevState.loadedPagesCount < 3) {
        return { loadedPagesCount: prevState.loadedPagesCount + 1 };
      }
      return {};
    });
  };

  renderGoods = (props: { nodeData: ?{ height: number }, count: number }) => {
    const { nodeData, count } = props;
    const { loadedPagesCount } = this.state;
    return (
      <div
        styleName="goods"
        style={{ minHeight: nodeData ? `${nodeData.height / 8}rem` : '88rem' }}
      >
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
          {loadedPagesCount < 3 && (
            <Button onClick={this.loadMore} load>
              Load more
            </Button>
          )}
          {loadedPagesCount === 3 && (
            <Button
              onClick={() => {
                this.props.router.push(this.props.seeAllUrl);
              }}
              load
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
    let nodeData = null;
    if (this.sectionsRef) {
      const node = this.sectionsRef;
      nodeData = node.getBoundingClientRect();
    }
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
          {this.renderGoods({ nodeData, count: 4 })}
        </MediaQuery>
        <MediaQuery maxWidth={1199} minWidth={768}>
          {this.renderGoods({ nodeData, count: 6 })}
        </MediaQuery>
        <MediaQuery minWidth={1200}>
          {this.renderGoods({ nodeData, count: 8 })}
        </MediaQuery>
      </div>
    );
  }
}

export default withRouter(Goods);
