// @flow strict

export type OrderStatusType =
  | 'NEW'
  | 'PAYMENT_AWAITED'
  | 'TRANSACTION_PENDING'
  | 'AMOUNT_EXPIRED'
  | 'PAID'
  | 'IN_PROCESSING'
  | 'CANCELLED'
  | 'SENT'
  | 'DELIVERED'
  | 'RECEIVED'
  | 'DISPUTE'
  | 'COMPLETE';
