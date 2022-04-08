import { IRedirectHandler } from '@inrupt/solid-client-authn-core';
import { ChromeExtensionRedirector } from './ChromeExtensionRedirector';
import { launchWebAuthFlow } from './launchWebAuthFlow';

jest.mock('./launchWebAuthFlow');

describe('ChromeExtensionRedirector', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  function mockRedirectHandler(): IRedirectHandler {
    return {
      handle: jest.fn(),
      canHandle: jest.fn(),
    };
  }

  describe('redirect', () => {
    it('launches a web auth flow', () => {
      const redirectHandler = mockRedirectHandler();
      const redirector = new ChromeExtensionRedirector(
        redirectHandler,
        () => null
      );
      redirector.redirect('/redirect-url');

      expect(launchWebAuthFlow).toHaveBeenCalledWith(
        {
          url: '/redirect-url',
          interactive: true,
        },
        expect.anything()
      );
    });

    it('calls the redirect handler when web auth flow returns to extension', () => {
      const redirectHandler = mockRedirectHandler();

      const redirector = new ChromeExtensionRedirector(
        redirectHandler,
        () => null
      );
      redirector.redirect('/redirect-url');

      const returnToExtension = (launchWebAuthFlow as jest.Mock).mock
        .calls[0][1];

      returnToExtension('/redirect-url?code=123');
      expect(redirectHandler.handle).toHaveBeenCalledWith(
        '/redirect-url?code=123',
        undefined
      );
    });

    it('calls the after redirect handler with the session info and authenticated fetch', async () => {
      const redirectHandler = mockRedirectHandler();
      const sessionInfo = {
        isLoggedIn: true,
        sessionID: 'session-id',
        fetch: jest.fn(),
      };
      (redirectHandler.handle as jest.Mock).mockResolvedValue(sessionInfo);

      const afterRedirect = jest.fn();

      const redirector = new ChromeExtensionRedirector(
        redirectHandler,
        afterRedirect
      );
      redirector.redirect('/redirect-url');

      const returnToExtension = (launchWebAuthFlow as jest.Mock).mock
        .calls[0][1];

      await returnToExtension('/redirect-url?code=123');

      expect(afterRedirect).toHaveBeenCalledWith(sessionInfo);
    });

    it('calls the after redirect handler with an error', async () => {
      const redirectHandler = mockRedirectHandler();

      (redirectHandler.handle as jest.Mock).mockRejectedValue(
        new Error('this failed')
      );

      const afterRedirect = jest.fn();

      const redirector = new ChromeExtensionRedirector(
        redirectHandler,
        afterRedirect
      );
      redirector.redirect('/redirect-url');

      const returnToExtension = (launchWebAuthFlow as jest.Mock).mock
        .calls[0][1];

      await returnToExtension('/redirect-url?code=123');

      expect(afterRedirect).toHaveBeenCalledWith(
        {
          isLoggedIn: false,
          sessionId: '',
          fetch: undefined,
        },
        new Error('this failed')
      );
    });
  });
});
