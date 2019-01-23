// @flow strict

import React from 'react';
import classNames from 'classnames';
import { map } from 'ramda';

import './Table.scss';

type PropsType = {
  minWidth: number,
  columns: Array<{
    id: number | string,
    title: string,
  }>,
  data: Array<{
    id: number | string,
    item: Array<{
      id: number | string,
      content: *,
      byContent?: boolean,
      align?: 'left' | 'right',
    }>,
  }>,
};

const Table = (props: PropsType) => {
  const { columns, data, minWidth } = props;
  return (
    <div styleName="container">
      <div styleName="wrap">
        <table style={{ minWidth: `${minWidth / 8}rem` }}>
          <thead>
            <tr>{map(item => <th key={item.id}>{item.title}</th>, columns)}</tr>
          </thead>
          <tbody>
            {map(
              item => (
                <tr key={item.id}>
                  {map(
                    tdItem => (
                      <td
                        key={tdItem.id}
                        styleName={classNames({
                          byContent: tdItem.byContent,
                        })}
                        style={{ textAlign: tdItem.align || 'left' }}
                      >
                        {tdItem.content}
                      </td>
                    ),
                    item.item,
                  )}
                </tr>
              ),
              data,
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
