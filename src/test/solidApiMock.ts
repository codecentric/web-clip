import { useSolidApi } from '../api/apiContext';
import { SolidApi } from '../api/SolidApi';

jest.mock('../api/apiContext');

export function mockSolidApi() {
  const solidApi = ({
    login: jest.fn(),
    bookmark: jest.fn(),
  } as unknown) as SolidApi;
  (useSolidApi as jest.Mock<SolidApi>).mockReturnValue(solidApi);
  return solidApi;
}
