// @flow strict

import { uploadFile } from 'utils';

const filePickerCallback = (onError: (error: { message: string }) => void) => (
  // $FlowIgnore
  cb,
  // $FlowIgnore
  value,
  // $FlowIgnore
  meta,
) => {
  if (meta.filetype === 'image') {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    input.onchange = function onchange() {
      const file = this.files[0];
      uploadFile(file)
        .then(result => {
          if (!result || result.url == null) {
            alert('Error :('); // eslint-disable-line
          }
          /* eslint-disable  promise/no-callback-in-promise */
          cb(result.url, { title: file.name });
          return result;
        })
        .finally(() => {})
        .catch(error => {
          onError(error);
        });
    };

    input.click();
  }
};

export default filePickerCallback;
