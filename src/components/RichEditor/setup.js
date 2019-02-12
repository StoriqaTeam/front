// @flow strict

function addResponsive(el: HTMLElement): void {
  // $FlowIgnore
  const parent = el.parentNode.parentNode;
  // $FlowIgnore
  parent.classList.add('embed-responsive');
}

// $FlowIgnore
const setup = editor => {
  // set the editor font size
  editor.on('init', () => {
    /* eslint-disable no-param-reassign */
    editor.getBody().style.fontFamily =
      '"Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif';
    editor.getBody().style.fontSize = '16px';
    editor.getBody().style.color = '#505050';
  });
  // listen for toolbar buttons
  editor.on('ExecCommand', e => {
    // 'command' name of the toolbar clicked.
    const { command } = e;
    if (command === 'mceInsertContent') {
      // get editor's iframe area
      const iframeContainer = e.target.contentAreaContainer.firstChild;
      // access elements of an <iframe>
      const container = iframeContainer.contentWindow.document.body;
      // get all iframes that are current in the editor's content
      const iframes = container.querySelectorAll('iframe');
      // apply each iframe's parent the responsive class
      iframes.forEach(addResponsive);
    }
  });
};

export default setup;
