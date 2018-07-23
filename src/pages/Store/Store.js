// @flow

import React, { PureComponent } from 'react';

import { Page } from 'components/App';
import { Container } from 'layout';

import type { Node } from 'react';

import { StoreHeader } from './index';

type PropsType = {
  children: Node,
};

class Store extends PureComponent<PropsType> {
  render() {
    return (
      <Container>
        <StoreHeader
          logo="https://vignette.wikia.nocookie.net/zimwiki/images/5/53/Irken_Invader_Logo_by_Danial79_%281%29.jpg/revision/latest?cb=20120611162935"
          image="https://1256852360.rsc.cdn77.org/en/100593/air-jordan-1-mid-black-white-black.jpg"
        />
        {this.props.children}
      </Container>
    );
  }
}

export default Page(Store, true);
