// @flow

const getStatusStringFromEnum = (orderStatus: string): string => {
  switch (orderStatus) {
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
    case 'PAIMENT_AWAITED':
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
      return 'PAIMENT_AWAITED';
    case 'Received':
      return 'RECEIVED';
    case 'Sent':
      return 'SENT';
    default:
      return null;
  }
};

export { getStatusStringFromEnum, getEnumFromStatusString };
