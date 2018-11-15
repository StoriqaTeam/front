// @flow

import React, { Component } from 'react';
import { addIndex, map, length, splitEvery } from 'ramda';
import classNames from 'classnames';

import { Icon } from 'components/Icon';
import { CardProduct } from 'components/CardProduct';

import MediaQuery from 'libs/react-responsive';

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
};

type StateType = {
  viewNumber: number,
};

class Goods extends Component<PropsType, StateType> {
  state = {
    viewNumber: 0,
  };

  sectionsRef = null;

  handleView = (direction: string, count: number) => {
    const { items } = this.props;
    const blockQuantity = Math.trunc(length(items) / count - 1);
    this.setState((prevState: StateType) => {
      if (direction === 'prev' && prevState.viewNumber === 0) {
        return { viewNumber: blockQuantity };
      }
      if (direction === 'next' && prevState.viewNumber === blockQuantity) {
        return { viewNumber: 0 };
      }
      return {
        viewNumber:
          direction === 'prev'
            ? prevState.viewNumber - 1
            : prevState.viewNumber + 1,
      };
    });
  };

  renderGoods = (props: {
    nodeData: ?{ height: number },
    viewNumber: number,
    count: number,
  }) => {
    const { nodeData, viewNumber, count } = props;
    return (
      <div
        styleName="goods"
        style={{ minHeight: nodeData ? `${nodeData.height / 8}rem` : '88rem' }}
      >
        {addIndex(map)(
          (item, idx) => (
            <div
              ref={node => {
                if (idx === viewNumber) {
                  this.sectionsRef = node;
                }
              }}
              key={idx}
              styleName={classNames('section', { view: idx === viewNumber })}
            >
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
                item,
              )}
            </div>
          ),
          splitEvery(count, this.props.items),
        )}
      </div>
    );
  };

  renderNav = (count: number) => (
    <div styleName="nav">
      <button
        styleName="button"
        onClick={() => {
          this.handleView('prev', count);
        }}
      >
        <Icon type="prev" size={32} />
      </button>
      <button
        styleName="button"
        onClick={() => {
          this.handleView('next', count);
        }}
      >
        <Icon type="next" size={32} />
      </button>
    </div>
  );

  render() {
    const { title, items, seeAllUrl } = this.props;
    const { viewNumber } = this.state;
    let nodeData = null;
    if (this.sectionsRef) {
      const node = this.sectionsRef;
      nodeData = node.getBoundingClientRect();
    }
    return (
      <div styleName="container">
        <div styleName="header">
          <div styleName="title">{title}</div>
          <MediaQuery maxWidth={767} minWidth={576}>
            {this.renderNav(4)}
          </MediaQuery>
          <MediaQuery maxWidth={1199} minWidth={768}>
            {this.renderNav(6)}
          </MediaQuery>
          <MediaQuery minWidth={1200}>{this.renderNav(8)}</MediaQuery>
          {seeAllUrl && (
            <a styleName="reveal" href={seeAllUrl} data-test="seeAllLink">
              See all
            </a>
          )}
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
          {this.renderGoods({ nodeData, viewNumber, count: 4 })}
        </MediaQuery>
        <MediaQuery maxWidth={1199} minWidth={768}>
          {this.renderGoods({ nodeData, viewNumber, count: 6 })}
        </MediaQuery>
        <MediaQuery minWidth={1200}>
          {this.renderGoods({ nodeData, viewNumber, count: 8 })}
        </MediaQuery>
      </div>
    );
  }
}

export default Goods;
