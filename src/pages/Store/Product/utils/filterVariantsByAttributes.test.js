import filterVariantsByAttributes from './filterVariantsByAttributes';
import makeWidgets from './makeWidgets';

import mock from '../__mocks/product_with_attrs';
import variantsWithSize44 from './mocks/variantsWithSize44';

const variants = mock.baseProduct.variants.all;

describe('filterVariantsByAttributes', () => {
  it('should return all variants if selectedAttrs is empty', () => {
    const selectedAttributes = {};
    const filteredVariants = filterVariantsByAttributes(selectedAttributes, variants);
    expect(filteredVariants).toEqual(variants);
  });

  it('should return variants only with given attributes', () => {
    const selectedAttribute = {
      c3RvcmVzfGF0dHJpYnV0ZXwx: '44',
    };
    const selectedAttributes = {
      c3RvcmVzfGF0dHJpYnV0ZXwx: '44',
      c3RvcmVzfGF0dHJpYnV0ZXwy: 'Glass',
    };
    const filteredVariants = filterVariantsByAttributes(selectedAttribute, variants);
    const filteredVariants2 = filterVariantsByAttributes(selectedAttributes, variants);
    expect(filteredVariants).toMatchObject(variantsWithSize44);
    expect(filteredVariants2).toMatchObject([variantsWithSize44[0]]);
  });
})