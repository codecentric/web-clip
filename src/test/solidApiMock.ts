export interface SolidApiMock {
  login: jest.Mock;
  bookmark: jest.Mock;
  loadProfile: jest.Mock;
  loadBookmark: jest.Mock;
}

export function mockSolidApi(): SolidApiMock {
  const solidApi: SolidApiMock = {
    login: jest.fn().mockResolvedValue(undefined),
    bookmark: jest.fn().mockResolvedValue(undefined),
    loadProfile: jest.fn().mockResolvedValue(undefined),
    loadBookmark: jest.fn().mockResolvedValue(undefined),
  };
  return solidApi;
}
