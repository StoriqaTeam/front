// @flow strict

import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import { contains } from 'ramda';

import type { Node } from 'react';

import { log } from 'utils';

import Toolbar from './Toolbar';

type PropsType = {
  //
};

type StateType = {
  value: {},
};

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [],
      },
    ],
  },
});

type NodeColorType = 'gray' | 'blue' | 'pink';
const colorsHashMap = {
  gray: '#505050',
  blue: '#03A9FF',
  pink: '#FF62A4',
};
const NodeColor = props => {
  const { children, attributes } = props;
  return (
    <span {...attributes} style={{ color: colorsHashMap[props.color] }}>
      {children}
    </span>
  );
};

const NodeBgColor = props => {
  const { children, attributes } = props;
  return (
    <span
      {...attributes}
      style={{ backgroundColor: colorsHashMap[props.color] }}
    >
      {children}
    </span>
  );
};

const NodeAligned = props => {
  const { children, attributes } = props;
  return (
    <div
      style={{ display: 'flex', flex: 1, justifyContent: props.align }}
      {...attributes}
    >
      {children}
    </div>
  );
};

class HTMLEditor extends Component<PropsType, StateType> {
  state = {
    value: initialValue,
  };

  onChange = ({ value }) => {
    log.debug({ value });
    this.setState({ value });
  };

  editor = null;

  isAlignBlockType = (blockType: MarkType): boolean =>
    contains(blockType, ['align_left', 'align_center', 'align_right']);

  hasLinks = () => {
    const { value } = this.state;
    return value.inlines.some(inline => inline.type == 'link');
  };

  handleMarkButtonClicked = (type: MarkType) => {
    this.editor.toggleMark(type);
  };

  handleBlockButtonClicked = (blockType: MarkType) => {
    const isActive = this.state.value.blocks.some(
      node => node.type === blockType,
    );

    if (blockType === 'link') {
      if (this.hasLinks()) {
        this.editor.command(editor => {
          editor.unwrapInline('link');
        });
      } else if (this.state.value.selection.isExpanded) {
        const href = window.prompt('Enter the URL of the link:');

        if (href === null) {
          return;
        }

        this.editor.command((editor, href) => {
          editor.wrapInline({
            type: 'link',
            data: { href },
          });

          editor.moveToEnd();
        }, href);
      } else {
        const href = window.prompt('Enter the URL of the link:');

        if (href === null) {
          return;
        }

        const text = window.prompt('Enter the text for the link:');

        if (text === null) {
          return;
        }

        this.editor
          .insertText(text)
          .moveFocusBackward(text.length)
          .command((editor, href) => {
            editor.wrapInline({
              type: 'link',
              data: { href },
            });

            editor.moveToEnd();
          }, href);
      }
    } else if (this.isAlignBlockType(blockType)) {
      const isType = this.state.value.blocks.some(
        block =>
          !!this.state.value.document.getClosest(
            block.key,
            parent => parent.type === blockType,
          ),
      );
      if (isType) {
        this.editor
          .setBlocks('paragraph')
          .unwrapBlock('align_left')
          .unwrapBlock('align_center')
          .unwrapBlock('align_right');
      } else {
        this.editor.wrapBlock(blockType);
      }
    } else {
      this.editor.setBlocks(isActive ? 'paragraph' : blockType);
    }
  };

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case 'color_gray':
        return <NodeColor {...props} color="gray" />;
      case 'color_blue':
        return <NodeColor {...props} color="blue" />;
      case 'color_pink':
        return <NodeColor {...props} color="pink" />;
      case 'bg_color_gray':
        return <NodeBgColor {...props} color="gray" />;
      case 'bg_color_blue':
        return <NodeBgColor {...props} color="blue" />;
      case 'bg_color_pink':
        return <NodeBgColor {...props} color="pink" />;
      case 'bold':
        return <strong {...attributes}>{children}</strong>;
      case 'italic':
        return <em {...attributes}>{children}</em>;
      case 'underlined':
        return <u {...attributes}>{children}</u>;
      default:
        return next();
    }
  };

  renderNode = (props, editor, next) => {
    const { attributes, children, node } = props;

    switch (node.type) {
      case 'h1':
        return <h1 {...attributes}>{children}</h1>;
      case 'h2':
        return <h2 {...attributes}>{children}</h2>;
      case 'h3':
        return <h3 {...attributes}>{children}</h3>;
      case 'h4':
        return <h4 {...attributes}>{children}</h4>;
      case 'align_left':
        return <NodeAligned {...props} align="left" />;
      case 'align_center':
        return <NodeAligned {...props} align="center" />;
      case 'align_right':
        return <NodeAligned {...props} align="right" />;
      case 'link': {
        const { data } = node;
        const href = data.get('href');
        return (
          <a {...attributes} href={href}>
            {children}
          </a>
        );
      }
      default:
        return next();
    }
  };

  render() {
    return (
      <div>
        <Toolbar
          editorValue={this.state.value}
          onMarkButtonClick={this.handleMarkButtonClicked}
          onBlockButtonClick={this.handleBlockButtonClicked}
        />
        <Editor
          autoFocus
          value={this.state.value}
          onChange={this.onChange}
          ref={ref => {
            this.editor = ref;
          }}
          style={{
            border: '1px solid black',
            width: '500px',
            height: '300px',
            padding: '2rem',
          }}
          renderMark={this.renderMark}
          renderNode={this.renderNode}
        />
      </div>
    );
  }
}

export default HTMLEditor;
