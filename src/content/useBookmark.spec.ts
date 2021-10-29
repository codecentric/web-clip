import { act, renderHook } from '@testing-library/react-hooks';
import { mockSolidApi } from '../test/solidApiMock';
import { useBookmark } from './useBookmark';
import { PageMetaData } from './usePage';

describe('useBookmark', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns saving false initially', () => {
    const { result } = renderHook(() =>
      useBookmark({
        name: 'any',
        url: 'any',
        type: 'WebPage',
      })
    );
    expect(result.all[0]).toMatchObject({
      saving: false,
    });
    expect(result.all).toHaveLength(1);
  });

  it('returns saving true while bookmarking', async () => {
    mockSolidApi();
    const { result } = renderHook(() =>
      useBookmark({
        name: 'any',
        url: 'any',
        type: 'WebPage',
      })
    );
    await act(async () => {
      await result.current.addBookmark();
    });
    expect(result.all[1]).toMatchObject({
      saving: true,
    });
    expect(result.all).toHaveLength(3);
  });

  it('calls solid api to create a bookmark', async () => {
    const solidApi = mockSolidApi();
    const page: PageMetaData = { name: 'any', url: 'any', type: 'WebPage' };
    const { result } = renderHook(() => useBookmark(page));
    await act(async () => {
      await result.current.addBookmark();
    });
    expect(solidApi.bookmark).toHaveBeenCalledWith(page);
  });

  describe('after successful bookmarking', () => {
    it('returns no error and stops saving indicator', async () => {
      mockSolidApi();
      const { result } = renderHook(() =>
        useBookmark({
          name: 'any',
          url: 'any',
          type: 'WebPage',
        })
      );
      await act(async () => {
        await result.current.addBookmark();
      });
      expect(result.all[2]).toMatchObject({
        saving: false,
        error: null,
      });
      expect(result.all).toHaveLength(3);
    });

    it('returns the saved bookmark', async () => {
      const mockApi = mockSolidApi();
      mockApi.bookmark.mockResolvedValue({
        uri: 'https://storage.example/bookmark#it',
      });
      const { result } = renderHook(() =>
        useBookmark({
          name: 'any',
          url: 'any',
          type: 'WebPage',
        })
      );
      await act(async () => {
        await result.current.addBookmark();
      });
      expect(result.all[2]).toMatchObject({
        bookmark: { uri: 'https://storage.example/bookmark#it' },
      });
      expect(result.all).toHaveLength(3);
    });
  });

  it('returns error and stops saving indicator after unsuccessful bookmarking', async () => {
    const solidApi = mockSolidApi();
    solidApi.bookmark.mockRejectedValue(new Error('Pod not available'));

    const { result } = renderHook(() =>
      useBookmark({
        name: 'any',
        url: 'any',
        type: 'WebPage',
      })
    );
    await act(async () => {
      await result.current.addBookmark();
    });
    expect(result.all[2]).toMatchObject({
      saving: false,
      error: new Error('Pod not available'),
    });
    expect(result.all).toHaveLength(3);
  });
});
