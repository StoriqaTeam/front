// @flow

export default (src: ?string, size: 'small' | 'medium' | 'large') =>
  (src || '').replace(/.(png|jpg)/, `-${size}.$1`);
