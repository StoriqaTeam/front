// @flow

/**
 * @desc Gets and image's dimension from a remote url
 */
const getImageMeta = (
  url: string,
  isRem: boolean = false,
): Promise<{ height: string, width: string }> => {
  const img = new Image();
  return new Promise(resolve => {
    img.addEventListener('load', function loadImageHandler() {
      const { naturalHeight, naturalWidth } = this;
      const toRem = (val: number): string => `${val / 8}rem`;
      const height = isRem ? toRem(naturalHeight) : `${naturalHeight}`;
      const width = isRem ? toRem(naturalWidth) : `${naturalWidth}`;
      resolve({
        height,
        width,
      });
    });
    img.src = url;
  });
};

export default getImageMeta;
