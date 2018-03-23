// @flow

import { PureComponent, cloneElement } from 'react';
import { pathOr, assocPath, omit } from 'ramda';
import { routerShape } from 'found';

import { currentUserShape } from 'utils/shapes';

type PropsType = {
  children: any,
  route: Object,
};

class PrivateRoute extends PureComponent<PropsType> {
  render() {
    if (!pathOr(false, ['currentUser', 'id'], this.context)) {
      this.context.router.go('/login');
      return null;
    }
    const patchedProps = assocPath(['match', 'route'], this.props.route, omit(['me'], this.props));
    return cloneElement(this.props.children, { ...patchedProps });
  }
}

PrivateRoute.contextTypes = {
  currentUser: currentUserShape,
  router: routerShape,
};

export default PrivateRoute;
