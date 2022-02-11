import {
  ILoginInputOptions,
  ISessionInfo,
} from '@inrupt/solid-client-authn-browser';
import ClientAuthentication from '@inrupt/solid-client-authn-browser/dist/ClientAuthentication';
import { getClientAuthentication } from './getClientAuthentication';

export class ChromeExtensionSession {
  private clientAuthentication: ClientAuthentication;
  public fetch: typeof fetch = window.fetch.bind(window);
  public info: ISessionInfo = {
    isLoggedIn: false,
    sessionId: '690a9751-1dc4-46bc-a775-ec12eb5b06ec', // just generate a random uuid
  };

  constructor() {
    this.clientAuthentication = getClientAuthentication((info) => {
      this.info = info;
      this.fetch = info.fetch;
    });
  }

  async login(options: ILoginInputOptions) {
    await this.clientAuthentication.login(
      {
        sessionId: this.info.sessionId,
        ...options,
        // Defaults the token type to DPoP
        tokenType: options.tokenType ?? 'DPoP',
      },
      null
    );
  }

  async logout() {
    await this.clientAuthentication.logout(this.info.sessionId);
    this.info.isLoggedIn = false;
    this.info.webId = '';
    this.fetch = window.fetch.bind(window);
  }
}
