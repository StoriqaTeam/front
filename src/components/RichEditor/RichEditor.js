// @flow strict

import React, { Component, Fragment } from 'react';
// $FlowIgnore
import { Editor } from '@tinymce/tinymce-react';
import { isEmpty } from 'ramda';

import filePickerCallback from './filePickerCallback';

type PropsType = {
  onChange: string => void,
  onError: (error: { message: string }) => void,
  content: string,
};
/* eslint-disable no-unused-vars */
const menu = {
  // file: {title: 'File', items: 'newdocument'},
  edit: {
    title: 'Edit',
    items: 'undo redo | cut copy paste pastetext | selectall',
  },
  insert: { title: 'Insert', items: 'link media | template hr' },
  // view: {title: 'View', items: 'visualaid'},
  format: {
    title: 'Format',
    items:
      'bold italic underline strikethrough superscript subscript | removeformat',
  },
  table: {
    title: 'Table',
    items: 'inserttable tableprops deletetable | cell row column',
  },
  tools: { title: 'Tools', items: 'spellchecker code' },
};

const formats = {
  alignleft: {
    selector: 'p, h1, h2, h3, h4, h5, h6, td, th, div, ul, ol, li, table, img',
    classes: 'left',
  },
  aligncenter: {
    selector: 'p, h1, h2, h3, h4, h5, h6, td, th, div, ul, ol, li, table, img',
    classes: 'center',
  },
  alignright: {
    selector: 'p, h1, h2, h3, h4, h5, h6, td, th, div, ul, ol, li, table, img',
    classes: 'right',
  },
  alignjustify: {
    selector: 'p, h1, h2, h3, h4, h5, h6, td, th, div, ul, ol, li, table, img',
    classes: 'full',
  },
  bold: { inline: 'span', classes: 'bold' },
  italic: { inline: 'span', classes: 'italic' },
  underline: { inline: 'span', classes: 'underline', exact: true },
  strikethrough: { inline: 'del' },
  forecolor: {
    inline: 'span',
    classes: 'forecolor',
    styles: { color: '%value' },
  },
  hilitecolor: {
    inline: 'span',
    classes: 'hilitecolor',
    styles: { backgroundColor: '%value' },
  },
  custom_format: {
    block: 'h1',
    attributes: { title: 'Header' },
    styles: { color: 'red' },
  },
};

class RichEditor extends Component<PropsType> {
  static defaultProps = {
    onChange: () => {},
    onError: () => {},
  };
  // $FlowIgnore
  handleEditorChange = e => {
    const { onChange } = this.props;
    const html = e.target.getContent();
    onChange(html);
  };

  render() {
    const { content, onError } = this.props;
    return (
      <Fragment>
        <Editor
          apiKey="gk8doqf0fk35w9w8aad4ntw74keuwxza7u2ajewvqlt0up9z"
          initialValue={!isEmpty(content) ? content : '<p>Write something</p>'}
          onChange={this.handleEditorChange}
          init={{
            formats,
            menubar: false,
            branding: false,
            min_height: 400,
            plugins: 'textcolor colorpicker link image table media lists',
            preview_styles: 'font-size color',
            fontsize_formats: '10px 12px 14px 16px 18px 24px',
            toolbar:
              'undo redo | bold italic underline | styleselect | alignleft aligncenter alignright | numlist bullist | link image media | fontsizeselect forecolor | table',
            setup(editor) {
              // set the editor font size
              editor.on('init', () => {
                /* eslint-disable no-param-reassign */
                editor.getBody().style.fontSize = '16px';
              });
            },
            file_picker_types: 'image',

            file_picker_callback: filePickerCallback(onError),
          }}
        />
      </Fragment>
    );
  }
}

export default RichEditor;
