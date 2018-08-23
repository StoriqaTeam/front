import {
  filterVariantsBySelection,
  transformProductVariants,
  makeWidgetsFromVariants,
  groupWidgets,
  makeWidgets,
} from './makeWidgets';

import mock from '../__mocks/product_with_attrs'

describe('makeWidgetsFromVariants', () => {
  it('should compile widgets from variants', () => {
    const variants = mock.baseProduct.variants.all;
    const widgets = makeWidgetsFromVariants(variants);
    expect(widgets).toMatchObject([
      {
        id: "c3RvcmVzfGF0dHJpYnV0ZXwx",
        uiElement: 'CHECKBOX',
        title: 'Size',
        options: [
          { label: '44', image: 'https://s3.amazonaws.com/storiqa-dev/img-5RnehB403BYC.png' },
          { label: '48', image: null },
          { label: '50', image: 'https://s3.amazonaws.com/storiqa-dev/img-Ffg2S77A9x0C.png' },
          { label: '52', image: null },
        ],
      },
      {
        id: "c3RvcmVzfGF0dHJpYnV0ZXwy",
        uiElement: 'COMBOBOX',
        title: 'Material',
        options: [
          { label: 'Glass', image: 'https://s3.amazonaws.com/storiqa-dev/img-JPTLFLeKmhoC.png' },
          { label: 'Metal', image: 'https://s3.amazonaws.com/storiqa-dev/img-EIGokz0oXw8C.png' },
          { label: 'Tree', image: 'https://s3.amazonaws.com/storiqa-dev/img-SRZsRoV6ZmUC.png' },
        ],
      },
      {
        id: "c3RvcmVzfGF0dHJpYnV0ZXwz",
        uiElement: 'COLOR_PICKER',
        title: 'Colour',
        options: [
          { label: 'Black', image: 'https://s3.amazonaws.com/storiqa-dev/img-uoAmyuwr9JwC.png' },
          { label: 'Blue', image: 'https://s3.amazonaws.com/storiqa-dev/img-WKUiDH6lDc0C.png' },
          { label: 'Brown', image: 'https://s3.amazonaws.com/storiqa-dev/img-mh8OpzFxKTwC.png' },
          { label: 'Red', image: 'https://s3.amazonaws.com/storiqa-dev/img-7WNWXBIuEoYC.png' },
          
        ],
      }
    ]);
  })
})
