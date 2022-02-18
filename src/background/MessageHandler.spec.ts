import { when } from 'jest-when';
import { Bookmark, SolidApi } from '../api/SolidApi';
import { PageMetaData } from '../content/usePage';
import { MessageType } from '../messages';
import { Store } from '../store/Store';
import { mockSolidApi, SolidApiMock } from '../test/solidApiMock';
import { MessageHandler } from './MessageHandler';

describe('MessageHandler', () => {
  let messageHandler: MessageHandler;
  let solidApi: SolidApiMock;
  let store: Store;
  beforeEach(() => {
    solidApi = mockSolidApi();
    store = {
      importFromUrl: jest.fn(),
    } as undefined as Store;
    messageHandler = new MessageHandler(solidApi as unknown as SolidApi, store);
  });

  describe('handle type LOGIN', () => {
    it('calls login and returns undefined', async () => {
      const result = await messageHandler.handleMessage(
        {
          type: MessageType.LOGIN,
        },
        {}
      );
      expect(solidApi.login).toHaveBeenCalledWith();
      expect(result).toEqual({});
    });
  });

  describe('handle type LOAD_PROFILE', () => {
    it('calls loadProfile and returns result', async () => {
      solidApi.loadProfile.mockResolvedValue({
        name: 'Jane Doe',
      });

      const result = await messageHandler.handleMessage(
        {
          type: MessageType.LOAD_PROFILE,
        },
        {}
      );
      expect(solidApi.loadProfile).toHaveBeenCalled();
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
      when(solidApi.loadBookmark).calledWith(page).mockResolvedValue(bookmark);

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
      when(solidApi.bookmark)
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
