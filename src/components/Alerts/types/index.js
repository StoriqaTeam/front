// @flow strict

export type AlertType = 'default' | 'success' | 'warning' | 'danger';

export type AlertPropsType = {
  createdAtTimestamp: number,
  type: AlertType,
  text: string,
  link: { text: string, path?: string },
  onClose: (timestamp: number) => void,
  onClick?: () => void,
  isStatic?: boolean,
  longText?: boolean,
};
