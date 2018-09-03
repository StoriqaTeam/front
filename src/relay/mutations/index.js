// @flow strict

export { default as basicMutation } from './basicMutation';
export { default as CreateUserMutation } from './CreateUserMutation';
export { default as GetJWTByEmailMutation } from './GetJWTByEmailMutation';
export {
  default as GetJWTByProviderMutation,
} from './GetJWTByProviderMutation';
export { default as UpdateUserMutation } from './UpdateUserMutation';
export { default as CreateStoreMutation } from './CreateStoreMutation';
export { default as UpdateStoreMutation } from './UpdateStoreMutation'; // contacts
export { default as UpdateStoreMainMutation } from './UpdateStoreMainMutation'; // main info
export {
  default as CreateBaseProductMutation,
} from './CreateBaseProductMutation';
export {
  default as UpdateBaseProductMutation,
} from './UpdateBaseProductMutation';
export {
  default as CreateProductWithAttributesMutation,
} from './CreateProductWithAttributesMutation';
export { default as UpdateProductMutation } from './UpdateProductMutation';
export { default as IncrementInCartMutation } from './IncrementInCartMutation';
export {
  default as SetQuantityInCartMutation,
} from './SetQuantityInCartMutation';
export {
  default as SetSelectionInCartMutation,
} from './SetSelectionInCartMutation';
export {
  default as SetCommentInCartMutation,
} from './SetCommentInCartMutation';
export { default as DeleteFromCartMutation } from './DeleteFromCartMutation';
export { default as VerifyEmailMutation } from './VerifyEmailMutation';
export {
  default as CreateUserDeliveryAddressMutation,
} from './CreateUserDeliveryAddressMutation';
export {
  default as DeleteUserDeliveryAddressMutation,
} from './DeleteUserDeliveryAddressMutation';
export {
  default as UpdateUserDeliveryAddressMutation,
} from './UpdateUserDeliveryAddressMutation';
export {
  default as CreateUserDeliveryAddressFullMutation,
} from './CreateUserDeliveryAddressFullMutation';
export { default as ChangePasswordMutation } from './ChangePasswordMutation';
export {
  default as DeactivateBaseProductMutation,
} from './DeactivateBaseProductMutation';
export { default as DeleteWizardMutation } from './DeleteWizardMutation';
export {
  default as DeactivateProductMutation,
} from './DeactivateProductMutation';
export { default as CancelOrderMutation } from './CancelOrderMutation';
export { default as SendOrderMutation } from './SendOrderMutation';
export { default as CreateOrdersMutation } from './CreateOrdersMutation';
export { default as CreateWarehouseMutation } from './CreateWarehouseMutation';
export { default as DeleteWarehouseMutation } from './DeleteWarehouseMutation';
export { default as UpdateWarehouseMutation } from './UpdateWarehouseMutation';
export {
  default as SetProductQuantityInWarehouseMutation,
} from './SetProductQuantityInWarehouseMutation';
export {
  default as RecalcInvoiceAmountMutation,
} from './RecalcInvoiceAmountMutation';
export {
  default as RequestPasswordResetMutation,
} from './RequestPasswordResetMutation';
export {
  default as ApplyPasswordResetMutation,
} from './ApplyPasswordResetMutation';
export {
  default as ResendEmailVerificationLinkMutation,
} from './ResendEmailVerificationLinkMutation';
