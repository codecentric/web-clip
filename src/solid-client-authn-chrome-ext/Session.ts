import {
  ILoginInputOptions,
  ISessionInfo,
} from '@inrupt/solid-client-authn-browser';
import ClientAuthentication from '@inrupt/solid-client-authn-browser/dist/ClientAuthentication';
import { EventEmitter } from 'events';
import { v4 as uuid } from 'uuid';
import { RedirectInfo } from './ChromeExtensionRedirector';
import { getClientAuthentication } from './getClientAuthentication';

export class Session extends EventEmitter {
  private clientAuthentication: ClientAuthentication;
  public info: ISessionInfo = {
    sessionId: uuid(),
    isLoggedIn: false,
  };
  public fetch: typeof fetch = window.fetch.bind(window);

  constructor() {
    super();
    this.clientAuthentication = getClientAuthentication(
      (redirectInfo: RedirectInfo) => {
        const { fetch, ...info } = redirectInfo;
        this.info = info;
        this.fetch = fetch;
      }
    );
  }

  login = async (options: ILoginInputOptions) => {
    await this.clientAuthentication.login(
      {
        sessionId: this.info.sessionId,
        ...options,
        tokenType: options.tokenType ?? 'DPoP',
      },
      this
    );
  };
}
