import { Fetcher, LiveStore } from 'rdflib';
import { Session } from '../../solid-client-authn-chrome-ext/Session';
import { ProfileStore } from './ProfileStore';

/**
 * User profile related API calls to the Solid Pod
 */
export class ProfileApi {
  private store: ProfileStore;
  private fetcher: Fetcher;

  constructor(private session: Session, liveStore: LiveStore) {
    this.store = new ProfileStore(liveStore);
    this.fetcher = liveStore.fetcher;
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
}
