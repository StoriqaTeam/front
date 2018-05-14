import {
  filterVariantsBySelection,
  transformProductVariants,
  makeWidgetsFromVariants,
  groupWidgets,
  makeWidgets,
} from './makeWidgets';

import mockVariants from './mocks/mockVariants.json';
import expectedVariants from './mocks/expectedVariants.json';
import mockTransformedVariants from './mocks/mockTransformedVariants.json';
import mockGroupedWidgets from './mocks/mockGroupedWidgets.json';
import mockWidgets from './mocks/mockWidgets.json';
import expectedWidgets from './mocks/expectedWidgets.json';


describe('test makeWidgets helper functions', () => {
  const selections = [{id: 'c3RvcmVzfGF0dHJpYnV0ZXwx', value: '44'}];
  const emptySelections = [];
  describe('test filterVariantsBySelection', () => {
    test('it should have a length equal to 2 ', () => {
      expect(filterVariantsBySelection(selections)(mockVariants)).toHaveLength(2);
    });
    test('it should equal to the expected variants ', () => {
      expect(filterVariantsBySelection(selections)(mockVariants)).toEqual(expect.arrayContaining(expectedVariants));
    });
    describe('filterVariantsBySelection when empty selections', () => {
      test('it should return same variants array', () => {
        expect(filterVariantsBySelection(emptySelections)(mockVariants)).toEqual(expect.arrayContaining(mockVariants));
      });
      test('it should return same variants\'s length', () => {
        expect(filterVariantsBySelection(emptySelections)(mockVariants)).toHaveLength(mockVariants.length);
      });
    })
  });

  describe('test transformProductVariants', () => {
    test('it should return an array of TransformedVariantType ', () => {
      expect(transformProductVariants(mockVariants)).toEqual(expect.arrayContaining(mockTransformedVariants));
    });
  });

  describe('test groupWidgets', () => {
    test('it should return an object of GroupedWidgetsType ', () => {
      const transformedVariants = transformProductVariants(mockVariants);
      expect(groupWidgets(transformedVariants)).toEqual(mockGroupedWidgets);
    });
  });

  describe('test makeWidgetsFromVariants', () => {
    test('it should return an array of WidgetType ', () => {
      expect(makeWidgetsFromVariants(mockVariants)).toEqual(expect.arrayContaining(mockWidgets));
    });
  });

  describe('test makeWidgets', () => {
    test('it should return an array of WidgetType when selections are empty', () => {
      expect(makeWidgets(emptySelections)(mockVariants)).toEqual(expect.arrayContaining(mockWidgets));
    });
    test('it should return a filtered array of WidgetType based on selections', () => {
      expect(makeWidgets(selections)(mockVariants)).toEqual(expect.arrayContaining(expectedWidgets));
    });
  });

});
