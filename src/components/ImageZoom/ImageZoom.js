// @flow strict

import { Component } from 'react';
import type { Node } from 'react';

import type { OnMouseMoveEventType } from './types';

import { grabImage } from './utils';

type PropsType = {
  children: ({
    backgroundImage: string,
    backgroundPosition: string,
    onMouseMove: OnMouseMoveEventType => void,
  }) => Node,
};

type StateType = {
  backgroundImage: string,
  backgroundPosition: string,
};

class ImageZoom extends Component<PropsType, StateType> {
  state = {
    backgroundImage: '',
    backgroundPosition: '',
  };

  handleMouseMove = (evt: OnMouseMoveEventType): void => {
    const backgroundImage = grabImage(evt);
    const { currentTarget } = evt; 
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (evt.pageX - left) / width * 100;
    const y = (evt.pageY - top) / height * 100;
    this.setState({
      backgroundImage,
      backgroundPosition: `${x}% ${y}%`
    });
  }

  render() {
    const { 
      backgroundImage,
      backgroundPosition,
    } = this.state;
    return this.props.children({
      backgroundImage,
      backgroundPosition,
      onMouseMove: this.handleMouseMove,
    });
  }
}

export default ImageZoom;
