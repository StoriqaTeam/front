// @flow strict

import * as React from 'react';
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

class Tabs extends React.Component<PropsType> {
  render() {
    const { columns, data, minWidth } = this.props;
    return (
      <div styleName="container">
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
                        styleName={classNames({ byContent: tdItem.byContent })}
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
    );
  }
}

export default Tabs;
