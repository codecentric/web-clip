import { IRedirectHandler, IRedirector } from '@inrupt/solid-client-authn-core';
import { launchWebAuthFlow } from './launchWebAuthFlow';
import { ISessionInfo } from '@inrupt/solid-client-authn-browser';

export type RedirectInfo = ISessionInfo & { fetch: typeof fetch };

export class ChromeExtensionRedirector implements IRedirector {
  constructor(
    private readonly redirectHandler: IRedirectHandler,
    private readonly afterRedirect: (info: RedirectInfo, error?: Error) => void
  ) {}

  redirect(redirectUrl: string): void {
    launchWebAuthFlow(
      {
        url: redirectUrl,
        interactive: true,
      },
      async (redirectUrl, error) => {
        try {
          if (error) {
            throw error;
          }
          const sessionInfo = await this.redirectHandler.handle(
            redirectUrl,
            undefined
          );
          this.afterRedirect(sessionInfo);
        } catch (error) {
          this.afterRedirect(
            {
              isLoggedIn: false,
              fetch: undefined,
              sessionId: '',
            },
            error
          );
        }
      }
    );
  }
}
