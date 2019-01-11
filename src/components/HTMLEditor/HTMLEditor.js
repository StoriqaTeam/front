// @flow strict

import React, { Component } from 'react';
import type { Node } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import { contains } from 'ramda';
import PluginDeepTable from 'slate-deep-table';

import Toolbar from './Toolbar';
import NodeVideo from './Nodes/NodeVideo';
import NodeColor from './Nodes/NodeColor';
import NodeBgColor from './Nodes/NodeBgColor';
import NodeImg from './Nodes/NodeImg';
import NodeAligned from './Nodes/NodeAligned';

import './HTMLEditor.scss';

import type { MarkType } from './types';

type PropsType = {
  //
  children: Node,
};

type StateType = {
  value: {},
  isReadonly: boolean,
};

type RenderType = {
  mark: string,
  node: string,
  attributes: {
    [string]: boolean,
  },
  isFocused: boolean,
};

const tablePlugin = PluginDeepTable();

const plugins = [tablePlugin];

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: '',
              },
            ],
          },
        ],
      },
    ],
  },
});

const schema = {
  blocks: {
    image: {
      isVoid: true,
    },
    video: {
      isVoid: true,
    },
  },
};

const DEFAULT_NODE = 'paragraph';

class HTMLEditor extends Component<PropsType, StateType> {
  state = {
    value: initialValue,
    isReadonly: false,
  };

  onChange = ({ value }) => {
    this.setState({ value });
  };

  onInsertTable = () => {
    this.onChange(this.editor.insertTable());
  };

  onInsertColumn = () => {
    this.onChange(this.editor.insertColumn());
  };

  onInsertRow = () => {
    this.onChange(this.editor.insertRow());
  };

  onRemoveColumn = () => {
    this.onChange(this.editor.removeColumn());
  };

  onRemoveRow = () => {
    this.onChange(this.editor.removeRow());
  };

  onRemoveTable = () => {
    this.onChange(this.editor.removeTable());
  };

  onToggleHeaders = () => {
    this.onChange(this.editor.toggleTableHeaders());
  };

  editor = null;

  isAlignBlockType = (blockType: MarkType): boolean =>
    contains(blockType, ['align_left', 'align_center', 'align_right']);

  hasLinks = () => {
    const { value } = this.state;
    return value.inlines.some(inline => inline.type === 'link');
  };

