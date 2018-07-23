// @flow

import React from 'react';
import ReactDOM from 'react-dom';

import './StickyBar.scss';

const STICKY_THRESHOLD_REM = 90;

type StateType = {
  currentClass: 'sticky' | 'top' | 'bottom',
  sidebarWidth: ?number,
};

type PropsType = {
  children: any,
};

const STICKY_PADDING_TOP_REM = 2;
const STICKY_PADDING_BOTTOM_REM = 2;

class StickyBar extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.handleScroll = this.handleScrollEvent.bind(this);
    this.state = {
      currentClass: 'top',
      sidebarWidth: null,
    };
  }

  componentDidMount() {
    if (!window) return;
    window.addEventListener('scroll', this.handleScroll);
    this.setWidth();
  }

  componentWillUnmount() {
    if (!window) return;
    window.removeEventListener('scroll', this.handleScroll);
    if (this.dispose) {
      this.dispose();
    }
  }

  setWidth = () => {
    // eslint-disable-next-line
    const sidebarWidth = ReactDOM.findDOMNode(
      this.wrapperRef,
      // $FlowIgnore
    ).getBoundingClientRect().width;
    this.setState({ sidebarWidth });
  };

  setRef(ref: ?Object) {
    this.ref = ref;
  }

  setWrapperRef(ref: ?Object) {
    this.wrapperRef = ref;
  }

  dispose: Function;
  ref: ?{ className: string };
  wrapperRef: any;
  scrolling: boolean;
  handleScroll: () => void;
  scrolling = false;

  updateStickiness() {
    if (!window) return;
    if (!this.ref || !this.wrapperRef) return;
    const rem = parseFloat(
      window.getComputedStyle(document.documentElement).fontSize,
    );
    const offset = window.pageYOffset;
    // $FlowIgnoreMe
    const rect = this.ref.getBoundingClientRect();
    const height = rect.bottom - rect.top;
    const {
      top: viewTop,
      bottom: viewBottom,
      // $FlowIgnoreMe
    } = this.wrapperRef.getBoundingClientRect();
    if (viewBottom - viewTop < STICKY_THRESHOLD_REM * rem) {
      if (this.state.currentClass !== 'top') {
        this.setState({ currentClass: 'top' });
      }
      return;
    }
    const top = viewTop + (offset - STICKY_PADDING_TOP_REM * rem);
    const bottom =
      viewBottom +
      (offset - (STICKY_PADDING_TOP_REM + STICKY_PADDING_BOTTOM_REM) * rem);
    let currentClass = 'top';
    if (offset >= top) {
      currentClass = 'sticky';
    }
    if (offset + height >= bottom) {
      currentClass = 'bottom';
    }
    // $FlowIgnoreMe
    if (this.ref.className !== currentClass) {
      // $FlowIgnoreMe
      this.ref.className = currentClass;
    }
  }

  handleScrollEvent() {
    if (!this.scrolling) {
      window.requestAnimationFrame(() => {
        this.updateStickiness();
        this.scrolling = false;
      });
      this.scrolling = true;
    }
  }

  render() {
    const { children } = this.props;
    const { sidebarWidth } = this.state;
    return (
      <div styleName="wrapper" ref={ref => this.setWrapperRef(ref)}>
        <div
          className="top"
          ref={ref => this.setRef(ref)}
          style={{ width: sidebarWidth || '100%' }}
        >
          {children && children}
        </div>
      </div>
    );
  }
}

export default StickyBar;
