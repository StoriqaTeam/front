// @flow strict

/* eslint-disable */

import * as React from 'react';

type PagePropsType = {
  isLoading: boolean,
  isError: boolean,
  isReady: boolean,
};

type PageStateType = {
  //
};

class PageComponent<P: PagePropsType, S: PageStateType> extends React.Component<
  P,
  S,
> {
  render() {
    return null;
  }
}

const withDirectories = <T: PagePropsType>(
  dirs: Array<string>,
  children: React.Component<T>,
): React.Component<T> => children;

// ---

type StateType = PageStateType & {
  //
};

type PropsType = PagePropsType & {
  //
};

class Index extends PageComponent<PropsType, StateType> {
  state = {
    //
  };

  loadingComponent: ?React.Element<*> = null;
  errorComponent: ?React.Element<*> = null;

  render() {
    if (this.props.isLoading) {
      return <div>load...</div>;
    }

    return null;
  }
}

export default withDirectories(['rates', 'categories'], Index);

/* eslint-enable */
