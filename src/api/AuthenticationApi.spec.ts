import { Session } from '@inrupt/solid-client-authn-browser';
import { BookmarkStore } from '../store/BookmarkStore';
import { AuthenticationApi } from './AuthenticationApi';
import { BookmarkApi } from './BookmarkApi';

describe('AuthenticationApi', () => {
  describe('login', () => {
    it('logs in against the configured provider url', async () => {
      // when I log in
      const login = jest.fn();
      const api = new AuthenticationApi(
        { info: { isLoggedIn: false }, login } as unknown as Session,
        'https://pod.provider.example'
      );
      await api.login();
      // then I can log in at that pod provider and am redirected to the current page after that
      expect(login).toHaveBeenCalledWith({
        oidcIssuer: 'https://pod.provider.example',
        redirectUrl: 'http://localhost/',
      });
    });

    it('login fails if provider url is not present yet', async () => {
      // when I try to log in
      const api = new AuthenticationApi(
        { info: { isLoggedIn: false } } as Session,
        undefined
      );
      // then I see this error
      await expect(() => api.login()).rejects.toEqual(
        new Error('No pod provider URL configured')
      );
    });
  });
  describe('logout', () => {
    it('logs out from current session', async () => {
      // when I log in
      const logout = jest.fn();
      const api = new AuthenticationApi(
        { info: { isLoggedIn: false }, logout } as unknown as Session,
        'https://pod.provider.example'
      );
      await api.logout();
      // then I can log in at that pod provider and am redirected to the current page after that
      expect(logout).toHaveBeenCalled();
    });
  });
});
