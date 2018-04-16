import { findIndex, propEq } from 'ramda';

/* eslint-disable */
export default function filterVariants(variants, selected, variantId) {
  const widgets = variants.map((v) => {
    return {
      [selected.uiElement]: v[selected.uiElement].value,
      variantId: v.variantId,
    };
  });
  /* eslint-disable no-console */
  console.log('widgets', widgets);
  console.log('{ [selected.uiElement]: selected.label }', { [selected.uiElement]: selected.label });
  return findIndex(propEq(selected.uiElement, selected.label))(widgets);
}
