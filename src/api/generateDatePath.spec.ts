import { generateDatePathForToday } from './generateDatePathForToday';
import { now } from './now';

jest.mock('./now');

describe('generateDatePathForToday', () => {
  it.each([
    ['2021-03-12', '/2021/03/12'],
    ['2021-12-03', '/2021/12/03'],
    ['2021-11-12', '/2021/11/12'],
    ['2021-03-01', '/2021/03/01'],
  ])(
    'for a given date %s it returns a path %s with the format year/month/date',
    (date: string, path: string) => {
      (now as jest.Mock).mockReturnValue(new Date(date));

      const result = generateDatePathForToday();

      expect(result).toEqual(path);
    }
  );
});
