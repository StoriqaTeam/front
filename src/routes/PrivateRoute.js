// @flow

import { PureComponent, Children } from 'react';
import { pathOr } from 'ramda';
import { routerShape } from 'found';

import { currentUserShape } from 'utils/shapes';

type PropsType = {
  children: Children,
};

class PrivateRoute extends PureComponent<PropsType> {
  render() {
    if (!pathOr(false, ['currentUser', 'id'], this.context)) {
      this.context.router.push('/login');
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
