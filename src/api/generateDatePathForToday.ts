import { now } from './now';

export const generateDatePathForToday = (): string => {
  const today = now();
  const year = today.getFullYear();
  const month = stringifyWithLeadingZero(today.getMonth() + 1);
  const date = stringifyWithLeadingZero(today.getDate());
  return `/${year}/${month}/${date}`;
};

const stringifyWithLeadingZero = (number: number): string => {
  return ('0' + number).slice(-2);
};
