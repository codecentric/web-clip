import { Session as BrowserSession } from '@inrupt/solid-client-authn-browser';
import { Session as ChromeExtensionSession } from '../solid-client-authn-chrome-ext/Session';

export type SolidSession = BrowserSession | ChromeExtensionSession;
