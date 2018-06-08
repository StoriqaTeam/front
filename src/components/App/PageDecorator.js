// @flow

import React, { PureComponent } from 'react';
import { pathOr } from 'ramda';

import { Header, Main, Footer, MobileMenu } from 'components/App';

import './Page.scss';

type PropsType = {
  me: ?{},
};

type StateType = {
  isMenuToggled: boolean,
};

export default (OriginalComponent: any, withoutCategories: ?boolean) =>
  class Page extends PureComponent<PropsType, StateType> {
    state = {
      isMenuToggled: false,
    };
    handleBurgerMenu = (): void => {
      const { isMenuToggled } = this.state;
      this.setState({ isMenuToggled: !isMenuToggled });
    }
    render() {
      const { isMenuToggled } = this.state;
      return (
        <div styleName="container">
          <MobileMenu
            isOpen={isMenuToggled}
            onClose={this.handleBurgerMenu}
          />
          <Header
            onBurgerMenu={this.handleBurgerMenu}
            user={this.props.me}
            searchValue={pathOr(
              '',
              ['match', 'location', 'query', 'search'],
              this.props,
            )}
          />
          <Main withoutCategories={withoutCategories}>
            <OriginalComponent {...this.props} />
          </Main>
          <Footer />
        </div>
      );
    }
  };
