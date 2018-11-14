// @flow strict

import { Component } from 'react';
import type { Node } from 'react';

import type { ZoomEventType } from './types';

import { grabImage, calcPosition } from './utils';

type PropsType = {
  children: ({
    backgroundImage: string,
    backgroundPosition: string,
    onMouseMove: ZoomEventType => void,
    onTouchMove: ZoomEventType => void,
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

  setZoom = (evt: ZoomEventType): void => {
    this.setState({
      backgroundImage: grabImage(evt),
      backgroundPosition: calcPosition(evt),
    });
  };

  handleMouseMove = (evt: ZoomEventType): void => this.setZoom(evt);

  handleTouchMove = (evt: ZoomEventType): void => this.setZoom(evt);

  render() {
    const { backgroundImage, backgroundPosition } = this.state;
    return this.props.children({
      backgroundImage,
      backgroundPosition,
      onMouseMove: this.handleMouseMove,
      onTouchMove: this.handleTouchMove,
    });
  }
}

export default ImageZoom;
