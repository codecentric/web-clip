import { IndexedFormula, sym, Namespace } from 'rdflib';

const acl = Namespace('http://www.w3.org/ns/auth/acl#')

export class OptionsStore {
  private store: IndexedFormula;

  constructor(store: IndexedFormula) {
    this.store = store;
  }

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
