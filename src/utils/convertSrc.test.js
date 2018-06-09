import { convertSrc } from 'utils';

const img1 = 'https://s3.amazonaws.com/storiqa-dev/img-Ey3dmxt4YtAC.jpg';
const img2 = 'https://s3.amazonaws.com/storiqa-dev/img-Ey3dmxt4YtAC.png';

describe('convertSrc utils tests', () => {

  describe('convertSrc tests', () => {
    it('should return new src jpg string with small', () => {
      expect(convertSrc(img1, 'small')).toBe('https://s3.amazonaws.com/storiqa-dev/img-Ey3dmxt4YtAC-small.jpg');
    });
    it('should return new src jpg string with medium', () => {
      expect(convertSrc(img1, 'medium')).toBe('https://s3.amazonaws.com/storiqa-dev/img-Ey3dmxt4YtAC-medium.jpg');
    });
    it('should return new src png string with small', () => {
      expect(convertSrc(img2, 'small')).toBe('https://s3.amazonaws.com/storiqa-dev/img-Ey3dmxt4YtAC-small.png');
    });
    it('should return new src jpg string with medium', () => {
      expect(convertSrc(img2, 'medium')).toBe('https://s3.amazonaws.com/storiqa-dev/img-Ey3dmxt4YtAC-medium.png');
    });
    it('should return new empty src string', () => {
      expect(convertSrc('', 'small')).toBe('');
    });
    it('should return new empty src string', () => {
      expect(convertSrc('', 'medium')).toBe('');
    });
  });
});
