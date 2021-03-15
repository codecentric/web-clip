import { useSolidApi } from '../api/apiContext';
import { SolidApi } from '../api/SolidApi';

jest.mock('../api/apiContext');

interface SolidApiMock {
  login: jest.Mock;
  bookmark: jest.Mock;
  loadProfile: jest.Mock;
}

export function mockSolidApi(): SolidApiMock {
  const solidApi: SolidApiMock = {
    login: jest.fn(),
    bookmark: jest.fn().mockResolvedValue(undefined),
    loadProfile: jest.fn().mockResolvedValue(undefined),
  };
  (useSolidApi as jest.Mock<SolidApi>).mockReturnValue(
    (solidApi as unknown) as SolidApi
  );
  return solidApi;
}
