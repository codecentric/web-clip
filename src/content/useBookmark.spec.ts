import { act, renderHook } from '@testing-library/react-hooks';
import { mockSolidApi, SolidApiMock } from '../test/solidApiMock';
import { useBookmark } from './useBookmark';
import { PageMetaData } from './usePage';

describe('useBookmark', () => {
  let solidApi: SolidApiMock;

  beforeEach(() => {
    jest.resetAllMocks();
    solidApi = mockSolidApi();
  });

  enum RenderCycle {
    INITIAL,
    DONE_LOADING,
    SAVING,
    DONE_SAVING,
  }

  describe('initial state', () => {
    beforeEach(() => {
      solidApi.loadBookmark.mockReturnValue(new Promise(() => null));
    });

    it('returns saving false', () => {
      const { result } = renderHook(() =>
        useBookmark({
          name: 'any',
          url: 'any',
          type: 'WebPage',
        })
      );
      expect(result.all[RenderCycle.INITIAL]).toMatchObject({
        saving: false,
      });
      expect(result.all).toHaveLength(1);
    });

    it('returns loading true', () => {
      const { result } = renderHook(() =>
        useBookmark({
          name: 'any',
          url: 'any',
          type: 'WebPage',
        })
      );
      expect(result.all[RenderCycle.INITIAL]).toMatchObject({
        loading: true,
      });
      expect(result.all).toHaveLength(1);
    });

    it('calls solid api to check for existing bookmark', async () => {
      const page: PageMetaData = { name: 'any', url: 'any', type: 'WebPage' };
      renderHook(() => useBookmark(page));
      expect(solidApi.loadBookmark).toHaveBeenCalledWith(page);
    });
  });

  describe('after checking for existing bookmark', () => {
    it('returns loading false', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useBookmark({
          name: 'any',
          url: 'any',
          type: 'WebPage',
        })
      );
      await waitForNextUpdate();
      expect(result.all[RenderCycle.DONE_LOADING]).toMatchObject({
        loading: false,
      });
      expect(result.all).toHaveLength(2);
    });

    it('returns the loaded bookmark if available', async () => {
      solidApi.loadBookmark.mockResolvedValue({ uri: 'any#it' });

      const { result, waitForNextUpdate } = renderHook(() =>
        useBookmark({
          name: 'any',
          url: 'any',
          type: 'WebPage',
        })
      );
      await waitForNextUpdate();
      expect(result.all[RenderCycle.DONE_LOADING]).toMatchObject({
        bookmark: { uri: 'any#it' },
      });
      expect(result.all).toHaveLength(2);
    });

    it('returns null when no bookmark is available', async () => {
      solidApi.loadBookmark.mockResolvedValue(null);

      const { result, waitForNextUpdate } = renderHook(() =>
        useBookmark({
          name: 'any',
          url: 'any',
          type: 'WebPage',
        })
      );
      await waitForNextUpdate();
      expect(result.all[RenderCycle.DONE_LOADING]).toMatchObject({
        bookmark: null,
      });
      expect(result.all).toHaveLength(2);
    });
  });

  describe('while bookmarking', () => {
    it('returns saving true', async () => {
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
      expect(result.all[RenderCycle.SAVING]).toMatchObject({
        saving: true,
      });
      expect(result.all).toHaveLength(4);
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
      expect(result.all[RenderCycle.DONE_SAVING]).toMatchObject({
        saving: false,
        error: null,
      });
      expect(result.all).toHaveLength(4);
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
      expect(result.all[RenderCycle.DONE_SAVING]).toMatchObject({
        bookmark: { uri: 'https://storage.example/bookmark#it' },
      });
      expect(result.all).toHaveLength(4);
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
    expect(result.all[RenderCycle.DONE_SAVING]).toMatchObject({
      saving: false,
      error: new Error('Pod not available'),
    });
    expect(result.all).toHaveLength(4);
  });
});
