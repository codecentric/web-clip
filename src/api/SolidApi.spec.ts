import {
  login,
  fetch as authenticatedFetch,
} from '@inrupt/solid-client-authn-browser';
import { SessionInfo, SolidApi } from './SolidApi';

jest.mock('@inrupt/solid-client-authn-browser');

describe('SolidApi', () => {
  describe('loadProfile', () => {
    describe('profile can be read after being loaded', () => {
      it('name is Anonymous, when profile contains no name', async () => {
        (login as jest.Mock).mockResolvedValue(true);
        mockFetch('');

        const solidApi = new SolidApi({
          webId: 'https://pod.example/#me',
          isLoggedIn: true,
        } as SessionInfo);

        await solidApi.loadProfile();

        expect(authenticatedFetch).toHaveBeenCalledWith(
          'https://pod.example/',
          expect.anything()
        );

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
          isLoggedIn: true,
        } as SessionInfo);

        await solidApi.loadProfile();

        expect(authenticatedFetch).toHaveBeenCalledWith(
          'https://pod.example/',
          expect.anything()
        );

        expect(solidApi.getProfile()).toEqual({
          name: 'Solid User',
        });
      });
    });
    it('profile cannot be loaded, when noone is logged in', async () => {
      const solidApi = new SolidApi({
        isLoggedIn: false,
      } as SessionInfo);

      await expect(solidApi.loadProfile()).rejects.toThrow(
        'No user is logged in.'
      );
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
