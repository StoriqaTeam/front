// @flow

import { PureComponent } from 'react';
import type { Node } from 'react';
import { pathOr } from 'ramda';
import { routerShape } from 'found';

import { currentUserShape } from 'utils/shapes';

type PropsType = {
  children: Node,
};

class PrivateRoute extends PureComponent<PropsType> {
  render() {
    if (!pathOr(false, ['currentUser', 'id'], this.context)) {
      this.context.router.replace('/login');
      return null;
    }
    return this.props.children;
  }
}

PrivateRoute.contextTypes = {
  currentUser: currentUserShape,
  router: routerShape,
};

export default PrivateRoute;
