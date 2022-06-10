import { when } from 'jest-when';
import { BookmarkApi } from '../api/BookmarkApi';
import { Bookmark } from '../domain/Bookmark';
import { MessageType } from '../domain/messages';
import { PageMetaData } from '../domain/PageMetaData';
import { BookmarkStore } from '../store/BookmarkStore';
import { mockBookmarkApi, BookmarkApiMock } from '../test/bookmarkApiMock';
import { MessageHandler } from './MessageHandler';
import { openOptionsPage } from './openOptionsPage';

jest.mock('./openOptionsPage');

describe('MessageHandler', () => {
  let messageHandler: MessageHandler;
  let bookmarkApi: BookmarkApiMock;
  let store: BookmarkStore;
  beforeEach(() => {
    bookmarkApi = mockBookmarkApi();
    store = {
      importFromUrl: jest.fn().mockResolvedValue(null),
    } as undefined as BookmarkStore;
    messageHandler = new MessageHandler(
      bookmarkApi as unknown as BookmarkApi,
      store
    );
  });

  describe('handle unknown types', () => {
    it('returns false synchronously', async () => {
      const result = messageHandler.handleMessage(
        {
          type: MessageType.ACCESS_GRANTED,
        },
        {}
      );
      expect(result).toEqual(false);
    });
  });

  describe('handle type OPEN_OPTIONS', () => {
    it('calls openOptionsPage and returns nothing', async () => {
      const result = await messageHandler.handleMessage(
        {
          type: MessageType.OPEN_OPTIONS,
        },
        {}
      );
      expect(openOptionsPage).toHaveBeenCalledWith();
      expect(result).toEqual({});
    });
  });

  describe('handle type LOGIN', () => {
    it('calls login and returns nothing', async () => {
      const result = await messageHandler.handleMessage(
        {
          type: MessageType.LOGIN,
        },
        {}
      );
      expect(bookmarkApi.login).toHaveBeenCalledWith();
      expect(result).toEqual({});
    });
  });

  describe('handle type LOAD_PROFILE', () => {
    it('calls loadProfile and returns result', async () => {
      bookmarkApi.loadProfile.mockResolvedValue({
        name: 'Jane Doe',
      });

      const result = await messageHandler.handleMessage(
        {
          type: MessageType.LOAD_PROFILE,
        },
        {}
      );
      expect(bookmarkApi.loadProfile).toHaveBeenCalled();
      expect(result).toEqual({
        payload: {
          name: 'Jane Doe',
        },
      });
    });
  });

  describe('handle type LOAD_BOOKMARK', () => {
    it('calls loadBookmark and returns result', async () => {
      const page: PageMetaData = {
        type: 'WebPage',
        name: 'test page',
        url: 'https://page.example',
      };
      const bookmark: Bookmark = {
        uri: 'https://pod.example/bookmark#it',
      };
      when(bookmarkApi.loadBookmark)
        .calledWith(page)
        .mockResolvedValue(bookmark);

      const result = await messageHandler.handleMessage(
        {
          type: MessageType.LOAD_BOOKMARK,
          payload: {
            page,
          },
        },
        {}
      );
      expect(result).toEqual({
        payload: bookmark,
      });
    });
  });

  describe('handle type ADD_BOOKMARK', () => {
    it('calls bookmark and returns result', async () => {
      const page: PageMetaData = {
        type: 'WebPage',
        name: 'test page',
        url: 'https://page.example',
      };
      const bookmark: Bookmark = {
        uri: 'https://pod.example/bookmark#it',
      };
      when(bookmarkApi.bookmark)
        .calledWith(page, bookmark)
        .mockResolvedValue(bookmark);

      const result = await messageHandler.handleMessage(
        {
          type: MessageType.ADD_BOOKMARK,
          payload: {
            page,
            bookmark,
          },
        },
        {}
      );
      expect(result).toEqual({
        payload: bookmark,
      });
    });
  });

  describe('handle type IMPORT_PAGE_DATA', () => {
    it('calls import page data and returns result', async () => {
      const result = await messageHandler.handleMessage(
        {
          type: MessageType.IMPORT_PAGE_DATA,
          payload: {
            url: 'https://page.example',
          },
        },
        {}
      );
      expect(store.importFromUrl).toHaveBeenCalledWith('https://page.example');
      expect(result).toEqual({});
    });
  });
});
