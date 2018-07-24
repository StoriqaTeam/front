// @flow

const formatDate = (unFormattedDate: string): string => {
  const date = new Date(unFormattedDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${day}/${month}/${year}`;
};

export default formatDate;
