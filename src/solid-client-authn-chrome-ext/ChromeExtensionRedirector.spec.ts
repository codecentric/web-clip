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
      const redirector = new ChromeExtensionRedirector(redirectHandler);
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

      const redirector = new ChromeExtensionRedirector(redirectHandler);
      redirector.redirect('/redirect-url');

      const returnToExtension = (launchWebAuthFlow as jest.Mock).mock
        .calls[0][1];

      returnToExtension('/redirect-url?code=123');
      expect(redirectHandler.handle).toHaveBeenCalledWith(
        '/redirect-url?code=123',
        undefined
      );
    });
  });
});
