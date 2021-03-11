import {
  login,
  fetch as authenticatedFetch,
} from '@inrupt/solid-client-authn-browser';
import { SessionInfo, SolidApi } from './SolidApi';

jest.mock('@inrupt/solid-client-authn-browser');

describe('SolidApi', () => {
  describe('login', () => {
    it('logs the user in and fetches their profile', async () => {
      (login as jest.Mock).mockResolvedValue(true);
      (authenticatedFetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: new Headers(),
        status: 200,
        statusText: 'OK',
        body: async () => '',
      });

      const solidApi = new SolidApi({ webId: 'some_id' } as SessionInfo);

      await solidApi.login();

      expect(login).toHaveBeenCalled();
      expect(authenticatedFetch).toHaveBeenCalled();

      expect(solidApi.getProfile()).toEqual({
        name: 'Solid User',
      });
    });
  });
});
