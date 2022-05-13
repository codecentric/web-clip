import { LiveStore } from 'rdflib';
import { Session } from '../solid-client-authn-chrome-ext/Session';
import { OptionsStore } from './OptionsStore';

export class ProfileApi {
  private store: OptionsStore;
  constructor(private session: Session, private liveStore: LiveStore) {
    this.store = new OptionsStore(liveStore);
  }

  hasGrantedAccessTo(extensionUrl: string): Promise<boolean> {
    return Promise.resolve(false);
  }
}
