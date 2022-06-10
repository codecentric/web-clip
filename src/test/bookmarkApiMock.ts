export interface BookmarkApiMock {
  login: jest.Mock;
  bookmark: jest.Mock;
  loadProfile: jest.Mock;
  loadBookmark: jest.Mock;
}

export function mockBookmarkApi(): BookmarkApiMock {
  const api: BookmarkApiMock = {
    login: jest.fn().mockResolvedValue(undefined),
    bookmark: jest.fn().mockResolvedValue(undefined),
    loadProfile: jest.fn().mockResolvedValue(undefined),
    loadBookmark: jest.fn().mockResolvedValue(undefined),
  };
  return api;
}