  /**
   * Check if the current selection has a mark with `type` in it.
   */
  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type === type);
  };

  /**
   * Check if the any of the currently selected blocks are of `type`.
   */
  hasBlock = type => {
    const { value } = this.state;
    return value.blocks.some(node => node.type === type);
  };

  handleMarkButtonClicked = (type: MarkType): void => {
    this.editor.toggleMark(type);
  };

  handleBlockButtonClicked = (blockType: MarkType) => {
    const isActive = this.state.value.blocks.some(
      node => node.type === blockType,
    );

    // // Handle everything but list buttons.
    

    if (blockType === 'table') {
      this.onChange(this.editor.insertTable());
      this.editor.insertBlock({
        type: 'paragraph',
      });
    } else if (blockType === 'video') {
      // eslint-disable-next-line
      const src = window.prompt('Enter the id(!) of the youtube video:');
      if (!src) return;
      this.editor.command((editor, _src, target) => {
        if (target) {
          editor.select(target);
        }

        editor
          .insertBlock({
            type: 'video',
            data: { video: `https://www.youtube.com/embed/${_src}` },
          })
          .insertBlock({
            type: 'paragraph',
          });
      }, src);
    } else if (blockType === 'image') {
      // eslint-disable-next-line
      const src = window.prompt('Enter the URL of the image:');
      if (!src) return;
      this.editor.command((editor, _src, target) => {
        if (target) {
          editor.select(target);
        }

        editor
          .insertBlock({
            type: 'image',
            data: { src: _src },
          })
          .insertBlock({
            type: 'paragraph',
          });
      }, src);
    } else if (blockType === 'link') {
      if (this.hasLinks()) {
        this.editor.command(editor => {
          editor.unwrapInline('link');
        });
      } else if (this.state.value.selection.isExpanded) {
        // eslint-disable-next-line
        const href = window.prompt('Enter the URL of the link:');

        if (href === null) {
          return;
        }

        this.editor.command((editor, _href) => {
          editor.wrapInline({
            type: 'link',
            data: { href: _href },
          });

          editor.moveToEnd();
        }, href);
      } else {
        // eslint-disable-next-line
        const href = window.prompt('Enter the URL of the link:');

        if (href === null) {
          return;
        }
        // eslint-disable-next-line
        const text = window.prompt('Enter the text for the link:');

        if (text === null) {
          return;
        }

        this.editor
          .insertText(text)
          .moveFocusBackward(text.length)
          .command((editor, _href) => {
            editor.wrapInline({
              type: 'link',
              data: { href: _href },
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
    } else if (blockType !== 'bulleted-list' && blockType !== 'numbered-list') {
  
      const isList = this.hasBlock('list-item');

      if (isList) {
        this.editor
          .setBlocks(isActive ? DEFAULT_NODE : blockType)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else {
        this.editor.setBlocks(isActive ? DEFAULT_NODE : blockType);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item');
      const isType = this.editor.value.blocks.some(block =>
        !!this.editor.value.document.getClosest(block.key, parent => parent.type === blockType)
      );

      if (isList && isType) {
        this.editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else if (isList) {
        this.editor
          .unwrapBlock(
            blockType === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(blockType);
      } else {
        this.editor.setBlocks('list-item').wrapBlock(blockType);
      }
    } /* else {
      this.editor.setBlocks(isActive ? 'paragraph' : blockType);
    } */
  }

  renderMark = (props: RenderType, editor, next) => {
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

  renderNode = (props: RenderType, editor, next) => {
    const { attributes, children, node, isFocused } = props;

    switch (node.type) {
      case 'paragraph':
        return <p {...attributes}>{children}</p>;
      case 'h1':
        return <h1 {...attributes}>{children}</h1>;
      case 'h2':
        return <h2 {...attributes}>{children}</h2>;
      case 'h3':
        return <h3 {...attributes}>{children}</h3>;
      case 'h4':
        return <h4 {...attributes}>{children}</h4>;
      case 'h5':
        return <h5 {...attributes}>{children}</h5>;
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      case 'align_left':
        return <NodeAligned {...props} align="left" />;
      case 'align_center':
        return <NodeAligned {...props} align="center" />;
      case 'align_right':
        return <NodeAligned {...props} align="right" />;
      case 'align_justify':
        return <NodeAligned {...props} align="justify" />;
      case 'link': {
        const { data } = node;
        const href = data.get('href');
        return (
          <a {...attributes} href={href}>
            {children}
          </a>
        );
      }
      case 'image': {
        const src = node.data.get('src');
        return <NodeImg {...props} src={src} selected={isFocused} />;
      }
      case 'video':
        return <NodeVideo {...props} />;
      default:
        return next();
    }
  };

  renderTableToolbar = () => (
    <div className="toolbar">
      <button style={{ margin: '0.5rem' }} onClick={this.onInsertColumn}>
        Insert Column
      </button>
      <button style={{ margin: '0.5rem' }} onClick={this.onInsertRow}>
        Insert Row
      </button>
      <button style={{ margin: '0.5rem' }} onClick={this.onRemoveColumn}>
        Remove Column
      </button>
      <button style={{ margin: '0.5rem' }} onClick={this.onRemoveRow}>
        Remove Row
      </button>
      <button style={{ margin: '0.5rem' }} onClick={this.onRemoveTable}>
        Remove Table
      </button>
    </div>
  );

  render() {
    const { value } = this.state;
    const isTable = this.editor && this.editor.isSelectionInTable(value);

    let toolbar = null;
    if (!this.state.isReadonly) {
      toolbar = isTable ? (
        this.renderTableToolbar()
      ) : (
        <Toolbar
          editorValue={this.state.value}
          onMarkButtonClick={this.handleMarkButtonClicked}
          onBlockButtonClick={this.handleBlockButtonClicked}
        />
      );
    }

    return (
      <div styleName="editor">
        <h3 styleName="title">
          <strong>Shop Editor</strong>
        </h3>
        {toolbar}
        <Editor
          autoFocus
          schema={schema}
          value={this.state.value}
          onChange={this.onChange}
          ref={ref => {
            this.editor = ref;
            if (ref) {
              this.submitChange = ref.change;
            }
          }}
          style={{
            border: '1px solid lightgray',
            height: '500px',
            padding: '2rem',
            overflowY: 'scroll',
          }}
          renderMark={this.renderMark}
          renderNode={this.renderNode}
          plugins={plugins}
          placeholder="Enter some text..."
          readOnly={this.state.isReadonly}
        />
        <button
          onClick={() => {
            const stringData = JSON.stringify(this.state.value.toJSON());
            localStorage.setItem('editor_data', stringData);
          }}
        >
          Save
        </button>
        <br />
        <button
          onClick={() => {
            const jsonData = JSON.parse(localStorage.getItem('editor_data'));
            this.onChange({
              value: Value.fromJSON(jsonData),
            });
          }}
        >
          Load
        </button>
        <br />
        <button
          onClick={() => {
            this.setState(prevState => ({
              isReadonly: !prevState.isReadonly,
            }));
          }}
        >
          Toggle readonly
        </button>
      </div>
    );
  }
}

export default HTMLEditor;
