import { forEach, whereEq } from 'ramda';

import { getNameText, flattenFunc, findCategory, urlToInput, inputToUrl, searchPathByParent } from 'utils';
import { renameKeys } from 'utils/ramda';

describe('search utils tests', () => {

  describe('getNameText tests', () => {
    it('should return text string by language', () => {
      expect(getNameText(translatedValues, 'EN')).toBe('hello');
    });
    it('should return text string by language', () => {
      expect(getNameText(translatedValues, 'RU')).toBe('привет');
    });
    it('should return EN text if lang not passed', () => {
      expect(getNameText(translatedValues)).toBe(null);
    });
    it('should return null if passing data incorect', () => {
      expect(getNameText({})).toBe(null);
    });
    it('should return null if no matches and EN lang is not exist', () => {
      // expect(getNameText(translatedValues2), 'BG').toBe(null);
    });
  });

  describe('flattenFunc function tests', () => {
    it('should return flatten array with all nested childrens', () => {
      expect(flattenFunc(rootCategoryChildren)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            rawId: 11,
          }),
        ]),
      );
    });
    it('should return array with length 10', () => {
      expect(flattenFunc(rootCategoryChildren).length).toEqual(10);
    });
  });

  describe('urlToInput util parse url query obj for search input', () => {
    it('should return input object: ', () => {
      expect(urlToInput(queryObj)).toEqual(inputByQueryObj);
    });
  });

  describe('inputToUrl util parse search input query to url string', () => {
    it('should return url string: ', () => {
      const resultStr = inputToUrl(inputByQueryObj);
      forEach(str => {
        expect(urlFromInput).toEqual(expect.stringContaining(str));
      }, resultStr.split('&'));
    });
  });

  describe('searchPathByParent util return array with categories path (for breadcrumbs)', () => {
    it('should return array of categories: ', () => {
      const result = searchPathByParent(flattenFunc(rootCategoryChildren), 9)
      forEach(id => {
        expect(result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              rawId: id,
            }),
          ]),
        );
      }, [1, 3, 9]);
    });
  });

  describe('search in category tree by predicate', () => {
    it('should return object with rawId === 9: ', () => {
      const result = findCategory(whereEq({ rawId: 9 }), rootCategory);
      expect(result).toEqual(
        expect.objectContaining({
          rawId: 9,
        }),
      );
    });
    it('should return null if no category founds: ', () => {
      const result = findCategory(whereEq({ rawId: 100 }), rootCategory);
      expect(result).toEqual(null);
    });
  });

});

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

const rootCategoryChildren = [
  {
    "rawId": 1,
    "children": [
      {
        "rawId": 3,
        "parentId": 1,
        "children": [
          {
            "rawId": 9,
            "parentId": 3,
          },
          {
            "rawId": 10,
            "parentId": 3,
          },
          {
            "rawId": 11,
            "parentId": 3,
          }
        ]
      },
      {
        "rawId": 25,
        "children": [
          {
            "rawId": 27,
            "parentId": 25,
          }
        ]
      }
    ]
  },
  {
    "rawId": 2,
    "children": [
      {
        "rawId": 7,
        "parentId": 2,
        "children": [
          {
            "rawId": 18,
            "parentId": 7,
          },
        ]
      },
    ]
  }
];

const rootCategory = {
  children: rootCategoryChildren,
}

const queryObj = {
  attrFilters: 'equal.1=44;equal.2=Tree;equal.3=Black;',
  category: '12',
  maxValue: '345345',
  minValue: '0',
  search: 'test',
  sortBy: 'PRICE_ASC',
};

const inputByQueryObj = {
  name: 'test',
  options: {
    categoryId: 12,
    priceFilter: {
      minValue: 0,
      maxValue: 345345,
    },
    sortBy: 'PRICE_ASC',
    attrFilters: [
      {
        id: 1,
        equal: {
          values: ['44'],
        },
      },
      {
        id: 2,
        equal: {
          values: ['Tree'],
        },
      },
      {
        id: 3,
        equal: {
          values: ['Black'],
        },
      },
    ],
  },
};

const urlFromInput = '?search=test&category=12&sortBy=PRICE_ASC&minValue=0&maxValue=345345&attrFilters=equal.1=44;equal.2=Tree;equal.3=Black;';
