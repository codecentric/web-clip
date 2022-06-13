import { Fetcher, LiveStore, UpdateManager } from 'rdflib';
import { ProfileStore } from '../store/ProfileStore';
import { StorageStore } from '../store/StorageStore';
import { SolidSession } from './SolidSession';

export class StorageApi {
  private store: StorageStore;
  private fetcher: Fetcher;
  private updater: UpdateManager;

  constructor(private webId: string, liveStore: LiveStore) {
    this.store = new StorageStore(liveStore);
    this.fetcher = liveStore.fetcher;
    this.updater = liveStore.updater;
  }

  async findStorage() {
    await this.fetcher.load(this.webId);
    return this.store.getStorageForWebId(this.webId);
  }
}
