import { ChromeExtensionRedirector } from './ChromeExtensionRedirector';
import { launchWebAuthFlow } from './launchWebAuthFlow';

jest.mock('./launchWebAuthFlow');

describe('ChromeExtensionRedirector', () => {
  describe('redirect', () => {
    it('launches a web auth flow', () => {
      const redirector = new ChromeExtensionRedirector();
      redirector.redirect('/redirect-url', {});

      expect(launchWebAuthFlow).toHaveBeenCalledWith(
        {
          url: '/redirect-url',
          interactive: true,
        },
        expect.anything()
      );
    });
  });
});
