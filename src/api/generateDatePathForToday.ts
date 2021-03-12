import { today } from './today';

export const generateDatePathForToday = (): string => {
  const now = today();
  const year = now.getFullYear();
  const month = stringifyWithLeadingZero(now.getMonth() + 1);
  const date = stringifyWithLeadingZero(now.getDate());
  return `/${year}/${month}/${date}`;
};

const stringifyWithLeadingZero = (number: number): string => {
  return ('0' + number).slice(-2);
};
