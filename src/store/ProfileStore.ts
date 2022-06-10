import { IndexedFormula, sym, Namespace } from 'rdflib';

const acl = Namespace('http://www.w3.org/ns/auth/acl#');

/**
 * User profile related queries to a rdflib store
 */
export class ProfileStore {
  private store: IndexedFormula;

  constructor(store: IndexedFormula) {
    this.store = store;
  }

  /**
   * Checks whether the profile document of the given WebID
   * holds any statement pointing to the given origin
   *
   * @param webId The Web ID of the user, whose profile document is checked
   * @param origin The origin that is looked for
   */
  holdsOrigin(webId: string, origin: string) {
    const profileDoc = sym(webId).doc();
    return this.store.holds(null, acl('origin'), sym(origin), profileDoc);
  }

  /**
   * Checks whether the user identified by the given Web ID has granted all the
   * required permissions to the WebClip extension identified by the given origin
   *
   * @param webId The Web ID of the user, whose profile document is checked
   * @param extensionOrigin The origin of the extension whose permissions are checked
   */
  checkAccessPermissions(webId: string, extensionOrigin: string) {
    const profileDoc = sym(webId).doc();
    const trustedApp = this.store.anyStatementMatching(
      null,
      acl('origin'),
      sym(extensionOrigin),
      profileDoc
    )?.subject;
    if (!trustedApp) return false;
    const isTrusted: boolean = this.store.holds(
      sym(webId),
      acl('trustedApp'),
      trustedApp
    );
    const canRead = this.store.holds(
      trustedApp,
      acl('mode'),
      acl('Read'),
      profileDoc
    );
    const canWrite = this.store.holds(
      trustedApp,
      acl('mode'),
      acl('Write'),
      profileDoc
    );
    const canAppend = this.store.holds(
      trustedApp,
      acl('mode'),
      acl('Append'),
      profileDoc
    );
    return isTrusted && canRead && canWrite && canAppend;
  }
}
