// @flow strict

// $FlowIgnore
const setup = editor => {
  // set the editor font size
  editor.on('init', () => {
    /* eslint-disable no-param-reassign */
    editor.getBody().style.fontSize = '16px';
  });
};

export default setup;
