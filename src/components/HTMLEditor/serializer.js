/* eslint-disable */
import React from 'react';
import Html from 'slate-html-serializer';

const BLOCK_TAGS = {
  p: 'paragraph',
  a: 'link',
  li: 'list-item',
  ul: 'bulleted_list',
  ol: 'numbered_list',
  blockquote: 'quote',
  pre: 'code',
  h1: 'heading-one',
  h2: 'heading-two',
  h3: 'heading-three',
  h4: 'heading-four',
  h5: 'heading-five',
  h6: 'heading-six',
};

// Add a dictionary of mark tags.
const MARK_TAGS = {
  strong: 'bold',
  em: 'italic',
  u: 'underlined',
  s: 'strikethrough',
  code: 'code',
  span: 'color',
};

const RULES = [
  {
    // Special case for links, to grab their href.
    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'a') {
        return {
          object: 'inline',
          type: 'link',
          nodes: next(el.childNodes),
          data: {
            href: el.getAttribute('href'),
          },
        };
      }
    },
    serialize(obj, children) {
      if (obj.object === 'inline') {
        switch (obj.type) {
          case 'link':
            const { data } = obj;
            const href = data.get('href');
            return <a href={href}>{children}</a>;
          default:
            return <span>{children}</span>;
        }
      }
    },
  },
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()];

      if (el.tagName.toLowerCase() === 'img') {
        return {
          object: 'block',
          type: 'image',
          nodes: next(el.childNodes),
          data: {
            src: el.getAttribute('src'),
          },
        };
      } else if (el.tagName.toLowerCase() === 'iframe') {
        return {
          object: 'block',
          type: 'video',
          nodes: next(el.childNodes),
          data: {
            video: el.getAttribute('src'),
          },
        };
      }

      if (type) {
        return {
          object: 'block',
          type: type,
          data: {
            className: el.getAttribute('class'),
            style: el.getAttribute('style'),
          },
          nodes: next(el.childNodes),
        };
      }
    },
    serialize(obj, children) {
      if (obj.object === 'block') {
        switch (obj.type) {
          case 'align_left':
            return <div style={{ textAlign: 'left' }}>{children}</div>;
          case 'align_center':
            return <div style={{ textAlign: 'center' }}>{children}</div>;
          case 'align_right':
            return <div style={{ textAlign: 'right' }}>{children}</div>;
          case 'align_justify':
            return <div style={{ textAlign: 'justify' }}>{children}</div>;
          case 'bulleted_list':
            return <ul>{children}</ul>;
          case 'numbered_list':
            return <ol>{children}</ol>;
          case 'list-item':
            return <li>{children}</li>;
          case 'image':
            const src = obj.data.get('src');
            return <img src={src} />;
          case 'video':
            const video = obj.data.get('video');
            return (
              <iframe
                id="ytplayer"
                type="text/html"
                width="640"
                height="360"
                src={video}
                frameBorder="0"
              />
            );
          case 'block-quote':
            return <blockquote>{children}</blockquote>;
          case 'code':
            return (
              <pre>
                <code>{children}</code>
              </pre>
            );
          case 'paragraph':
            return <p className={obj.data.get('className')}>{children}</p>;
          case 'quote':
            return <blockquote>{children}</blockquote>;
        }
      }
    },
  },
  // Add a new rule that handles marks...
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()];
      if (type) {
        return {
          object: 'mark',
          type: type,
          nodes: next(el.childNodes),
        };
      }
    },
    serialize(obj, children) {
      if (obj.object === 'mark') {
        switch (obj.type) {
          case 'bold':
            return <strong>{children}</strong>;
          case 'italic':
            return <em>{children}</em>;
          case 'code':
            return <code>{children}</code>;
          case 'underlined':
            return <u>{children}</u>;
        }
      }
    },
  },
];

const serializer = new Html({ rules: RULES });

export default serializer;
