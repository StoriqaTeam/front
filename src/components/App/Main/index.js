// @flow strict
import React, { PureComponent } from 'react';
import type { Node } from 'react';

import './Main.scss';

type PropsType = {
  children: Node,
};

class Main extends PureComponent<PropsType> {
  render() {
    return (
      <main styleName="container">
        <div styleName="wrap">{this.props.children}</div>
      </main>
    );
  }
}

export default Main;
