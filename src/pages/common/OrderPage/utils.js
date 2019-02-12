// @flow

const getStatusStringFromEnum = (orderStatus: string): string => {
  switch (orderStatus) {
    case 'NEW':
      return 'New';
    case 'PAYMENT_AWAITED':
      return 'Payment awaited';
    case 'TRANSACTION_PENDING':
      return 'Transaction pending';
    case 'PAID':
      return 'Paid';
    case 'IN_PROCESSING':
      return 'In processing';
    case 'CANCELLED':
      return 'Cancelled';
    case 'SENT':
      return 'Sent';
    case 'DELIVERED':
      return 'Delivered';
    case 'RECEIVED':
      return 'Received';
    case 'COMPLETE':
      return 'Complete';
    case 'AMOUNT_EXPIRED':
      return 'Amount expired';
    case 'DISPUTE':
      return 'Dispute';
    case 'NOT_PAID':
      return 'Not paid';
    case 'FAIL':
      return 'Fail';
    case 'INITIAL':
      return 'Initial';
    case 'DECLINED':
      return 'Declined';
    case 'CAPTURED':
      return 'Captured';
    case 'REFUND_NEEDED':
      return 'Refund needed';
    case 'REFUNDED':
      return 'Refunded';
    case 'PAID_TO_SELLER':
      return 'Paid to seller';
    case 'PAYMENT_TO_SELLER_NEEDED':
      return 'Payment to seller needed';
    default:
      return 'Undefined';
  }
};

const getEnumFromStatusString = (orderStatus: string): ?string => {
  switch (orderStatus) {
    case 'New':
      return 'NEW';
    case 'Payment awaited':
      return 'PAYMENT_AWAITED';
    case 'Transaction pending':
      return 'TRANSACTION_PENDING';
    case 'Paid':
      return 'PAID';
    case 'In processing':
      return 'IN_PROCESSING';
    case 'Cancelled':
      return 'CANCELLED';
    case 'Sent':
      return 'SENT';
    case 'Delivered':
      return 'DELIVERED';
    case 'Received':
      return 'RECEIVED';
    case 'Complete':
      return 'COMPLETE';
    case 'Amount expired':
      return 'AMOUNT_EXPIRED';
    case 'Dispute':
      return 'DISPUTE';
    case 'Not paid':
      return 'NOT_PAID';
    case 'Fail':
      return 'FAIL';
    case 'Initial':
      return 'INITIAL';
    case 'Declined':
      return 'DECLINED';
    case 'Captured':
      return 'CAPTURED';
    case 'Refund needed':
      return 'REFUND_NEEDED';
    case 'Refunded':
      return 'REFUNDED';
    case 'Paid to seller':
      return 'PAID_TO_SELLER';
    case 'Payment to seller needed':
      return 'PAYMENT_TO_SELLER_NEEDED';
    default:
      return null;
  }
};

export { getStatusStringFromEnum, getEnumFromStatusString };
