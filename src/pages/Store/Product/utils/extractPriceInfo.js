import { isNil } from 'ramda';

type VariantPriceInfoType = {
  id: string,
  price: string,
  discount: string | null,
  cashback: string | null,
};

/**
 * @desc Applies the following formula (1 - discount) * price
 * @param {string} discount
 * @param {string} price
 * @return {string}
 */
const calcCrossedPrice = (discount: string | null, price: string) =>
  isNil(discount)
    ? '0'
    : ((1 - parseInt(discount, 10)) * parseInt(price, 10)).toString();

/**
 * @desc Extracts 'photoMain' and 'additionalPhotos'
 * @param {[]} array
 * @return {[]}
 */
export default function extractPriceInfo(array: Array<VariantPriceInfoType>) {
  return array.map(({ id, price, cashback, discount }) => ({
    id,
    price: price.toString(),
    cashback: isNil(cashback) ? '0' : cashback,
    crossedPrice: calcCrossedPrice(discount, price),
  }));
}
