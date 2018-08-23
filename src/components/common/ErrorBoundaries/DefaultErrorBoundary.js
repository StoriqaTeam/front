// @flow

import React, { PureComponent } from 'react';
import { routerShape, withRouter } from 'found';

import { Error } from 'pages/Errors';

type PropsType = {
  router: routerShape,
};

class DefaultErrorBoundary extends PureComponent<PropsType> {
  componentDidMount() {
    this.props.router.push('/error');
  }
  render() {
    return <Error />;
  }
}

export default withRouter(DefaultErrorBoundary);
