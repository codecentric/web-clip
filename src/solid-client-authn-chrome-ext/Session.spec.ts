import { when } from 'jest-when';
import nock from 'nock';
import { now } from './time';
import { RedirectInfo } from './ChromeExtensionRedirector';
import { Session } from './Session';
import { getClientAuthentication } from './getClientAuthentication';
import { v4 as uuid } from 'uuid';

jest.mock('./getClientAuthentication');
jest.mock('uuid');

jest.mock('./time');

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
      session.login({}).then();
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
      session
        .login({
          oidcIssuer: 'https://issuer.example',
          clientName: 'Test Client',
          tokenType: 'Bearer',
        })
        .then();
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
    let onLogin: () => unknown;
    let loginPromise: Promise<void>;
    beforeEach(async () => {
      const clientAuthentication = {
        login: jest.fn(),
      };
      (getClientAuthentication as jest.Mock).mockReturnValue(
        clientAuthentication
      );
      onLogin = jest.fn();
      session = new Session();
      authenticatedFetch = jest.fn();
      session.onLogin(onLogin);
      loginPromise = session.login({});
      const afterRedirect = (getClientAuthentication as jest.Mock).mock
        .calls[0][0];
      afterRedirect({
        sessionId: 'db180742-9c17-4e91-94fc-3422a0e75dd9',
        isLoggedIn: true,
        webId: 'https://pod.example/alice#me',
        fetch: authenticatedFetch,
      } as RedirectInfo);
      await loginPromise;
    });

    it('the login promise resolves', async () => {
      await expect(loginPromise).resolves.not.toThrow();
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

    it('emits login event', () => {
      expect(onLogin).toHaveBeenCalled();
    });
  });

  describe('after redirect from failed login', () => {
    let session: Session;
    let onLogin: () => unknown;
    let unauthenticatedFetch: typeof fetch;
    let loginPromise: Promise<void>;
    beforeEach(async () => {
      const clientAuthentication = {
        login: jest.fn(),
      };
      (getClientAuthentication as jest.Mock).mockReturnValue(
        clientAuthentication
      );
      onLogin = jest.fn();
      session = new Session();
      unauthenticatedFetch = session.fetch;
      session.onLogin(onLogin);
      loginPromise = session.login({});
      const afterRedirect = (getClientAuthentication as jest.Mock).mock
        .calls[0][0];
      afterRedirect({
        sessionId: 'db180742-9c17-4e91-94fc-3422a0e75dd9',
        isLoggedIn: false,
        webId: 'https://pod.example/alice#me',
      } as RedirectInfo);
      await loginPromise;
    });

    it('updates the session info', async () => {
      expect(session.info).toEqual({
        sessionId: 'db180742-9c17-4e91-94fc-3422a0e75dd9',
        isLoggedIn: false,
        webId: 'https://pod.example/alice#me',
      });
    });

    it('keeps the unauthenticated fetch', async () => {
      expect(session.fetch).toBe(unauthenticatedFetch);
    });

    it('does not emit login event', async () => {
      expect(onLogin).not.toHaveBeenCalled();
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

    it('emits logout event', async () => {
      const clientAuthentication = {
        logout: jest.fn(),
      };
      (getClientAuthentication as jest.Mock).mockReturnValue(
        clientAuthentication
      );
      const onLogout = jest.fn();
      const session = new Session();
      session.onLogout(onLogout);
      await session.logout();
      expect(onLogout).toHaveBeenCalled();
    });
  });

  describe('is expired', () => {
    let session: Session;
    beforeEach(() => {
      session = new Session();
      when(now).mockReturnValue(1234);
    });
    it('returns false if not logged in', async () => {
      expect(session.isExpired()).toBe(false);
    });
    it('returns true if logged in and expiration date is reached', () => {
      session.info = {
        sessionId: '8df398ce-b3c9-4410-a446-914a50c96842',
        isLoggedIn: true,
        webId: 'https://pod.example/alice#me',
        expirationDate: 1234,
      };
      expect(session.isExpired()).toBe(true);
    });
    it('returns false if logged in but expiration date is in future', () => {
      session.info = {
        sessionId: '8df398ce-b3c9-4410-a446-914a50c96842',
        isLoggedIn: true,
        webId: 'https://pod.example/alice#me',
        expirationDate: 1235,
      };
      expect(session.isExpired()).toBe(false);
    });

    it.each([null, undefined, 0])(
      'returns false if logged in but expiration date is not given',
      (expirationDate) => {
        session.info = {
          sessionId: '8df398ce-b3c9-4410-a446-914a50c96842',
          isLoggedIn: true,
          webId: 'https://pod.example/alice#me',
          expirationDate,
        };
        expect(session.isExpired()).toBe(false);
      }
    );
  });
});
