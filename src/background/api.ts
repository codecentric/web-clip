import { SolidApi } from '../api/SolidApi';
import { Session } from '../solid-client-authn-chrome-ext/Session';
import { Store } from '../store/Store';

const solidApi = new SolidApi(new Session(), new Store());

export function login() {
  return solidApi.login({
    redirectUrl: chrome.identity.getRedirectURL(),
    clientName: 'WebClip Chrome Extension',
  });
}
