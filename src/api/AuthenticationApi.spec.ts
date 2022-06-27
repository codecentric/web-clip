import { Session } from '@inrupt/solid-client-authn-browser';
import { OptionsStorage } from '../options/OptionsStorage';
import { AuthenticationApi } from './AuthenticationApi';

describe('AuthenticationApi', () => {
  describe('login', () => {
    it('logs in against the configured provider url', async () => {
      // given a provider url has been configured
      const optionsStorage = {
        getOptions: jest.fn().mockReturnValue({
          providerUrl: 'https://pod.provider.example',
        }),
      } as unknown as OptionsStorage;
      const session = {
        info: { isLoggedIn: false },
        login: jest.fn(),
      } as unknown as Session;
      // when I log in
      const api = new AuthenticationApi(session, optionsStorage);
      await api.login();
      // then I can log in at that pod provider and am redirected to the current page after that
      expect(session.login).toHaveBeenCalledWith({
        oidcIssuer: 'https://pod.provider.example',
        redirectUrl: 'http://localhost/',
      });
    });

    it('login fails if provider url is not present yet', async () => {
      // given no provider url has been configured
      const optionsStorage = {
        getOptions: jest.fn().mockReturnValue({
          providerUrl: undefined,
        }),
      } as unknown as OptionsStorage;
      // when I try to log in
      const api = new AuthenticationApi(
        { info: { isLoggedIn: false } } as Session,
        optionsStorage
      );
      // then I see this error
      await expect(() => api.login()).rejects.toEqual(
        new Error('No pod provider URL configured')
      );
    });
  });
  describe('logout', () => {
    it('logs out from current session', async () => {
      // given I have a logged in session
      const optionsStorage = {
        getOptions: jest.fn().mockReturnValue({
          providerUrl: 'https://pod.provider.example',
        }),
      } as unknown as OptionsStorage;
      const session = {
        info: { isLoggedIn: true },
        logout: jest.fn(),
      } as unknown as Session;
      // when I log out
      const api = new AuthenticationApi(session, optionsStorage);
      await api.logout();
      // then I am logged out from my session
      expect(session.logout).toHaveBeenCalled();
    });
  });
});
