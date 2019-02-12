// @flow strict
// $FlowIgnoreMe
import xss from 'xss';

const sanitizeHTML = (html: string): string =>
  xss(html, {
    whiteList: {
      a: ['class', 'style', 'href', 'target', 'rel'],
      p: ['class', 'style'],
      br: ['class', 'style'],
      hr: ['class', 'style'],
      ol: ['class', 'style'],
      h1: ['class', 'style'],
      h2: ['class', 'style'],
      h3: ['class', 'style'],
      h4: ['class', 'style'],
      h5: ['class', 'style'],
      h6: ['class', 'style'],
      ul: ['class', 'style'],
      li: ['class', 'style'],
      em: ['class', 'style'],
      img: ['class', 'style', 'src', 'sizes', 'srcset', 'width', 'height'],
      sub: ['class', 'style'],
      sup: ['class', 'style'],
      div: ['class', 'style'],
      span: ['class', 'style'],
      strong: ['class', 'style'],
      iframe: ['class', 'style', 'src', 'width', 'height', 'frameborder'],
      table: ['class', 'style'],
      tr: ['class', 'style'],
      td: ['class', 'style'],
      tbody: ['class', 'style'],
      thead: ['class', 'style'],
    },
  });

export default sanitizeHTML;
