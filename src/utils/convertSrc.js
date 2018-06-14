// @flow

export default (src: ?string, size: 'small' | 'medium') =>
  (src || '').replace(/.(png|jpg)/, `-${size}.$1`);
