// @flow strict

import React, { Component, Fragment } from 'react';
// $FlowIgnore
import { Editor } from '@tinymce/tinymce-react';
import { isEmpty } from 'ramda';

import setup from './setup';
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

class RichEditor extends Component<PropsType> {
  static defaultProps = {
    onChange: () => {},
    onError: () => {},
  };
  handleEditorChange = (text: string) => {
    const { onChange } = this.props;
    onChange(text);
  };

  render() {
    const { content, onError } = this.props;
    return (
      <Fragment>
        <Editor
          apiKey="gk8doqf0fk35w9w8aad4ntw74keuwxza7u2ajewvqlt0up9z"
          initialValue={!isEmpty(content) ? content : '<p>Write something</p>'}
          onEditorChange={this.handleEditorChange}
          init={{
            menubar: false,
            branding: false,
            min_height: 400,
            plugins: 'textcolor colorpicker link image table media lists',
            preview_styles: 'font-size color',
            fontsize_formats: '10px 12px 14px 16px 18px 24px',
            toolbar:
              'undo redo | bold italic underline | styleselect | alignleft aligncenter alignright | numlist bullist | link image media | fontsizeselect forecolor | table',
            setup,
            file_picker_types: 'image',

            file_picker_callback: filePickerCallback(onError),
          }}
        />
      </Fragment>
    );
  }
}

export default RichEditor;
