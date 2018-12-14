import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, number, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

// import { Icon } from 'components/Icon';
import Paginator from './Paginator';

type StateType = { currentPage: number }

type PropsType = { pagesCount: number, isLoading: boolean }

class PaginatorContainer extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
      super(props);
      this.state = { currentPage: 1 }
    }
    
    func = (currentPage: number) => {
        this.setState({
            currentPage: currentPage,
        })
    }

    render() {
        return (
          <Paginator
            pagesCount={this.props.pagesCount}
            isLoading={this.props.isLoading}
            currentPage={this.state.currentPage}
            onPageSelect={pageNumber => this.func(pageNumber)}
           />
        )
    }   
}
  
const stories=storiesOf('Paginator', module);
stories.addDecorator(withKnobs);
stories
    .add('default', () => (
        <PaginatorContainer 
        isLoading={boolean('isLoading', false)}
        pagesCount={number('pagesCount', 10)}
        />
    ))




