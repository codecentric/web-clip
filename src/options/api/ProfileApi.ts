import { LiveStore } from 'rdflib';
import { Session } from '../../solid-client-authn-chrome-ext/Session';
import { ProfileStore } from './ProfileStore';

export class ProfileApi {
  private store: ProfileStore;
  constructor(private session: Session, private liveStore: LiveStore) {
    this.store = new ProfileStore(liveStore);
  }

  hasGrantedAccessTo(extensionUrl: string): Promise<boolean> {
    return Promise.resolve(false);
  }
}
