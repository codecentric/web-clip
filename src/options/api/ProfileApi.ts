import { Fetcher, LiveStore, Namespace, st, sym, UpdateManager } from 'rdflib';
import { ExtensionUrl } from '../../chrome/urls';
import { ProfileStore } from './ProfileStore';
import { SolidSession } from './SolidSession';

const acl = Namespace('http://www.w3.org/ns/auth/acl#');

/**
 * User profile related API calls to the Solid Pod
 */
export class ProfileApi {
  private store: ProfileStore;
  private fetcher: Fetcher;
  private updater: UpdateManager;

  constructor(private session: SolidSession, liveStore: LiveStore) {
    this.store = new ProfileStore(liveStore);
    this.fetcher = liveStore.fetcher;
    this.updater = liveStore.updater;
  }

  /**
   * Determines whether the currently authenticated user either
   * 1) has configured the required access permissions to the given extension in their
   *    profile document
   * or
   * 2) uses a Pod server that does not use origin based authorization
   *
   * Returns false if none of this is the case, true otherwise
   *
   * @param extensionUrl The actual url of the extension
   * @param redirectUrl The pseudo-redirect url of the extension
   */
  async canExtensionAccessPod(extensionUrl: ExtensionUrl, redirectUrl: URL) {
    const webId = this.session.info.webId;
    await this.fetcher.load(webId);
    if (!this.store.holdsOrigin(webId, redirectUrl.origin)) {
      // assume the pod provider does NOT use origin based authorization
      return true;
    }
    return this.store.checkAccessPermissions(webId, extensionUrl.origin);
  }

  async grantAccessTo(extensionUrl: ExtensionUrl) {
    const webId = this.session.info.webId;
    const me = sym(webId);
    const profileDoc = me.doc();
    const trustedApp = sym(profileDoc.uri + '#trust-webclip');
    const trustStatements = [
      st(me, acl('trustedApp'), trustedApp, profileDoc),
      st(trustedApp, acl('origin'), sym(extensionUrl.origin), profileDoc),
      st(trustedApp, acl('mode'), acl('Read'), profileDoc),
      st(trustedApp, acl('mode'), acl('Write'), profileDoc),
      st(trustedApp, acl('mode'), acl('Append'), profileDoc),
    ];
    return this.updater.update([], trustStatements);
  }

  getProfileDocUrl() {
    return sym(this.session.info.webId).doc().uri;
  }
}
