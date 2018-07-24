// @flow

import React, { Component } from 'react';

import { Page } from 'components/App';
import { Container } from 'layout';

import type { Node } from 'react';

import { StoreContext, StoreHeader } from './index';

type PropsType = {
  children: Node,
};

class Store extends Component<PropsType> {
  handleClick = () => {};
  render() {
    return (
      <StoreContext.Provider
        value={{
          logo:
            'https://vignette.wikia.nocookie.net/zimwiki/images/5/53/Irken_Invader_Logo_by_Danial79_%281%29.jpg/revision/latest?cb=20120611162935',
          image:
            'https://1256852360.rsc.cdn77.org/en/100593/air-jordan-1-mid-black-white-black.jpg',
        }}
      >
        <Container>
          <StoreHeader />
          {this.props.children}
        </Container>
      </StoreContext.Provider>
    );
  }
}

export default Page(Store, true);
