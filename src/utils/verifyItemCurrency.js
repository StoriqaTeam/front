// @flow strict
import {
  head,
  path,
  assocPath,
  ifElse,
  complement,
  identity,
  propEq,
} from 'ramda';

import { checkCurrencyType, getCookie } from 'utils';
import { COOKIE_FIAT_CURRENCY, COOKIE_CURRENCY } from 'constants';

import { ItemType } from 'components/CardProduct';

const setCurrency = (item: ItemType): ItemType => {
  const { node } = head(path(['products', 'edges'], item));
  const itemWithCurrency = assocPath(
    ['products', 'edges'],
    [
      {
        node: {
          ...node,
          price: node.customerPrice.price,
        },
      },
    ],
    item,
  );

  return {
    ...itemWithCurrency,
    currency: node.customerPrice.currency,
  };
};

const verifyItemCurrency = item => {
  const checkItemCurrency = (cookie: string) =>
    ifElse(complement(propEq('currency', cookie)), setCurrency, identity);

  const checkItemCurrencyType = currentItem =>
    checkCurrencyType(currentItem.currency) === 'fiat';

  return ifElse(
    checkItemCurrencyType,
    checkItemCurrency(getCookie(COOKIE_FIAT_CURRENCY)),
    checkItemCurrency(getCookie(COOKIE_CURRENCY)),
  )(item);
};

export default verifyItemCurrency;
