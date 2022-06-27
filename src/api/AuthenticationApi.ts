import { ILoginInputOptions } from '@inrupt/solid-client-authn-browser';
import { OptionsStorage } from '../options/OptionsStorage';
import { SolidSession } from './SolidSession';

export class AuthenticationApi {
  private readonly session: SolidSession;

  private readonly redirectUrl: string;
  private readonly optionsStorage: OptionsStorage;

  constructor(
    session: SolidSession,
    optionsStorage: OptionsStorage,
    redirectUrl: string = window.location.href
  ) {
    this.session = session;
    this.redirectUrl = redirectUrl;
    this.optionsStorage = optionsStorage;
  }

  async login(options: ILoginInputOptions = {}) {
    const { providerUrl } = this.optionsStorage.getOptions();
    if (!providerUrl) {
      throw new Error('No pod provider URL configured');
    }
    return this.session.login({
      oidcIssuer: providerUrl,
      redirectUrl: this.redirectUrl,
      ...options,
    });
  }

  async logout() {
    await this.session.logout();
  }
}
