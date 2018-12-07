// @flow strict

import React, { Component } from 'react';
import { range, map, addIndex, filter, flatten } from 'ramda';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import './Paginator.scss';

type StateType = {
  clickedItem: number,
};

type PropsType = {
  pagesCount: number,
  currentPage: number,
  onPageSelect: (pageNumber: number) => void,
  isLoading: boolean,
};

class Paginator extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      clickedItem: props.currentPage,
    };
  }

  handlePageSelect = (item: number) => {
    this.setState({ clickedItem: item }, () => {
      this.props.onPageSelect(item);
    });
  };

  render() {
    const { currentPage, pagesCount, isLoading } = this.props;
    const { clickedItem } = this.state;

    let items = range(1, pagesCount + 1);
    if (pagesCount > 4) {
      const cast = [
        1,
        2,
        3,
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
        pagesCount - 2,
        pagesCount - 1,
        pagesCount,
      ];
      // $FlowIgnore
      const mapIndexed = addIndex(filter);
      const filteredCast = mapIndexed(
        (item, idx) =>
          !((idx > 2 && item <= 3) || (idx < 8 && item >= pagesCount - 2)),
        cast,
      );

      let currentItem = 0;

      items = flatten(
        map(item => {
          // $FlowIgnore
          if (item - currentItem === 2) {
            currentItem = item;
            // $FlowIgnore
            return [item - 1, item];
          }
          // $FlowIgnore
          if (item - currentItem > 1) {
            currentItem = item;
            return ['...', item];
          }
          currentItem = item;
          return item;
        }, filteredCast),
      );
    }

    return (
      <div styleName="container">
        {pagesCount !== 0 &&
          currentPage !== 1 && (
            <button
              onClick={() => this.handlePageSelect(parseFloat(currentPage - 1))}
              disabled={isLoading}
            >
              <Icon type="prev" size={20} />
            </button>
          )}
        {this.props.pagesCount > 1 &&
          addIndex(map)((item, idx) => {
            if (item === '...') {
              return (
                <div key={idx} styleName="dots">
                  {item}
                </div>
              );
            }
            return (
              <button
                styleName={classNames('item', {
                  current: item === currentPage,
                  clicked:
                    item === clickedItem && isLoading && item !== currentPage,
                })}
                onClick={() => this.handlePageSelect(parseFloat(item))}
                disabled={isLoading || item === currentPage}
                key={idx}
              >
                {item}
              </button>
            );
            // $FlowIgnore
          }, items)}
        {pagesCount !== 0 &&
          currentPage !== pagesCount && (
            <button
              onClick={() => this.handlePageSelect(parseFloat(currentPage + 1))}
              disabled={isLoading}
            >
              <Icon type="next" size={20} />
            </button>
          )}
      </div>
    );
  }
}

export default Paginator;
