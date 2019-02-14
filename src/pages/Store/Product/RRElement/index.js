// @flow strict

import React, { PureComponent } from 'react';
import { map, isEmpty } from 'ramda';

import './RRElement.scss';

type StateType = {
  data: Array<{
    productId: ?number,
    variantId: ?number,
  }>,
};

type PropsType = {
  //
};

class RRElement extends PureComponent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    if (process.env.BROWSER) {
      window.addEventListener('DOMNodeInserted', this.handleUpdateDOM);
    }

    this.state = {
      data: [],
    };
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      window.removeEventListener('DOMNodeInserted', this.handleUpdateDOM);
    }
  }

  rrNode: ?HTMLDivElement;

  handleUpdateDOM = () => {
    const { data } = this.state;
    if (this.rrNode && isEmpty(data)) {
      const fourChildNode = this.rrNode.getElementsByClassName(
        'retailrocket-item-info',
      );

      if (!isEmpty(fourChildNode)) {
        const newDdata = map(item => {
          const productMatch = item.href.match(/\/products\/(\d+)/i);
          const productId = productMatch ? parseInt(productMatch[1], 10) : null;
          const variantMatch = item.href.match(/\/variant\/(\d+)/i);
          const variantId = variantMatch ? parseInt(variantMatch[1], 10) : null;
          return { productId, variantId };
        }, fourChildNode);
        this.setState({ data: newDdata });
      }
    }
  };

  render() {
    console.log('---this.state.data', this.state.data);
    return (
      <div styleName="container">
        <div
          ref={node => {
            this.rrNode = node;
          }}
          styleName="rrBlock"
          data-retailrocket-markup-block="5c21e92d97a52846041b13d7"
          data-product-id="977"
        />
      </div>
    );
  }
}

export default RRElement;
