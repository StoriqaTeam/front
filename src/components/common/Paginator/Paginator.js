// @flow

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
        {map(
          item => (
            <button
              styleName={classNames('item', {
                current: item === this.props.currentPage,
              })}
              onClick={() => this.props.onPageSelect(item)}
            >
              {item}
            </button>
          ),
          range(1, this.props.pagesCount),
        )}
      </div>
    );
  }
}

export default Paginator;
