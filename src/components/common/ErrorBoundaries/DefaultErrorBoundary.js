// @flow

import React, { PureComponent } from 'react';
import { routerShape, withRouter } from 'found';

type PropsType = {
  router: routerShape,
};

class DefaultErrorBoundary extends PureComponent<PropsType> {
  componentDidMount() {
    this.props.router.push('/error');
  }
  render() {
    return <div>test</div>;
  }
}

export default withRouter(DefaultErrorBoundary);
