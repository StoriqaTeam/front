// @flow

const getStatusStringFromEnum = (orderStatus: string): string => {
  switch (orderStatus) {
    case 'NEW':
      return 'New';
    case 'CANCELLED':
      return 'Cancelled';
    case 'COMPLETE':
      return 'Completed';
    case 'DELIVERED':
      return 'Delivered';
    case 'IN_PROCESSING':
      return 'In process';
    case 'PAID':
      return 'Paid';
    case 'TRANSACTION_PENDING':
      return 'Transaction pending';
    case 'PAYMENT_AWAITED':
      return 'Wait for payment';
    case 'RECEIVED':
      return 'Received';
    case 'SENT':
      return 'Sent';
    default:
      return 'Undefined';
  }
};

const getEnumFromStatusString = (orderStatus: string): ?string => {
  switch (orderStatus) {
    case 'New':
      return 'NEW';
    case 'Cancelled':
      return 'CANCELLED';
    case 'Completed':
      return 'COMPLETE';
    case 'Delivered':
      return 'DELIVERED';
    case 'In process':
      return 'IN_PROCESSING';
    case 'Paid':
      return 'PAID';
    case 'Wait for payment':
      return 'PAYMENT_AWAITED';
    case 'Transaction pending':
      return 'TRANSACTION_PENDING';
    case 'Received':
      return 'RECEIVED';
    case 'Sent':
      return 'SENT';
    default:
      return null;
  }
};

export { getStatusStringFromEnum, getEnumFromStatusString };
