// @flow strict

import React, { PureComponent } from 'react';
import { range, map } from 'ramda';
import classNames from 'classnames';

import './Paginator.scss';

type PropsType = {
  pagesCount: number,
  currentPage: number,
  onPageSelect: (pageNumber: number) => void,
};

class Paginator extends PureComponent<PropsType> {
  render() {
    return (
      <div styleName="container">
        {this.props.pagesCount > 1 &&
          map(
            item => (
              <button
                styleName={classNames('item', {
                  current: item === this.props.currentPage,
                })}
                onClick={() => this.props.onPageSelect(item)}
                key={`orders-pagination-item-${item}`}
              >
                {item}
              </button>
            ),
            range(1, this.props.pagesCount + 1),
          )}
      </div>
    );
  }
}

export default Paginator;
