// @flow strict

import * as React from 'react';
import classNames from 'classnames';
import { map, addIndex, take, toPairs, findIndex, propEq, head, sortBy, prop, sort } from 'ramda';

import './Table.scss';

type PropsType = {
  columns: Array<string>,
  data: Array<*>,
};

class Tabs extends React.Component<PropsType> {
  render() {
    const { columns, data } = this.props;
    // const fields = map(item => item.field, columns);
    // console.log('---fields', fields);
    console.log('---columns, data', columns, data);
    return (
      <div styleName="container">
        <table>
          <thead>
          <tr>
            {map(item => (
              <th key={item}>{item}</th>
            ), columns)}
          </tr>
          </thead>
          <tbody>
            {map(item => (
              <tr>
                {map(tdItem => (
                  <td>
                    {console.log('---tdItem', tdItem)}
                    {tdItem}
                  </td>
                ), item)}
              </tr>
            ), data)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Tabs;
