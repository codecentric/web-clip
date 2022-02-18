import { when } from 'jest-when';
import { Bookmark, SolidApi } from '../api/SolidApi';
import { PageMetaData } from '../content/usePage';
import { MessageType } from '../messages';
import { mockSolidApi, SolidApiMock } from '../test/solidApiMock';
import { MessageHandler } from './MessageHandler';

describe('MessageHandler', () => {
  let messageHandler: MessageHandler;
  let solidApi: SolidApiMock;
  beforeEach(() => {
    solidApi = mockSolidApi();
    messageHandler = new MessageHandler(solidApi as unknown as SolidApi);
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
});
