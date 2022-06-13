import { Fetcher, LiveStore, UpdateManager } from 'rdflib';
import { Storage } from '../domain/Storage';
import { StorageStore } from '../store/StorageStore';

export class StorageApi {
  private store: StorageStore;
  private fetcher: Fetcher;
  private updater: UpdateManager;

  constructor(private webId: string, liveStore: LiveStore) {
    this.store = new StorageStore(liveStore);
    this.fetcher = liveStore.fetcher;
    this.updater = liveStore.updater;
  }

  async findStorage(): Promise<Storage | null> {
    await this.fetcher.load(this.webId);
    return this.store.getStorageForWebId(this.webId);
  }

  async validateIfContainer(containerUrl: string): Promise<boolean> {
    await this.fetcher.load(containerUrl);
    return this.store.isContainer(containerUrl);
  }
}
