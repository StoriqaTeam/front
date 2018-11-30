// @flow

import React, { Component, createRef } from 'react';

import { Icon } from 'components/Icon';

import './StringLoadMore.scss';

import t from './i18n';

type PropsType = {
  text: string,
};

type StateType = {
  isButton: boolean,
};

class StringLoadMore extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.container = createRef();
    this.text = createRef();

    this.state = {
      isButton: false,
    };
  }

  componentDidMount() {
    const containerEl = this.container.current;
    const textEl = this.text.current;

    const widthContainerEl = containerEl.getBoundingClientRect().width;
    const widthTextEl = textEl.getBoundingClientRect().width;

    if (widthContainerEl < widthTextEl) {
      textEl.style.display = 'block';
      textEl.style.width = '100%';
      textEl.style.overflow = 'hidden';
      textEl.style.textOverflow = 'ellipsis';
      this.setState({ isButton: true }); // eslint-disable-line
    }
  }

  container: any;
  text: any;

  handleOnClick = () => {
    const textEl = this.text.current;
    textEl.style.display = 'inline-block';
    textEl.style.width = 'auto';
    textEl.style.overflow = '';
    textEl.style.textOverflow = 'inherit';
    textEl.style.whiteSpace = 'normal';
    this.setState({ isButton: false });
  };

  render() {
    const { isButton } = this.state;
    return (
      <div styleName="container" ref={this.container}>
        <span styleName="text" ref={this.text}>
          {this.props.text}
        </span>
        {isButton && (
          <button styleName="button" onClick={this.handleOnClick}>
            <span styleName="buttonText">{t.readMore}</span>
            <Icon inline type="arrowExpand" />
          </button>
        )}
      </div>
    );
  }
}

export default StringLoadMore;
