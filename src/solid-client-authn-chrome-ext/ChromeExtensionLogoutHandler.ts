import {
  ILogoutHandler,
  ISessionInfoManager,
} from '@inrupt/solid-client-authn-core';
import { chromeExtensionLogout } from './chromeExtensionLogout';

export class ChromeExtensionLogoutHandler implements ILogoutHandler {
  constructor(private sessionInfoManager: ISessionInfoManager) {}

  async canHandle(): Promise<boolean> {
    return true;
  }

  async handle(userId: string): Promise<void> {
    await chromeExtensionLogout();
    await this.sessionInfoManager.clear(userId);
  }
}
