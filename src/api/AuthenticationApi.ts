import { ILoginInputOptions } from '@inrupt/solid-client-authn-browser';
import { SolidSession } from './SolidSession';

export class AuthenticationApi {
  private readonly session: SolidSession;

  private readonly redirectUrl: string;
  private readonly providerUrl: string;

  constructor(
    session: SolidSession,
    providerUrl: string,
    redirectUrl: string = window.location.href
  ) {
    this.session = session;
    this.redirectUrl = redirectUrl;
    this.providerUrl = providerUrl;
  }

  async login(options: ILoginInputOptions = {}) {
    if (!this.providerUrl) {
      throw new Error('No pod provider URL configured');
    }
    return this.session.login({
      oidcIssuer: this.providerUrl,
      redirectUrl: this.redirectUrl,
      ...options,
    });
  }

  async logout() {
    await this.session.logout();
  }
}
