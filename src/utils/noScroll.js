// @flow

let isOn = false;
let scrollbarSize;
let scrollTop;

const getScrollbarSize = () => {
  if (typeof scrollbarSize !== 'undefined') return scrollbarSize;

  const doc = document.documentElement;
  const dummyScroller = document.createElement('div');
  dummyScroller.setAttribute('style', 'width:99px;height:99px;position:absolute;top:-9999px;overflow:scroll;');
  doc.appendChild(dummyScroller);
  scrollbarSize = dummyScroller.offsetWidth - dummyScroller.clientWidth;
  doc.removeChild(dummyScroller);
  return scrollbarSize;
}

const hasScrollbar = () => {
  return document.documentElement.scrollHeight > window.innerHeight;
}

const on = () => {
  if (typeof document === 'undefined') return;
  const doc = document.documentElement;
  scrollTop = window.pageYOffset;
  if (hasScrollbar()) {
    doc.style.width = `calc(100% - ${getScrollbarSize()}px)`;
  } else {
    doc.style.width = '100%';
  }
  doc.style.position = 'fixed';
  doc.style.top = `${-scrollTop}px`;
  doc.style.overflow = 'hidden';
  isOn = true;
}

const off = () => {
  if (typeof document === 'undefined') return;
  const doc = document.documentElement;
  doc.style.width = '';
  doc.style.position = '';
  doc.style.top = '';
  doc.style.overflow = '';
  window.scroll(0, scrollTop);
  isOn = false;
}

const toggle = () => {
  if (isOn) {
    off();
    return;
  }
  on();
}

export default {
  getScrollbarSize,
  hasScrollbar,
  on,
  off,
  toggle,
};
