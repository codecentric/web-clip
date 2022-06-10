import { Session } from '@inrupt/solid-client-authn-browser';
import { renderHook, RenderResult } from '@testing-library/react-hooks';
import { when } from 'jest-when';
import { ExtensionUrl } from '../../chrome/urls';
import { MessageType } from '../../domain/messages';
import { ProfileApi } from '../../options/api/ProfileApi';
import { useSolidApis } from '../../options/useSolidApis';
import { sendMessage } from '../sendMessage';
import { useAuthorization } from './useAuthorization';

jest.mock('../../options/useSolidApis');
jest.mock('../sendMessage');

describe('useAuthorization', () => {
  let session: Session;
  let renderResult: RenderResult<ReturnType<typeof useAuthorization>>;

  describe('when not logged in', () => {
    beforeEach(() => {
      session = {
        info: {
          isLoggedIn: false,
        },
        login: jest.fn().mockResolvedValue(null),
      } as unknown as Session;
      const profileApi = {} as ProfileApi;
      when(useSolidApis).calledWith(session).mockReturnValue({ profileApi });

      const render = renderHook(() =>
        useAuthorization(
          session,
          'https://pod.test',
          new ExtensionUrl('chrome-extension://extension-id/')
        )
      );
      renderResult = render.result;
    });

    it('is loading initially', () => {
      expect(renderResult.all).toHaveLength(1);
      expect(renderResult.current.loading).toBe(true);
    });

    it('triggers login to provider url', () => {
      expect(session.login).toHaveBeenCalledWith({
        oidcIssuer: 'https://pod.test',
      });
    });
  });

  describe('when already logged in and granting access succeeds', () => {
    let profileApi: ProfileApi;
    beforeEach(async () => {
      session = {
        info: {
          isLoggedIn: true,
        },
        logout: jest.fn(),
        login: jest.fn(),
      } as unknown as Session;
      profileApi = {
        grantAccessTo: jest.fn().mockResolvedValue(null),
      } as unknown as ProfileApi;
      when(useSolidApis).calledWith(session).mockReturnValue({ profileApi });
      const render = renderHook(() =>
        useAuthorization(
          session,
          'https://pod.test',
          new ExtensionUrl('chrome-extension://extension-id/')
        )
      );
      await render.waitForNextUpdate();
      renderResult = render.result;
    });

    it('stops loading when finished', () => {
      expect(renderResult.all[0]).toMatchObject({ loading: true });
      expect(renderResult.current.loading).toBe(false);
    });

    it('does not trigger another login', () => {
      expect(session.login).not.toHaveBeenCalled();
    });

    it('grants permissions to the extension url', () => {
      expect(profileApi.grantAccessTo).toHaveBeenCalledWith(
        new ExtensionUrl('chrome-extension://extension-id/')
      );
    });

    it('indicates success', () => {
      expect(renderResult.current.success).toBe(true);
      expect(renderResult.current.error).toBe(null);
    });

    it('tells the option page that access has been granted', () => {
      expect(sendMessage).toHaveBeenCalledWith({
        type: MessageType.ACCESS_GRANTED,
      });
    });

    it('logs out', () => {
      expect(session.logout).toHaveBeenCalled();
    });
  });

  describe('when already logged in, but granting access fails', () => {
    let profileApi: ProfileApi;
    beforeEach(async () => {
      session = {
        info: {
          isLoggedIn: true,
        },
        logout: jest.fn(),
        login: jest.fn(),
      } as unknown as Session;
      profileApi = {
        grantAccessTo: jest
          .fn()
          .mockRejectedValue(new Error('granting access failed')),
      } as unknown as ProfileApi;
      when(useSolidApis).calledWith(session).mockReturnValue({ profileApi });
      const render = renderHook(() =>
        useAuthorization(
          session,
          'https://pod.test',
          new ExtensionUrl('chrome-extension://extension-id/')
        )
      );
      await render.waitForNextUpdate();
      renderResult = render.result;
    });

    it('stops loading when finished', () => {
      expect(renderResult.all[0]).toMatchObject({ loading: true });
      expect(renderResult.current.loading).toBe(false);
    });

    it('indicates error', () => {
      expect(renderResult.current.success).toBe(false);
      expect(renderResult.current.error).toEqual(
        new Error('granting access failed')
      );
    });

    it('logs out', () => {
      expect(session.logout).toHaveBeenCalled();
    });
  });
});
