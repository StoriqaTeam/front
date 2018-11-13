// @flow strict

import { Component } from 'react';
import type { Node } from 'react';

import type { OnMouseMoveEventType } from './types';

import { grabImage, calcPosition } from './utils';

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
    this.setState({
      backgroundImage: grabImage(evt),
      backgroundPosition: calcPosition(evt),
    });
  };

  render() {
    const { backgroundImage, backgroundPosition } = this.state;
    return this.props.children({
      backgroundImage,
      backgroundPosition,
      onMouseMove: this.handleMouseMove,
    });
  }
}

export default ImageZoom;
