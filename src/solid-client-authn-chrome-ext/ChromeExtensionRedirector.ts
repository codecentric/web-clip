import {
  IRedirector,
  IRedirectorOptions,
} from '@inrupt/solid-client-authn-core';
import { launchWebAuthFlow } from './launchWebAuthFlow';

export class ChromeExtensionRedirector implements IRedirector {
  redirect(redirectUrl: string, redirectorOptions: IRedirectorOptions): void {
    launchWebAuthFlow(
      {
        url: redirectUrl,
        interactive: true,
      },
      () => {
        throw new Error('Not implemented');
      }
    );
  }
}
