export interface BockmarkApiMock {
  bookmark: jest.Mock;
  loadProfile: jest.Mock;
  loadBookmark: jest.Mock;
}

export interface AuthenticationApiMock {
  logout: jest.Mock;
  login: jest.Mock;
}

export function mockBookmarkApi(): BockmarkApiMock {
  return {
    bookmark: jest.fn().mockResolvedValue(undefined),
    loadProfile: jest.fn().mockResolvedValue(undefined),
    loadBookmark: jest.fn().mockResolvedValue(undefined),
  };
}

export function mockAuthenticationApi(): AuthenticationApiMock {
  return {
    login: jest.fn().mockResolvedValue(undefined),
    logout: jest.fn().mockResolvedValue(undefined),
  };
}
