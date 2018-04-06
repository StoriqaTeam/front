// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { append } from 'ramda';

import { UploadWrapper } from 'components/Upload';
import { uploadFile } from 'utils';

import './Foto.scss';

type StateType = {
  items: Array<?string>,
};

class Characteristics extends Component<{}, StateType> {
  state = {
    items: [],
  };

  handleOnUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const result = await uploadFile(file);
    if (!result.url) return;
    this.setState({ items: append(result.url, this.state.items) });
  }

  render() {
    const { items } = this.state;
    return (
      <div styleName="container">
        <div styleName="upload">
          <UploadWrapper
            id="foods_foto"
            onUpload={this.handleOnUpload}
            buttonHeight={120}
            buttonWidth={120}
            buttonIconType="camera"
            buttonLabel="Добавить фото"
          />
        </div>
        {items && items.length > 0 &&
          <Fragment>
            {items.map(item => (
              <div
                key={item}
                styleName="item"
              >
                <div styleName="itemWrap">
                  <img
                    src={item}
                    alt="img"
                  />
                </div>
              </div>
            ))}
          </Fragment>
        }
      </div>
    );
  }
}

Characteristics.contextTypes = {
  directories: PropTypes.object,
};

export default Characteristics;
