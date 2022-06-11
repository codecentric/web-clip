import { act, renderHook } from '@testing-library/react-hooks';
import { when } from 'jest-when';
import { MessageType } from '../../domain/messages';
import { PageMetaData } from '../../domain/PageMetaData';
import { sendMessage } from '../messaging/sendMessage';
import { useBookmark } from './useBookmark';

jest.mock('../messaging/sendMessage');

describe('useBookmark', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  enum RenderCycle {
    INITIAL,
    DONE_LOADING,
    SAVING,
    DONE_SAVING,
  }

  describe('initial state', () => {
    beforeEach(() => {
      when(sendMessage).mockReturnValue(new Promise(() => null));
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

    it('sends message to check for existing bookmark', async () => {
      const page: PageMetaData = { name: 'any', url: 'any', type: 'WebPage' };
      renderHook(() => useBookmark(page));
      expect(sendMessage).toHaveBeenCalledWith({
        type: MessageType.LOAD_BOOKMARK,
        payload: {
          page,
        },
      });
    });
  });

  describe('after checking for existing bookmark', () => {
    it('returns loading false', async () => {
      const page: PageMetaData = {
        name: 'any',
        url: 'any',
        type: 'WebPage',
      };
      when(sendMessage)
        .calledWith({
          type: MessageType.LOAD_BOOKMARK,
          payload: {
            page,
          },
        })
        .mockResolvedValue({});
      const { result, waitForNextUpdate } = renderHook(() => useBookmark(page));
      await waitForNextUpdate();
      expect(result.all[RenderCycle.DONE_LOADING]).toMatchObject({
        loading: false,
      });
      expect(result.all).toHaveLength(2);
    });

    it('returns the loaded bookmark if available', async () => {
      const page: PageMetaData = {
        name: 'any',
        url: 'any',
        type: 'WebPage',
      };
      when(sendMessage)
        .calledWith({
          type: MessageType.LOAD_BOOKMARK,
          payload: {
            page,
          },
        })
        .mockResolvedValue({ uri: 'any#it' });

      const { result, waitForNextUpdate } = renderHook(() => useBookmark(page));
      await waitForNextUpdate();
      expect(result.all[RenderCycle.DONE_LOADING]).toMatchObject({
        bookmark: { uri: 'any#it' },
      });
      expect(result.all).toHaveLength(2);
    });

    it('returns null when no bookmark is available', async () => {
      const page: PageMetaData = {
        name: 'any',
        url: 'any',
        type: 'WebPage',
      };
      when(sendMessage)
        .calledWith({
          type: MessageType.LOAD_BOOKMARK,
          payload: {
            page,
          },
        })
        .mockResolvedValue(null);

      const { result, waitForNextUpdate } = renderHook(() => useBookmark(page));
      await waitForNextUpdate();
      expect(result.all[RenderCycle.DONE_LOADING]).toMatchObject({
        bookmark: null,
      });
      expect(result.all).toHaveLength(2);
    });

    it('returns an error after unsuccessful loading', async () => {
      const error = new Error('Unexpected error');
      const page: PageMetaData = {
        name: 'any',
        url: 'any',
        type: 'WebPage',
      };
      when(sendMessage)
        .calledWith({
          type: MessageType.LOAD_BOOKMARK,
          payload: {
            page,
          },
        })
        .mockRejectedValue(error);

      const { result, waitForNextUpdate } = renderHook(() => useBookmark(page));
      await waitForNextUpdate();
      expect(result.all[RenderCycle.DONE_LOADING]).toMatchObject({
        error,
      });
      expect(result.all).toHaveLength(2);
    });
  });

  describe('while bookmarking', () => {
    it('returns saving true', async () => {
      const page: PageMetaData = {
        name: 'any',
        url: 'any',
        type: 'WebPage',
      };
      when(sendMessage)
        .calledWith({
          type: MessageType.LOAD_BOOKMARK,
          payload: {
            page,
          },
        })
        .mockResolvedValue(null);
      when(sendMessage)
        .calledWith({
          type: MessageType.ADD_BOOKMARK,
          payload: {
            page,
          },
        })
        .mockResolvedValue(undefined);
      const { result } = renderHook(() => useBookmark(page));
      await act(async () => {
        await result.current.addBookmark();
      });
      expect(result.all[RenderCycle.SAVING]).toMatchObject({
        saving: true,
      });
      expect(result.all).toHaveLength(4);
    });

    it('calls solid api to create a bookmark', async () => {
      const page: PageMetaData = { name: 'any', url: 'any', type: 'WebPage' };

      when(sendMessage)
        .calledWith({
          type: MessageType.LOAD_BOOKMARK,
          payload: {
            page,
          },
        })
        .mockResolvedValue(undefined);
      when(sendMessage).mockResolvedValue(undefined);

      const { result, waitForNextUpdate } = renderHook(() => useBookmark(page));
      await waitForNextUpdate();
      await act(async () => {
        await result.current.addBookmark();
      });
      expect(sendMessage).toHaveBeenCalledWith({
        type: MessageType.ADD_BOOKMARK,
        payload: {
          page,
        },
      });
    });

    it('passes existing bookmark to solid api', async () => {
      const page: PageMetaData = { name: 'any', url: 'any', type: 'WebPage' };
      const existing = {
        uri: 'https://storage.example/existing/bookmark#it',
      };
      when(sendMessage)
        .calledWith({
          type: MessageType.LOAD_BOOKMARK,
          payload: {
            page,
          },
        })
        .mockResolvedValue(existing);
      when(sendMessage).mockResolvedValue(undefined);
      const { result, waitForNextUpdate } = renderHook(() => useBookmark(page));
      await waitForNextUpdate();
      await act(async () => {
        await result.current.addBookmark();
      });
      expect(sendMessage).toHaveBeenCalledWith({
        type: MessageType.ADD_BOOKMARK,
        payload: {
          page,
          bookmark: existing,
        },
      });
    });
  });

  describe('after successful bookmarking', () => {
    it('returns no error and stops saving indicator', async () => {
      const page: PageMetaData = {
        name: 'any',
        url: 'any',
        type: 'WebPage',
      };
      when(sendMessage)
        .calledWith({
          type: MessageType.LOAD_BOOKMARK,
          payload: {
            page,
          },
        })
        .mockResolvedValue(null);
      when(sendMessage)
        .calledWith({
          type: MessageType.ADD_BOOKMARK,
          payload: {
            page,
          },
        })
        .mockResolvedValue(undefined);
      const { result } = renderHook(() => useBookmark(page));
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
      const page: PageMetaData = {
        name: 'any',
        url: 'any',
        type: 'WebPage',
      };
      when(sendMessage)
        .calledWith({
          type: MessageType.LOAD_BOOKMARK,
          payload: {
            page,
          },
        })
        .mockResolvedValue(null);
      when(sendMessage)
        .calledWith({
          type: MessageType.ADD_BOOKMARK,
          payload: {
            page,
          },
        })
        .mockResolvedValue({
          uri: 'https://storage.example/bookmark#it',
        });

      const { result } = renderHook(() => useBookmark(page));
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
    const page: PageMetaData = {
      name: 'any',
      url: 'any',
      type: 'WebPage',
    };
    when(sendMessage)
      .calledWith({
        type: MessageType.LOAD_BOOKMARK,
        payload: {
          page,
        },
      })
      .mockResolvedValue(null);
    when(sendMessage)
      .calledWith({
        type: MessageType.ADD_BOOKMARK,
        payload: {
          page,
        },
      })
      .mockRejectedValue(new Error('Pod not available'));

    const { result } = renderHook(() => useBookmark(page));
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
