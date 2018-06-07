import React, { PureComponent } from 'react';

import { log } from 'utils';

import './Colors.scss';

import colors from './colors.json';

class Colors extends PureComponent {
  handleCopy = event => {
    const el = event.target;
    el.addEventListener("copy", e => {
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.setData("text/plain", el.id);
        log.info('copied: ', e.clipboardData.getData("text"));
      }
    });
    document.execCommand("copy");
  }

  render() {
    return (
      <div styleName="container">
        {colors.map(item => (
          <div key={item.var} styleName="item">
            <div styleName="var">
              <strong>{item.var}</strong>
            </div>
            <div styleName="info">
              <div
                styleName="box"
                id={item.var}
                style={{
                  backgroundColor: item.code,
                  border: `1px solid ${
                    item.code === '#FFFFFF' || item.code === '#FAFAFA' ? '#CCCCCC' : item.code
                  }`,
                }}
                onClick={this.handleCopy}
                onKeyDown={() => {}}
                role="button"
                tabIndex="0"
              />
              <div styleName="desc">
                <div styleName="name">{item.name}</div>
                <div styleName="code">{item.code}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Colors;
