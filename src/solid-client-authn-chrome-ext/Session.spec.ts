import nock from 'nock';
import { RedirectInfo } from './ChromeExtensionRedirector';
import { Session } from './Session';
import { getClientAuthentication } from './getClientAuthentication';
import { v4 as uuid } from 'uuid';

jest.mock('./getClientAuthentication');
jest.mock('uuid');

describe('Session', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (uuid as jest.Mock).mockReturnValueOnce(
      '8df398ce-b3c9-4410-a446-914a50c96842'
    );
    (uuid as jest.Mock).mockReturnValue('only one uuid should be generated');
  });

  describe('after creation', () => {
    let session: Session;
    beforeEach(() => {
      session = new Session();
    });
    it('the user is not logged in', async () => {
      expect(session.info.isLoggedIn).toBe(false);
    });

    it('a random uuid has been assigned as session id', async () => {
      expect(session.info.sessionId).toBe(
        '8df398ce-b3c9-4410-a446-914a50c96842'
      );
    });

    it('webId is undefined', () => {
      expect(session.info.webId).toBeUndefined();
    });

    it('fetch defaults to unauthenticated window fetch', async () => {
      nock('https://pod.example')
        .persist()
        .get('/resource')
        .reply(200, { data: 42 });
      expect(session.fetch).toBeInstanceOf(Function);
      const result = await session.fetch('https://pod.example/resource');
      await expect(result.json()).resolves.toEqual({ data: 42 });
    });
  });

  describe('login', () => {
    it('delegates login to client authentication passing sessionId and tokenType DPoP as default', async () => {
      const clientAuthentication = {
        login: jest.fn(),
      };
      (getClientAuthentication as jest.Mock).mockReturnValue(
        clientAuthentication
      );
      const session = new Session();
      await session.login({});
      expect(clientAuthentication.login).toHaveBeenCalledWith(
        {
          sessionId: '8df398ce-b3c9-4410-a446-914a50c96842',
          tokenType: 'DPoP',
        },
        session
      );
    });

    it('delegates login options to client authentication and overrides default token type', async () => {
      (uuid as jest.Mock).mockReturnValue(
        '8df398ce-b3c9-4410-a446-914a50c96842'
      );
      const clientAuthentication = {
        login: jest.fn(),
      };
      (getClientAuthentication as jest.Mock).mockReturnValue(
        clientAuthentication
      );
      const session = new Session();
      await session.login({
        oidcIssuer: 'https://issuer.example',
        clientName: 'Test Client',
        tokenType: 'Bearer',
      });
      expect(clientAuthentication.login).toHaveBeenCalledWith(
        {
          sessionId: '8df398ce-b3c9-4410-a446-914a50c96842',
          oidcIssuer: 'https://issuer.example',
          clientName: 'Test Client',
          tokenType: 'Bearer',
        },
        session
      );
    });
  });

  describe('after redirect', () => {
    let session: Session;
    let authenticatedFetch: typeof fetch;
    beforeEach(async () => {
      const clientAuthentication = {
        login: jest.fn(),
      };
      (getClientAuthentication as jest.Mock).mockReturnValue(
        clientAuthentication
      );
      session = new Session();
      authenticatedFetch = jest.fn();

      await session.login({});
      const afterRedirect = (getClientAuthentication as jest.Mock).mock
        .calls[0][0];
      afterRedirect({
        sessionId: 'db180742-9c17-4e91-94fc-3422a0e75dd9',
        isLoggedIn: true,
        webId: 'https://pod.example/alice#me',
        fetch: authenticatedFetch,
      } as RedirectInfo);
    });

    it('updates the session info', async () => {
      expect(session.info).toEqual({
        sessionId: 'db180742-9c17-4e91-94fc-3422a0e75dd9',
        isLoggedIn: true,
        webId: 'https://pod.example/alice#me',
      });
    });

    it('updates fetch to authenticated fetch', async () => {
      await session.fetch('https://pod.example/private');
      expect(authenticatedFetch).toHaveBeenCalledWith(
        'https://pod.example/private'
      );
    });
  });

  describe('logout', () => {
    it('calls client authentication logout with the session id', async () => {
      const clientAuthentication = {
        logout: jest.fn(),
      };
      (getClientAuthentication as jest.Mock).mockReturnValue(
        clientAuthentication
      );
      const session = new Session();
      await session.logout();
      expect(clientAuthentication.logout).toHaveBeenCalledWith(
        '8df398ce-b3c9-4410-a446-914a50c96842'
      );
    });

    it('resets the session logged in status, but keeps session id and WebID', async () => {
      const clientAuthentication = {
        logout: jest.fn(),
      };
      (getClientAuthentication as jest.Mock).mockReturnValue(
        clientAuthentication
      );
      const session = new Session();
      session.info = {
        sessionId: '8df398ce-b3c9-4410-a446-914a50c96842',
        isLoggedIn: true,
        webId: 'https://pod.example/alice#me',
      };
      await session.logout();
      expect(session.info.sessionId).toBe(
        '8df398ce-b3c9-4410-a446-914a50c96842'
      );
      expect(session.info.webId).toBe('https://pod.example/alice#me');
      expect(session.info.isLoggedIn).toBe(false);
    });

    it('resets the fetch to client authentication fetch', async () => {
      const authenticatedFetch = jest.fn();
      const clientAuthenticationFetch = jest.fn();

      const clientAuthentication = {
        logout: jest.fn(),
        fetch: clientAuthenticationFetch,
      };
      (getClientAuthentication as jest.Mock).mockReturnValue(
        clientAuthentication
      );
      const session = new Session();
      session.fetch = authenticatedFetch;
      await session.logout();
      expect(session.fetch).toBe(clientAuthenticationFetch);
    });
  });
});
