// @flow strict

import React, { Component } from 'react';

import type { Node } from 'react';

import { Select } from 'components/common';

import MarkButton from './MarkButton';

import './Toolbar.scss';

import type { MarkType } from './types';

type TextStyleType = {
  id: string,
  label: string,
};

type PropsType = {
  onMarkButtonClick: (markType: MarkType) => void,
  onBlockButtonClick: (markType: MarkType) => void,
  editorValue: {
    blocks: Array<string>,
    activeMarks: Array<string>,
  },
};

type StateType = {
  textStyles: Array<TextStyleType>,
  selectedStyle: ?TextStyleType,
};

class Toolbar extends Component<PropsType, StateType> {
  state = {
    textStyles: [
      { id: 'paragraph', label: 'paragraph' },
      { id: 'h1', label: 'h1' },
      { id: 'h2', label: 'h2' },
      { id: 'h3', label: 'h3' },
      { id: 'h4', label: 'h4' },
      { id: 'h5', label: 'h5' },
    ],
    selectedStyle: null,
  };

  hasBlock = (blockType: MarkType): boolean => {
    const isActive = this.props.editorValue.blocks.some(
      node => node.type === blockType,
    );
    return isActive;
  };

  hasMark = (blockType: MarkType): boolean => {
    const isActive = this.props.editorValue.activeMarks.some(
      mark => mark.type === blockType,
    );
    return isActive;
  };

  handleSelect = (selectedStyle: TextStyleType): void => {
    const { onBlockButtonClick } = this.props;
    this.setState(
      {
        selectedStyle,
      },
      () => {
        onBlockButtonClick(selectedStyle.id);
      },
    );
  };

  renderMarkButton = (markType: MarkType, btnNode?: Node) => (
    <MarkButton
      active={this.hasMark(markType)}
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

  renderSelect = () => {
    const { selectedStyle, textStyles } = this.state;
    return (
      <Select
        label="text style"
        forForm
        activeItem={selectedStyle}
        items={textStyles}
        onSelect={this.handleSelect}
        tabIndexValue={0}
        dataTest="storeLangSelect"
        containerStyle={{
          display: 'block',
          width: '20rem',
          marginTop: 0,
          marginRight: '2.75rem',
        }}
      />
    );
  };

  render() {
    return (
      <div styleName="container">
        {this.renderSelect()}
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
        {/* {this.renderBlockButton('h1', <div>&nbsp;h1&nbsp;</div>)}
        {this.renderBlockButton('h2', <div>&nbsp;h2&nbsp;</div>)}
        {this.renderBlockButton('h3', <div>&nbsp;h3&nbsp;</div>)}
        {this.renderBlockButton('h4', <div>&nbsp;h4&nbsp;</div>)} */}
        {/* {this.renderMarkButton(
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
        )} */}
        {this.renderBlockButton('align_left')}
        {this.renderBlockButton('align_center')}
        {this.renderBlockButton('align_right')}
        {this.renderBlockButton('align_justify')}
        {this.renderBlockButton('bulleted_list')}
        {this.renderBlockButton('numbered_list')}
        {this.renderBlockButton('link')}
        {this.renderBlockButton('image')}
        {this.renderBlockButton('video')}
        {this.renderBlockButton('table')}
      </div>
    );
  }
}

export default Toolbar;
