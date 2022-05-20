import { Fetcher, LiveStore, Namespace, st, sym, UpdateManager } from 'rdflib';
import { Session } from '../../solid-client-authn-chrome-ext/Session';
import { ProfileStore } from './ProfileStore';

const acl = Namespace('http://www.w3.org/ns/auth/acl#');

/**
 * User profile related API calls to the Solid Pod
 */
export class ProfileApi {
  private store: ProfileStore;
  private fetcher: Fetcher;
  private updater: UpdateManager;

  constructor(private session: Session, liveStore: LiveStore) {
    this.store = new ProfileStore(liveStore);
    this.fetcher = liveStore.fetcher;
    this.updater = liveStore.updater;
  }

  /**
   * Determines whether the currently authenticated user has configured the
   * required access permissions to the given extension origin in their
   * profile document
   *
   * @param extensionUrl
   */
  async hasGrantedAccessTo(extensionUrl: string) {
    const webId = this.session.info.webId;
    await this.fetcher.load(webId);
    return this.store.checkAccessPermissions(webId, extensionUrl);
  }

  async grantAccessTo(extensionUrl: string) {
    const webId = this.session.info.webId;
    const me = sym(webId);
    const profileDoc = me.doc();
    const trustedApp = sym(profileDoc.uri + '#trust-webclip');
    const trustStatements = [
      st(me, acl('trustedApp'), trustedApp, profileDoc),
      st(trustedApp, acl('origin'), sym(extensionUrl), profileDoc),
      st(trustedApp, acl('mode'), acl('Read'), profileDoc),
      st(trustedApp, acl('mode'), acl('Write'), profileDoc),
      st(trustedApp, acl('mode'), acl('Append'), profileDoc),
    ];
    return this.updater.update([], trustStatements);
  }
}
