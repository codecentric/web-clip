import {
  login,
  fetch as authenticatedFetch,
} from '@inrupt/solid-client-authn-browser';
import { SessionInfo, SolidApi } from './SolidApi';

jest.mock('@inrupt/solid-client-authn-browser');

describe('SolidApi', () => {
  describe('login', () => {
    describe('profile can be read after login', () => {
      it('name is Anonymous, when profile contains no name', async () => {
        (login as jest.Mock).mockResolvedValue(true);
        mockFetch('');

        const solidApi = new SolidApi({
          webId: 'https://pod.example/#me',
        } as SessionInfo);

        await solidApi.login();

        expect(login).toHaveBeenCalled();
        expect(authenticatedFetch).toHaveBeenCalled();

        expect(solidApi.getProfile()).toEqual({
          name: 'Anonymous',
        });
      });

      it('name is read from vcard:fn', async () => {
        (login as jest.Mock).mockResolvedValue(true);
        mockFetch(`
          <https://pod.example/#me>
            <http://www.w3.org/2006/vcard/ns#fn> "Solid User" .
          `);

        const solidApi = new SolidApi({
          webId: 'https://pod.example/#me',
        } as SessionInfo);

        await solidApi.login();

        expect(login).toHaveBeenCalled();
        expect(authenticatedFetch).toHaveBeenCalled();

        expect(solidApi.getProfile()).toEqual({
          name: 'Solid User',
        });
      });
    });
  });
});

function mockFetch(bodyText: string) {
  (authenticatedFetch as jest.Mock).mockResolvedValue({
    ok: true,
    headers: new Headers({
      'Content-Type': 'text/turtle',
    }),
    status: 200,
    statusText: 'OK',
    text: async () => bodyText,
  });
}
