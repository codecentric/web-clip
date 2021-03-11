import { useSolidApi } from '../api/apiContext';
import { Profile, SolidApi } from '../api/SolidApi';

jest.mock('../api/apiContext');

interface SolidApiMock {
  login: jest.Mock;
  bookmark: jest.Mock;
  getProfile: jest.Mock<Profile>;
}

export function mockSolidApi(): SolidApiMock {
  const solidApi: SolidApiMock = {
    login: jest.fn(),
    bookmark: jest.fn(),
    getProfile: jest.fn(),
  };
  (useSolidApi as jest.Mock<SolidApi>).mockReturnValue(
    (solidApi as unknown) as SolidApi
  );
  return solidApi;
}
