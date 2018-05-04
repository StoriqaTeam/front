import { getNameText } from 'utils';

const translatedValues = [
  {
    text: 'hello',
    lang: 'EN',
  },
  {
    text: 'привет',
    lang: 'RU',
  },
];

const translatedValues2 = [
  {
    text: 'nihao',
    lang: 'CH',
  },
  {
    text: 'привет',
    lang: 'RU',
  },
];

describe('search utils tests', () => {

  describe('getNameText tests', () => {
    it('should return text string by language', () => {
      expect(getNameText(translatedValues, 'EN')).toBe('hello');
    });
    it('should return text string by language', () => {
      expect(getNameText(translatedValues, 'RU')).toBe('привет');
    });
    it('should return EN text if lang not passed', () => {
      expect(getNameText(translatedValues)).toBe('hello');
    });
    it('should return null if passing data incorect', () => {
      expect(getNameText({})).toBe(null);
    });
    it('should return null if no matches and EN lang is not exist', () => {
      expect(getNameText(translatedValues2), 'BG').toBe(null);
    });
  });

});
