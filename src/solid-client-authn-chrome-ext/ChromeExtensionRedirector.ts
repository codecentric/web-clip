import { IRedirectHandler, IRedirector } from '@inrupt/solid-client-authn-core';
import { launchWebAuthFlow } from './launchWebAuthFlow';

export class ChromeExtensionRedirector implements IRedirector {
  constructor(private readonly redirectHandler: IRedirectHandler) {}

  redirect(redirectUrl: string): void {
    launchWebAuthFlow(
      {
        url: redirectUrl,
        interactive: true,
      },
      (redirectUrl) => {
        this.redirectHandler.handle(redirectUrl, undefined);
      }
    );
  }
}
