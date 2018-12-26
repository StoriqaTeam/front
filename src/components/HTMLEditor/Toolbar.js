// @flow strict

import React, { Component } from 'react';

import type { Node } from 'react';

import { log } from 'utils';

import MarkButton from './MarkButton';

export type MarkType =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'align_left'
  | 'align_center'
  | 'align_right'
  | 'image';

type PropsType = {
  onMarkButtonClick: (markType: MarkType) => void,
  onBlockButtonClick: (markType: MarkType) => void,
  editorValue: {},
};

class Toolbar extends Component<PropsType> {
  hasBlock = (blockType: MarkType): boolean => {
    const isActive = this.props.editorValue.blocks.some(
      node => node.type === blockType,
    );
    log.debug('hasBlock', isActive);
    return isActive;
  };

  hasMark = (blockType: MarkType): boolean => {
    const isActive = this.props.editorValue.activeMarks.some(
      mark => mark.type === blockType,
    );
    log.debug('hasMark', isActive);
    return isActive;
  };

  renderMarkButton = (markType: MarkType, btnNode?: Node) => (
    <MarkButton
      active={this.hasBlock(markType)}
      markType={markType}
      onClick={this.props.onMarkButtonClick}
      btnNode={btnNode}
    />
  );

  renderBlockButton = (markType: MarkType, btnNode?: Node) => (
    <MarkButton
      active={this.hasBlock(markType)}
      markType={markType}
      onClick={this.props.onBlockButtonClick}
      btnNode={btnNode}
    />
  );

  render() {
    return (
      <div>
        {this.renderMarkButton('bold')}
        {this.renderMarkButton('italic')}
        {this.renderMarkButton('underlined')}
        {this.renderMarkButton(
          'color_gray',
          <div
            style={{
              width: '2rem',
              height: '2rem',
              margin: '0.5rem',
              backgroundColor: '#505050',
            }}
          />,
        )}
        {this.renderMarkButton(
          'color_blue',
          <div
            style={{
              width: '2rem',
              height: '2rem',
              margin: '0.5rem',
              backgroundColor: '#03A9FF',
            }}
          />,
        )}
        {this.renderMarkButton(
          'color_pink',
          <div
            style={{
              width: '2rem',
              height: '2rem',
              margin: '0.5rem',
              backgroundColor: '#FF62A4',
            }}
          />,
        )}
        {this.renderBlockButton('h1', <div>&nbsp;h1&nbsp;</div>)}
        {this.renderBlockButton('h2', <div>&nbsp;h2&nbsp;</div>)}
        {this.renderBlockButton('h3', <div>&nbsp;h3&nbsp;</div>)}
        {this.renderBlockButton('h4', <div>&nbsp;h4&nbsp;</div>)}
        {this.renderMarkButton(
          'bg_color_gray',
          <div
            style={{
              width: '2rem',
              height: '2rem',
              margin: '0.5rem',
              backgroundColor: '#505050',
            }}
          />,
        )}
        {this.renderMarkButton(
          'bg_color_blue',
          <div
            style={{
              width: '2rem',
              height: '2rem',
              margin: '0.5rem',
              backgroundColor: '#03A9FF',
            }}
          />,
        )}
        {this.renderMarkButton(
          'bg_color_pink',
          <div
            style={{
              width: '2rem',
              height: '2rem',
              margin: '0.5rem',
              backgroundColor: '#FF62A4',
            }}
          />,
        )}
        {this.renderBlockButton('align_left')}
        {this.renderBlockButton('align_center')}
        {this.renderBlockButton('align_right')}
        {this.renderBlockButton('link')}
        {this.renderBlockButton('image')}
      </div>
    );
  }
}

export default Toolbar;
