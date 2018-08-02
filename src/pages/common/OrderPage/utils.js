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
    default:
      return null;
  }
};

export { getStatusStringFromEnum, getEnumFromStatusString };
